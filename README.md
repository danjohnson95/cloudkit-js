# CloudKit JS

cloudkitjs aims to make it easy for you to manage your CloudKit container from your Node.js server.

It's as simple as this

```javascript
import { CloudKitJs } from 'cloudkit-js';

const lib = new CloudKitJs({
    containerName: "iCloud.com.your.container.name",
    keyId: "xxx",
    privateKeyFile: "eckey.pem"
})

lib.createRecord({
    recordType: "MyRecordType",
    fields: {
        name: { value: "My new record" },
        description: { value: "Wow, so easy!" }
    }
})
```

## Getting started

This assumes you've already an active Apple Developer membership and you've got your CloudKit container set up.

### 1. Create a server-to-server key in CloudKit

Go to [CloudKit Dashboard](https://icloud.developer.apple.com/dashboard/), open your container, and click "Tokens & Keys" on the left menu.

Add a new "Server-to-Server Key" and follow the instructions.

### 2. Install the library

```bash
npm install --save cloudkit-js
```

### 3. Initialise the library

```javascript
import { CloudKitJs } from 'cloudkit-js';

const lib = new CloudKitJs({
    containerName: "iCloud.com.your.container.name", // Update this with your CloudKit container name
    keyId: "xxx", // Put your key ID here
    privateKeyFile: "eckey.pem" // Point to your private key file
})
```

The `keyId` and `privateKeyFile` are the values you got from step 1.

Your Key ID is displayed when viewing the server-to-server key on the CloudKit Dashboard.

> ⚠️ These are secret, so obvz don't put them in source control.
