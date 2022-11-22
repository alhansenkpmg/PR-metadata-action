const crypto = require("crypto");
const fs = require("fs");

const HASH_ALG = "sha256";
const SIGNATURE_ALG = `RSA-${HASH_ALG.toUpperCase()}`;

function generate() {
  const privateKey = fs.readFileSync("./private.pem");
  const publicKey = fs.readFileSync("./public.pem");

  const payload = {
    licensee: 'KPMG',
    starts: '2022-09-26T11:24:00Z',
    expires: '2022-09-30T11:24:00Z',
    maxAutomations: -1,
    maxBluePrismLicense: -1
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

  const header = {
    alg: 'RSA-SHA256',
    jwk: {
      kty: 'RSA',
      use: 'sig',
      key: publicKey.toString('ascii')
    }
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');

  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('ascii');

  const privateKeyObject = crypto.createPrivateKey({
    key: privateKey,
    format: "pem",
  });

  const signature = crypto.sign(
    SIGNATURE_ALG,
    signingInput,
    privateKeyObject
  );

  const licenseData = `${signingInput}.${signature.toString('base64')}`
  fs.writeFileSync("./license.lic", licenseData);
}

generate();
