import https from "https"
import { ISignService } from "./types";
import zlib from "zlib";

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
                const responseBody: Buffer[] = [];

                response.on("data", function (chunk) {
                    responseBody.push(chunk)
                });
                response.on("end", function () {
                    let buffer = Buffer.concat(responseBody);
                    const encoding = response.headers['content-encoding'];
                    let responseObject = {}

                    if (encoding === 'gzip') {
                        zlib.gunzip(buffer, (err, decoded) => {
                            if (err) {
                                return reject(err);
                            }

                            try {
                                responseObject = JSON.parse(decoded.toString('utf8'));
                            } catch (e) {
                                return reject(e);
                            }

                            resolve(responseObject as T);
                        });
                    } else if (encoding === 'deflate') {
                        zlib.inflate(buffer, (err, decoded) => {
                            if (err) {
                                return reject(err);
                            }

                            try {
                                responseObject = JSON.parse(decoded.toString('utf8'));
                            } catch (e) {
                                return reject(e);
                            }

                            resolve(responseObject as T);
                        });
                    } else {
                        try {
                            responseObject = JSON.parse(buffer.toString('utf8'));
                        } catch (e) {
                            return reject(e);
                        }

                        resolve(responseObject as T);
                    }
                });
            })

            request.on("error", function(err) {
                reject(err)
            })

            request.end(payload)
        })
    }
}