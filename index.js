const core = require('@actions/core');
const github = require('@actions/github');
const crypto = require("crypto");




const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const name = core.getInput('name', { required: true });
    const token = core.getInput('token', { required: true });

    console.log(`the val ${process.env.LICENSE_PRIVATE_KEY}!`);
    core.setOutput("time", 'ds');
    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);
    const signature="123";
    const licenseData = generate();
    // process.env.LICENSE_PRIVATE_KEY
    core.setOutput("licensekey", licenseData);


    core.info('Output to the actions build log')


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
  return licenseData
}

