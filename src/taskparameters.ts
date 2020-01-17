import * as core from '@actions/core';

import { IAuthorizer } from "azure-actions-webclient/Authorizer/IAuthorizer";

import fs = require('fs');
import { Port } from '@azure/arm-containerinstance/esm/models';

export class TaskParameters {
    private static taskparams: TaskParameters;
    private _endpoint: IAuthorizer;
    private _resourceGroup: string;
    private _cpu: number;
    private _dnsNameLabel: string;
    private _image:string;
    private _memory: number;
    private _containerName: string;
    private _ports: Array<Port>;
    private _registryLoginServer: string;
    private _registryUsername: string;
    private _registryPassword: string;
    
    private _subscriptionId: string;

    private constructor(endpoint: IAuthorizer) {
        this._endpoint = endpoint;
        this._resourceGroup = core.getInput('resource-group', { required: true });
        this._cpu = parseFloat(core.getInput('cpu'));
        this._dnsNameLabel = core.getInput('dns-name-label', { required: true });
        this._image = core.getInput('image', { required: true });
        this._memory = parseFloat(core.getInput('memory'));
        this._containerName = core.getInput('name', { required: true });
        let ports = core.getInput('ports');
        let portObjArr: Array<Port> = [];
        ports.split(' ').forEach((portStr) => {
            let portInt = parseInt(portStr);
            portObjArr.push({ "port": portInt });
        });
        this._ports = portObjArr;
        this._registryLoginServer = core.getInput('registry-login-server');
        this._registryUsername = core.getInput('registry-username');
        this._registryPassword = core.getInput('registry-password');

        this._subscriptionId = endpoint.subscriptionID;
    }

    public static getTaskParams(endpoint: IAuthorizer) {
        if(!this.taskparams) {
            this.taskparams = new TaskParameters(endpoint);
        }
        return this.taskparams;
    }

    public get resourceGroup() {
        return this._resourceGroup;
    }

    public get cpu() {
        return this._cpu;
    }

    public get dnsNameLabel() {
        return this._dnsNameLabel;
    }

    public get image() {
        return this._image;
    }

    public get memory() {
        return this._memory;
    }

    public get containerName() {
        return this._containerName;
    }

    public get ports() {
        return this._ports;
    }

    public get registryLoginServer() {
        return this._registryLoginServer;
    }

    public get registryUsername() {
        return this._registryUsername;
    }

    public get registryPassword() {
        return  this._registryPassword;
    }

    public get subscriptionId() {
        return this._subscriptionId;
    }

}