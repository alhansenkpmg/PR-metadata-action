const crypto = require("crypto");
const fs = require("fs");

function verify() {
  const license = fs.readFileSync('./license.lic').toString('ascii');

  const [encodedHeader, encodedPayload, encodedSignature] = license.split('.');
  console.log(encodedHeader)
  const header = JSON.parse(Buffer.from(encodedHeader, 'base64'));
  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64'));
  const signature = Buffer.from(encodedSignature, 'base64');
  console.log(header)
  console.log(payload)
  if (!header.alg || !header.jwk) {
    throw new Error('Validation Error')
  }
  
  if (!header.jwk.key) {
    throw new Error('Validation Error')
  }

  // Verify other data in license, e.g. expiry

  // const now = Date.now();
  // const expires = new Date(payload.expires).valueOf();
  // const starts = new Date(payload.starts).valueOf();
  // if (expires < now || now < starts) {
  //   throw new Error('Validation Error');
  // }

  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('ascii');

  const isVerified = crypto.verify(
    header.alg,
    signingInput,
    Buffer.from(header.jwk.key),
    signature
  )

  console.log('Verified: ', isVerified);

  if (isVerified) {
    console.log('Verified Payload: ', payload);
  }
}

verify();