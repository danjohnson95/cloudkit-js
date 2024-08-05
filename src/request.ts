import https from "https"
import { ISignService } from "./types";

export class RequestService {
    protected readonly hostname = "api.apple-cloudkit.com";
    protected readonly port = 443;

    constructor(protected readonly signService: ISignService) { }

    public makeRequest<T>(requestPath: string, payload: string): Promise<T> {
        const { dateString, signature } = this.signService.signRequest(payload, requestPath)

        const requestOptions = {
            hostname: this.hostname,
            port: this.port,
            path: requestPath,
            method: "POST",
            headers: {
                "X-Apple-CloudKit-Request-KeyID": this.signService.getKeyId(),
                "X-Apple-CloudKit-Request-ISO8601Date": dateString,
                "X-Apple-CloudKit-Request-SignatureV1": signature
            }
        }

        return new Promise((resolve, reject) => {
            const request = https.request(requestOptions, function(response) {
                let responseBody = ""

                response.on("data", function(chunk) {
                    responseBody += chunk.toString("utf8")
                })

                response.on("end", function() {
                    resolve(JSON.parse(responseBody))
                })
            })

            request.on("error", function(err) {
                reject(err)
            })

            request.end(payload)
        })
    }
}