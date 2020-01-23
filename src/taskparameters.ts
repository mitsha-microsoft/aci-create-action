import * as core from '@actions/core';

import { IAuthorizer } from "azure-actions-webclient/Authorizer/IAuthorizer";

import fs = require('fs');
import { ContainerInstanceManagementModels } from '@azure/arm-containerinstance';

export class TaskParameters {
    private static taskparams: TaskParameters;
    private _endpoint: IAuthorizer;
    private _resourceGroup: string;
    private _cpu: number;
    private _dnsNameLabel: string;
    private _gpuCount: number;
    private _gpuSKU: ContainerInstanceManagementModels.GpuSku;
    private _image:string;
    private _ipAddress:ContainerInstanceManagementModels.ContainerGroupIpAddressType;
    private _location:string;
    private _memory: number;
    private _containerName: string;
    private _osType: ContainerInstanceManagementModels.OperatingSystemTypes;
    private _ports: Array<ContainerInstanceManagementModels.Port>;
    private _registryLoginServer: string;
    private _registryUsername: string;
    private _registryPassword: string;
    private _restartPolicy: ContainerInstanceManagementModels.ContainerGroupRestartPolicy;
    
    private _subscriptionId: string;

    private constructor(endpoint: IAuthorizer) {
        this._endpoint = endpoint;
        this._resourceGroup = core.getInput('resource-group', { required: true });
        this._cpu = parseFloat(core.getInput('cpu'));
        this._dnsNameLabel = core.getInput('dns-name-label', { required: true });
        let gpuCount = core.getInput('gpu-count');
        let gpuSku = core.getInput('gpu-sku');
        if(gpuSku && !gpuCount) {
            throw Error("You need to specify the count of GPU Resources with the SKU!"); 
        } else {
            if(gpuCount && !gpuSku) {
                core.warning('Since GPU SKU is not mentioned, creating GPU Resources with the SKU K80.');
                gpuSku = 'K80';
            }
            this._gpuCount = parseInt(gpuCount);
            this._gpuSKU = (gpuSku == 'K80') ? 'K80' : ( gpuSku == 'P100' ? 'P100' : 'V100');
        }
        this._image = core.getInput('image', { required: true });
        let ipAddress = core.getInput('ip-address');
        if(ipAddress != "Public" && "Private") {
            throw Error('The Value of IP Address must be either Public or Private');
        } else {
            this._ipAddress = (ipAddress == 'Public') ? 'Public' : 'Private';
        }
        this._location = core.getInput('location', { required: true });
        this._memory = parseFloat(core.getInput('memory'));
        this._containerName = core.getInput('name', { required: true });
        let osType = core.getInput('os-type');
        if(osType != 'Linux' && 'Windows') {
            throw Error('The Value of OS Type must be either Linux or Windows only!')
        } else {
            this._osType = (osType == 'Linux') ? 'Linux' : 'Windows';
        }
        let ports = core.getInput('ports');
        let portObjArr: Array<ContainerInstanceManagementModels.Port> = [];
        ports.split(' ').forEach((portStr) => {
            let portInt = parseInt(portStr);
            portObjArr.push({ "port": portInt });
        });
        this._ports = portObjArr;
        this._registryLoginServer = core.getInput('registry-login-server');
        if(!this._registryLoginServer) {
            // If the user doesn't give registry login server and the registry is ACR
            let imageList = this._registryLoginServer.split('/');
            if(imageList[0].indexOf('azurecr') > -1) {
                this._registryLoginServer = imageList[0];
            }
        }
        this._registryUsername = core.getInput('registry-username');
        this._registryPassword = core.getInput('registry-password');
        let restartPolicy = core.getInput('restart-policy');
        if(restartPolicy != "Always" || "OnFailure" || "Never") {
            throw Error('The Value of Restart Policy can be "Always", "OnFailure" or "Never" only!');
        } else {
            this._restartPolicy = ( restartPolicy == 'Always' ) ? 'Always' : ( restartPolicy == 'Never' ? 'Never' : 'OnFailure');
        }

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

    public get gpuCount() {
        return this._gpuCount;
    }

    public get gpuSku() {
        return this._gpuSKU;
    }

    public get image() {
        return this._image;
    }

    public get ipAddress() {
        return this._ipAddress;
    }

    public get location() {
        return this._location;
    }

    public get memory() {
        return this._memory;
    }

    public get containerName() {
        return this._containerName;
    }

    public get osType() {
        return this._osType;
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

    public get restartPolicy() {
        return this._restartPolicy;
    }

    public get subscriptionId() {
        return this._subscriptionId;
    }

}