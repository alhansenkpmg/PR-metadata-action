const core = require('@actions/core');
const crypto = require("crypto");

const main = async () => {
  try {
    const licenseData = generate();
    core.setOutput("licensekey", licenseData);
  } catch (error) {
    core.setFailed(error.message);
  }
}
// Call the main function to run the action
main();

function generate() {
  const privateKey = process.env.LICENSE_PRIVATE_KEY
  const publicKey = process.env.LICENSE_PUBLIC_KEY

  const HASH_ALG = "sha256";
  const SIGNATURE_ALG = `RSA-${HASH_ALG.toUpperCase()}`;

  const payload = {
    licensee: core.getInput('licensee', { required: true }),
    starts: core.getInput('starts', { required: true }),
    expires: core.getInput('expires', { required: true }),
    maxAutomations: core.getInput('maxAutomations', { required: true }),
    maxBluePrismLicense: core.getInput('maxBluePrismLicense', { required: true }),
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
  return licenseData
}

