import * as core from '@actions/core';
import * as crypto from "crypto";

import { AuthorizerFactory } from "azure-actions-webclient/AuthorizerFactory";
import { IAuthorizer } from "azure-actions-webclient/Authorizer/IAuthorizer";
import { async } from 'q';
import { ContainerInstanceManagementClient, ContainerInstanceManagementModels, ContainerInstanceManagementMappers } from "@azure/arm-containerinstance";

import { TaskParameters } from "./taskparameters";


var prefix = !!process.env.AZURE_HTTP_USER_AGENT ? `${process.env.AZURE_HTTP_USER_AGENT}` : "";

async function main() {
    let isDeploymentSuccess: boolean = true;

    try {
        // Set user agent variable
        let usrAgentRepo = crypto.createHash('sha256').update(`${process.env.GITHUB_REPOSITORY}`).digest('hex');
        let actionName = 'DeployAzureContainerInstance';
        let userAgentString = (!!prefix ? `${prefix}+` : '') + `GITHUBACTIONS_${actionName}_${usrAgentRepo}`;
        core.exportVariable('AZURE_HTTP_USER_AGENT', userAgentString);

        let endpoint: IAuthorizer = await AuthorizerFactory.getAuthorizer();
        var taskParams = TaskParameters.getTaskParams(endpoint);
        let bearerToken = await endpoint.getToken();
        // TODO: Get Credentials, Store them as TokenCredentials and use it to create the ContainerInstanceManagementClient
        // let credentials = {
        //     token: bearerToken,
        //     authorizationScheme: "Bearer"
        // };

        // core.debug("Predeployment Steps Started");
        // const client = new ContainerInstanceManagementClient(credentials, taskParams.subscriptionId);

    }
    catch (error) {
        core.debug("Deployment Failed with Error: " + error);
        isDeploymentSuccess = false;
        core.setFailed(error);
    }
    finally{
        core.debug('TODO');
    }
}