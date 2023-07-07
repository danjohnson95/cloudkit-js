import { Database, Environment, UrlBuilderInitParams } from "../types/global"

export class UrlBuilder {
    protected readonly versionNumber = 1
    protected readonly containerName: string
    protected readonly environment: Environment
    protected readonly database: Database

    constructor(initParams: UrlBuilderInitParams) {
        this.containerName = initParams.containerName
        this.environment = initParams.environment
        this.database = initParams.database || "public"
    }

    protected getBasePath() {
        return [
            `/database`,
            this.versionNumber,
            this.containerName,
            this.environment,
            this.database
        ].join('/')
    }

    /** Records */

    public getModifyRecordsPath() {
        return `${this.getBasePath()}/records/modify`
    }

    public getQueryRecordsPath() {
        return `${this.getBasePath()}/records/query`
    }

    public getLookupRecordsPath() {
        return `${this.getBasePath()}/records/lookup`
    }

    public getResolveRecordsPath() {
        return `${this.getBasePath()}/records/resolve`
    }

    public getShareAcceptPath() {
        return `${this.getBasePath()}/records/shares/accept`
    }
}