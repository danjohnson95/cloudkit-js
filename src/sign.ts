import crypto from 'crypto'
import { ISignService } from './types'

export class SignService implements ISignService {
    constructor(private readonly privateKey: Buffer, private readonly keyId: string) {
    }

    protected getDateString() {
        // We need to strip out the milliseconds
        return new Date().toISOString().replace(/\.[0-9]+?Z/, "Z")
    }

    public signRequest(payload: string, requestPath: string) {
        const hash = crypto.createHash("sha256")
        const sign = crypto.createSign("RSA-SHA256")

        const now = this.getDateString()

        // Hash the payload
        hash.update(payload, "utf8")

        // Base64 it
        const base64PayloadHash = hash.digest("base64")

        // Now create a signature.
        // It's comprised of [dateString]:[base64PayloadHash]:[requestPath]
        const signatureData = [
            now,
            base64PayloadHash,
            requestPath
        ].join(":")

        // Now we'll RSA-SHA256 sign the signatureData with our private key
        sign.update(signatureData)

        return {
            signature: sign.sign(this.privateKey, "base64"),
            dateString: now
        }
    }

    public getKeyId() {
        return this.keyId
    }
}