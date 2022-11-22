const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");

const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
     const name = core.getInput('name', { required: true });
    const token = core.getInput('token', { required: true });

    console.log(`Hello ${name}!`);

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
    const licenseData = `${signature.toString('base64')}`
    fs.writeFileSync("./license.lic", licenseData);


    core.info('Output to the actions build log')


  } catch (error) {
    core.setFailed(error.message);
  }
}

// Call the main function to run the action
main();