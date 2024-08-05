import { UrlBuilder } from "../src/url"

const urlBuilder = new UrlBuilder({
    containerName: 'iCloud.testContainer',
    environment: 'development',
    database: 'public'
})

test('it gets modify records path', () => {
    expect(urlBuilder.getModifyRecordsPath()).toBe('/database/1/iCloud.testContainer/development/public/records/modify')
})

test('it gets query records path', () => {
    expect(urlBuilder.getQueryRecordsPath()).toBe('/database/1/iCloud.testContainer/development/public/records/query')
})

test('it gets lookup records path', () => {
    expect(urlBuilder.getLookupRecordsPath()).toBe('/database/1/iCloud.testContainer/development/public/records/lookup')
})

test('it gets resolve records path', () => {
    expect(urlBuilder.getResolveRecordsPath()).toBe('/database/1/iCloud.testContainer/development/public/records/resolve')
})

test('it gets share accept path', () => {
    expect(urlBuilder.getShareAcceptPath()).toBe('/database/1/iCloud.testContainer/development/public/records/shares/accept')
})

test('it gets upload assets path', () => {
    expect(urlBuilder.getUploadAssetsPath()).toBe('/database/1/iCloud.testContainer/development/public/assets/upload')
})
