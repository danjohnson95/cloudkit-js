import fs from 'fs'
import { SignService } from "./sign";
import { RequestService } from "./request";
import { UrlBuilder } from "./url";
import { CreateRecordOptions, DeleteRecordOptions, InitParams, QueryRecordOptions, RecordType, UpdateRecordOptions } from './types';

export class CloudKitJs {
    protected readonly requestService: RequestService
    protected readonly urlBuilder: UrlBuilder

    constructor(protected initParams: InitParams) {
        if (!initParams.privateKeyContents && !initParams.privateKeyPath) {
            throw new Error("You must specify either privateKeyPath or privateKeyContents")
        }

        const signService = new SignService(
            initParams.privateKeyContents || fs.readFileSync(initParams.privateKeyPath!),
            initParams.keyId
        )

        this.requestService = new RequestService(signService)

        this.urlBuilder = new UrlBuilder({
            containerName: initParams.containerName,
            environment: initParams.shouldUseProduction ? "production" : "development",
            database: initParams?.database || "public"
        })
    }

    public async queryRecords(queryRecordOptions: QueryRecordOptions): Promise<any> {
        const payload = JSON.stringify(queryRecordOptions)

        return this.requestService.makeRequest(
            this.urlBuilder.getQueryRecordsPath(),
            payload,
        )
    }

    public async getRecordByName(recordName: string, desiredKeys?: string[]) {
        const payload = JSON.stringify({
            records: [{
                recordName,
                desiredKeys
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getLookupRecordsPath(),
            payload
        )
    }

    public async createRecord(createRecordOptions: CreateRecordOptions) {
        const payload = JSON.stringify({
            operations: [{
                operationType: "create",
                record: {
                    recordType: createRecordOptions.recordType,
                    fields: createRecordOptions.fields,
                }
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async createRecords(records: CreateRecordOptions[]) {
        const payload = JSON.stringify({
            operations: records.map(record => ({
                operationType: "create",
                record: {
                    recordType: record.recordType,
                    fields: record.fields,
                    recordName: record.recordName,
                }
            }))
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async updateRecord(recordName: string, recordType: RecordType, fields: { [index in string]: any }) {
        const payload = JSON.stringify({
            operations: [{
                operationType: "update",
                record: {
                    recordName,
                    recordType,
                    fields
                }
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async forceUpdateRecord(recordName: string, recordType: RecordType, fields: { [index in string]: any }) {
        const payload = JSON.stringify({
            operations: [{
                operationType: "forceUpdate",
                record: {
                    recordName,
                    recordType,
                    fields
                }
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async deleteRecord(deleteRecordOptions: DeleteRecordOptions) {
        const payload = JSON.stringify({
            operations: [{
                operationType: "delete",
                record: {
                    recordName: deleteRecordOptions.recordName,
                    recordType: deleteRecordOptions.recordType,
                    recordChangeTag: deleteRecordOptions.recordChangeTag
                }
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async forceDeleteRecord(deleteRecordOptions: DeleteRecordOptions) {
        const payload = JSON.stringify({
            operations: [{
                operationType: "forceDelete",
                record: {
                    recordName: deleteRecordOptions.recordName,
                    recordType: deleteRecordOptions.recordType,
                }
            }]
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async forceDeleteRecords(recordType: RecordType, recordNames: string[]) {
        const payload = JSON.stringify({
            operations: recordNames.map(recordName => ({
                operationType: "forceDelete",
                record: {
                    recordName,
                    recordType,
                }
            }))
        })

        return this.requestService.makeRequest(
            this.urlBuilder.getModifyRecordsPath(),
            payload
        )
    }

    public async uploadAssetFromUrl(recordType: RecordType, fieldName: string, fileUrl: string, recordName: string) {
        // Download the asset from fileUrl
        const buffer = await (await fetch(fileUrl)).blob()

        return this.uploadAsset(
            recordType,
            fieldName,
            buffer,
            recordName
        )
    }

    public async uploadAsset(recordType: RecordType, fieldName: string, fileContents: Blob, recordName: string) {
        const payload = JSON.stringify({
            tokens: [{
                recordName,
                recordType,
                fieldName
            }]
        })

        const resp = await this.requestService.makeRequest(
            this.urlBuilder.getUploadAssetsPath(),
            payload
        )

        const uploadUrl = (resp as any).tokens[0].url

        const assetResp = await fetch(uploadUrl, {
            method: "POST",
            body: fileContents
        })

        const imageResp = await assetResp.json()

        // Now we need to update the record with the asset
        return this.forceUpdateRecord(
            recordName,
            recordType,
            {
                [fieldName]: {
                    value: imageResp.singleFile
                }
            }
        )
    }
}
