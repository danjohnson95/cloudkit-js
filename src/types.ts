declare class CloudKitJs {
    constructor(initParams: InitParams);
    queryRecords(queryRecordOptions: QueryRecordOptions): Promise<RecordQueryResponse>
    getRecordByName(recordName: string, desiredKeys?: string[]): Promise<RecordQueryResponse>
    createRecord(createRecordOptions: CreateRecordOptions): Promise<RecordQueryResponse>
    createRecords(records: CreateRecordOptions[]): Promise<RecordQueryResponse>
    deleteRecord(deleteRecordOptions: DeleteRecordOptions): Promise<RecordQueryResponse>
    uploadAssetFromUrl(recordType: string, fieldName: string, url: string, recordName: string): Promise<any>
    uploadAsset(recordType: string, fieldName: string, file: Buffer, recordName: string): Promise<any>
}

export enum ComparatorValue {
    /**
     * The left-hand value is equal to the right-hand value.
     */
    Equals = 'EQUALS',

    /**
     * The left-hand value is not equal to the right-hand value.
     */
    NotEquals = 'NOT_EQUALS',

    /**
     * The left-hand value is less than the right-hand value.
     */
    LessThan = 'LESS_THAN',

    /**
     * The left-hand value is less than or equal to the right-hand value.
     */
    LessThanOrEquals = 'LESS_THAN_OR_EQUALS',

    /**
     * The left-hand value is greater than the right-hand value.
     */
    GreaterThan = 'GREATER_THAN',
    
    /**
     * The left-hand value is greater than or equal to the right-hand value.
     */ 
    GreaterThanOrEquals = 'GREATER_THAN_OR_EQUALS',

    /**
     * The left-hand location is within the specified distance of the right-hand location.
     */
    Near = 'NEAR',

    /**
     * The records have text fields that contain all specified tokens.
     */
    ContainsAllTokens = 'CONTAINS_ALL_TOKENS',

    /**
     * The left-hand value is in the right-hand list.
     */
    In = 'IN',

    /**
     * The left-hand value is not in the right-hand list.
     */
    NotIn = 'NOT_IN',

    /**
     * The records with text fields contain any of the specified tokens.
     */
    ContainsAnyTokens = 'CONTAINS_ANY_TOKENS',

    /**
     * The records contain values in a list field.
     */
    ListContains = 'LIST_CONTAINS',
    
    /**
     * The records don’t contain the specified values in a list field.
     */
    NotListContains = 'NOT_LIST_CONTAINS',
    
    /**
     * The records don’t contain any of the specified values in a list field.
     */
    NotListContainsAny = 'NOT_LIST_CONTAINS_ANY',
    
    /**
     * The records with a field that begins with a specified value.
     */
    BeginsWith = 'BEGINS_WITH',
    
    /**
     * The records with a field that doesn’t begin with a specified value.
     */
    NotBeginsWith = 'NOT_BEGINS_WITH',
    
    /**
     * The records contain a specified value as the first item in a list field.
     */
    ListMemberBeginsWith = 'LIST_MEMBER_BEGINS_WITH',
    
    /**
     * The records don’t contain a specified value as the first item in a list field.
     */
    NotListMemberBeginsWith = 'NOT_LIST_MEMBER_BEGINS_WITH',
    
    /**
     * The records contain all values in a list field.
     */
    ListContainsAll = 'LIST_CONTAINS_ALL',
    
    /**
     * The records don’t contain all specified values in a list field.
     */
    NotListContainsAll = 'NOT_LIST_CONTAINS_ALL',
}

export interface RecordQueryResponse {
    /**
     * An array containing a result dictionary for each operation in the request.
     */
    records: Record[]

    /**
     * If included, indicates that there are more results matching this query. To fetch the other results, pass the value of the `continuationMarker` key as the value of the `continuationMarker` key in another query.
     */
    continuationMarker?: string
}

export interface Record {
    /**
     * The unique name used to identify the record within a zone. The default value is a random UUID.
     */
    recordName: string;

    /**
     * The name of the record type. This key is required for certain operations if the record doesn’t exist.
     */
    recordType: RecordType;

    /**
     * The dictionary of key-value pairs whose keys are the record field names and values are field-value dictionaries, described in Record Field Dictionary. The default value is an empty dictionary.
     * If the operation is create and this key is omitted or set to null, all fields in a newly created record are set to null.
     */
    fields: { [index in string]: RecordField }

    /**
     * This field is not documented by Apple.
     * @unknown
     */
    pluginFields: {};

    /**
     * A string containing the server change token for the record. Use this tag to indicate which version of the record you last fetched.
     * This key is required if the operation type is update, replace, or delete. This key is not required if the operation is forceUpdate, forceReplace, or forceDelete.
     */
    recordChangeTag: string;

    /**
     * The dictionary representation of the date the record was created.
     */
    created: Timestamp

    /**
     * The dictionary representation of the date the record was modified.
     */
    modified: Timestamp

    /**
     * A Boolean value indicating whether the record was deleted. If true, it was deleted; otherwise, it was not deleted.
     */
    deleted: boolean;
}

export interface Timestamp {
    /**
     * The number representing the date/time.
     */
    timestamp: number,

    /**
     * The record name representing the user.
     */
    userRecordName: string,

    /**
     * The device where the change occurred.
     */
    deviceID: string,
}

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
    /**
     * A unique identifier for this error.
     */
    uuid: string;

    /**
     * The suggested time to wait before trying this operation again. If this key is not set, the operation can’t be retried.
     */
    retryAfter?: number

    /**
     * A string containing the code for the error that occurred.
     */
    serverErrorCode: ErrorType;

    /**
     * A string indicating the reason for the error.
     */
    reason: string;
}

export type FieldList = {
    [key: string]: FieldType;
}

export interface FilterBy {
    /**
     * A string representing the filter comparison operator.
     */
    comparator: ComparatorValue;

    /**
     * The name of a field belonging to the record type.
     */
    fieldName: string;

    /**
     * A field-value dictionary, representing the value of the field that you want all fetched records to match.
     */
    fieldValue: any;
}

export interface SortBy {
    /**
     * The name of a field belonging to the record type. Used to sort the fetched records.
     */
    fieldName: string;

    /**
     * A Boolean value that indicates whether the fetched records should be sorted in ascending order. If true, the records are sorted in ascending order. If false, the records are sorted in descending order. The default value is true.
     */
    ascending?: boolean;

    /**
     * A field-value dictionary, that is the reference location to use when sorting. Records are sorted based on their distance to this location. Used only if fieldName is a Location type.
     */
    relativeLocation?: RecordField;
}

export interface QueryDictionary {
    /**
     * The name of the record type.
     */
    recordType: RecordType;

    /**
     * An Array of filter dictionaries used to determine whether a record matches the query.
     */
    filterBy?: FilterBy[];

    /**
     * An Array of sort descriptor dictionaries that specify how to order the fetched records.
     */
    sortBy?: SortBy[];
}

export interface QueryRecordOptions {
    /**
     * A dictionary that identifies a record zone in the database.
     */
    zoneID?: string;

    /**
     * The maximum number of records to fetch. The default is the maximum number of records in a response that is allowed, described in [Data Size Limits](https://developer.apple.com/library/archive/documentation/DataManagement/Conceptual/CloudKitWebServicesReference/PropertyMetrics.html#//apple_ref/doc/uid/TP40015240-CH23-SW1).
     */
    resultsLimit?: number;

    /**
     * The query to apply.
     */
    query: QueryDictionary;

    /**
     * The location of the last batch of results. Use this key when the results of a previous fetch exceeds the maximum.
     */
    continuationMarker?: string;

    /**
     * An array of strings containing record field names that limits the amount of data returned in this operation. Only the fields specified in the array are returned. The default is null, which fetches all record fields.
     */
    desiredKeys?: string[];

    /**
     * A Boolean value determining whether all zones should be searched. This key is ignored if zoneID is non-null. To search all zones, set to true. To search the default zone only, set to false.
     */
    zoneWide?: boolean;

    /**
     * A Boolean value indicating whether number fields should be represented by strings. The default value is false.
     */
    numbersAsStrings?: boolean;
}

export interface CreateRecordOptions {
    /**
     * The unique name used to identify the record within a zone. The default value is a random UUID.
     */
    recordName?: string

    /**
     * The name of the record type.
     */
    recordType: RecordType;

    /**
     * The dictionary of key-value pairs whose keys are the record field names and values are field-value dictionaries.
     * If this key is omitted or set to null, all fields in a newly created record are set to null.
     */
    fields?: { [index in string]: RecordField }
}

export interface UpdateRecordOptions {
    /**
     * The unique name used to identify the record within a zone.
     */
    recordName: string

    /**
     * The name of the record type.
     */
    recordType?: RecordType;

    /**
     * A string containing the server change token for the record. Use this tag to indicate which version of the record you last fetched.
     */
    recordChangeTag: string;

    /**
     * The dictionary of key-value pairs whose keys are the record field names and values are field-value dictionaries.
     */
    fields?: { [ index in string]: RecordField }
}

export interface DeleteRecordOptions {
    /**
     * The unique name used to identify the record within a zone.
     */
    recordName: string

    /**
     * The name of the record type.
     */
    recordType?: RecordType;

    /**
     * A string containing the server change token for the record. Use this tag to indicate which version of the record you last fetched.
     */
    recordChangeTag: string;
}

/**
 * The name of the record type
 */
export type RecordType = string

enum DeleteAction {
    /**
     * No action when a referenced record is deleted.
     */
    None = "NONE",

    /**
     * Deletes a source record when the target record is deleted.
     */
    DeleteSelf = "DELETE_SELF",

    /**
     * Deletes a target record only after all source records are deleted. Verifies that the target record exists before creating this type of reference. If it doesn’t exist, creating the reference fails.
     */
    Validate = "VALIDATE"
}

export interface ReferenceField {
    /**
     * The unique name used to identify the record within a zone.
     */
    recordName: string;

    /**
     * The delete action for the reference object
     */
    action?: DeleteAction;
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
    /**
     * A unique identifier for the app’s container. The container ID should begin with `iCloud.`.
     */
    containerName: string;

    /**
     * The version of the app’s container. Pass development to use the environment that is not accessible by apps available on the store. Pass production to use the environment that is accessible by development apps and apps available on the store.
     */
    environment: Environment

    /**
     * The database to store the data within the container.
     */
    database: Database;
}

export enum ErrorType {
    /**
     * You don’t have permission to access the endpoint, record, zone, or database.
     */
    AccessDenied = "ACCESS_DENIED",

    /**
     * An atomic batch operation failed.
     */
    AtomicError = "ATOMIC_ERROR",

    /**
     * Authentication was rejected.
     */
    AuthenticationFailed = "AUTHENTICATION_FAILED",

    /**
     * The request requires authentication but none was provided.
     */
    AuthenticationRequired = "AUTHENTICATION_REQUIRED",

    /**
     * The request was not valid.
     */
    BadRequest = "BAD_REQUEST",

    /**
     * The recordChangeTag value expired. (Retry the request with the latest tag.)
     */
    Conflict = "CONFLICT",

    /**
     * The resource that you attempted to create already exists.
     */
    Exists = "EXISTS",

    /**
     * An internal error occurred.
     */
    InternalError = "INTERNAL_ERROR",

    /**
     * The resource was not found.
     */
    NotFound = "NOT_FOUND",

    /**
     * If accessing the public database, you exceeded the app’s quota. If accessing the private database, you exceeded the user’s iCloud quota.
     */
    QuotaExceeded = "QUOTA_EXCEEDED",

    /**
     * The request was throttled. Try the request again later.
     */
    Throttled = "THROTTLED",

    /**
     * An internal error occurred. Try the request again.
     */
    TryAgainLater = "TRY_AGAIN_LATER",

    /**
     * The request violates a validating reference constraint.
     */
    ValidatingReferenceError = "VALIDATING_REFERENCE_ERROR",

    /**
     * The zone specified in the request was not found.
     */
    ZoneNotFound = "ZONE_NOT_FOUND",
}
