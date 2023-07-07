import { Database } from "../src";

export interface InitParams {
    /**
     * The name of the iCloud container to use
     */
    containerName: string;

    /**
     * The ID of the key to use for signing requests
     */
    keyId: string;

    /**
     * The path to your private key file.
     * You can either specify this, or pass the private key using the `privateKeyContents` parameter.
     */
    privateKeyPath?: string;

    /**
     * Pass the contents of your private key file here.
     * You can either specify this, or pass the path to the private key file using the `privateKeyPath` parameter.
     */
    privateKeyContents?: Buffer;

    /**
     * Set to true to use the production CloudKit environment,
     * otherwise the development environment will be used.
     */
    shouldUseProduction?: boolean;

    /**
     * Which database to use
     */
    database?: Database;
}

export interface ErrorResponse {
    uuid: string;
    serverErrorCode: string;
    reason: string;
}

export enum FieldType {
    String = "String",
    Int64 = "Int64",
    Reference = "Reference",
    Location = "Location",
    Double = "Double",
    DateTime = "DateTime",
    Bytes = "Bytes",
    // List
    // Asset
}

type FieldList = {
    [key: string]: FieldType;
}

export interface FilterBy {
    comparator: string;
    fieldName: string;
    fieldValue: any;
}

export interface SortBy {
    fieldName: string;
    ascending: boolean;
}

export interface QueryFilter {
    comparator: string;
    fieldName: string;
    fieldValue: any;
}

export interface QueryDictionary {
    recordType: RecordType;
    filterBy?: FilterBy;
    sortBy?: SortBy;
    resultsLimit?: number;
    desiredKeys?: string[];
    zoneID?: string;
    zoneWide?: boolean;
    cursor?: string;
    queryFilters?: QueryFilter[];
}

export interface QueryRecordOptions {
    zoneID?: string;
    resultsLimit?: number;
    query: QueryDictionary;
    continuationMarker?: string;
    desiredKeys?: string[];
    zoneWide?: boolean;
    numbersAsStrings?: boolean;
}

export interface CreateRecordOptions {
    recordName?: string
    recordType: RecordType;
    recordChangeTag?: string;
    fields?: { [index in string]: RecordField }
}

export interface DeleteRecordOptions {
    recordName: string
    recordType: RecordType;
    recordChangeTag: string;
}

/**
 * The name of the RecordType
 */
export type RecordType = string

export interface ReferenceField {
    recordName: string;
    action?: "NONE" | "DELETE_SELF" | "VALIDATE";
}

export interface RecordField {
    value: any;
    type?: string
}

export enum FieldType {
    String = "String",
    Int64 = "Int64",
    Reference = "Reference",
    Location = "Location",
    Double = "Double",
    DateTime = "DateTime",
    Bytes = "Bytes",
}

export interface ISignService {
    signRequest(payload: string, requestPath: string): { signature: string, dateString: string }
    getKeyId(): string
}

export type Environment = "development" | "production"
export type Database = "public" | "private" | "shared"

export interface UrlBuilderInitParams {
    containerName: string;
    environment: Environment
    database: Database;
}