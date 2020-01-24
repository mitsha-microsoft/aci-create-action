"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
class TaskParameters {
    constructor(endpoint) {
        this._endpoint = endpoint;
        this._resourceGroup = core.getInput('resource-group', { required: true });
        this._cpu = parseFloat(core.getInput('cpu'));
        this._dnsNameLabel = core.getInput('dns-name-label', { required: true });
        let environmentVariables = core.getInput('environment-variables');
        this._environmentVariables = [];
        if (environmentVariables) {
            let keyValuePairs = environmentVariables.split(' ');
            keyValuePairs.forEach((pair) => {
                pair.split('=');
                let obj = { "name": pair[0], "value": pair[1] };
                this._environmentVariables.push(obj);
            });
        }
        let gpuCount = core.getInput('gpu-count');
        let gpuSku = core.getInput('gpu-sku');
        if (gpuSku && !gpuCount) {
            throw Error("You need to specify the count of GPU Resources with the SKU!");
        }
        else {
            if (gpuCount && !gpuSku) {
                core.warning('Since GPU SKU is not mentioned, creating GPU Resources with the SKU K80.');
                gpuSku = 'K80';
            }
            this._gpuCount = parseInt(gpuCount);
            this._gpuSKU = (gpuSku == 'K80') ? 'K80' : (gpuSku == 'P100' ? 'P100' : 'V100');
        }
        this._image = core.getInput('image', { required: true });
        let ipAddress = core.getInput('ip-address');
        if (ipAddress != "Public" && "Private") {
            throw Error('The Value of IP Address must be either Public or Private');
        }
        else {
            this._ipAddress = (ipAddress == 'Public') ? 'Public' : 'Private';
        }
        this._location = core.getInput('location', { required: true });
        this._memory = parseFloat(core.getInput('memory'));
        this._containerName = core.getInput('name', { required: true });
        let osType = core.getInput('os-type');
        if (osType != 'Linux' && 'Windows') {
            throw Error('The Value of OS Type must be either Linux or Windows only!');
        }
        else {
            this._osType = (osType == 'Linux') ? 'Linux' : 'Windows';
        }
        let ports = core.getInput('ports');
        let portObjArr = [];
        ports.split(' ').forEach((portStr) => {
            let portInt = parseInt(portStr);
            portObjArr.push({ "port": portInt });
        });
        this._ports = portObjArr;
        this._registryLoginServer = core.getInput('registry-login-server');
        if (!this._registryLoginServer) {
            // If the user doesn't give registry login server and the registry is ACR
            let imageList = this._registryLoginServer.split('/');
            if (imageList[0].indexOf('azurecr') > -1) {
                this._registryLoginServer = imageList[0];
            }
        }
        this._registryUsername = core.getInput('registry-username');
        this._registryPassword = core.getInput('registry-password');
        let restartPolicy = core.getInput('restart-policy');
        if (restartPolicy != "Always" && "OnFailure" && "Never") {
            throw Error('The Value of Restart Policy can be "Always", "OnFailure" or "Never" only!');
        }
        else {
            this._restartPolicy = (restartPolicy == 'Always') ? 'Always' : (restartPolicy == 'Never' ? 'Never' : 'OnFailure');
        }
        this._subscriptionId = endpoint.subscriptionID;
    }
    static getTaskParams(endpoint) {
        if (!this.taskparams) {
            this.taskparams = new TaskParameters(endpoint);
        }
        return this.taskparams;
    }
    get resourceGroup() {
        return this._resourceGroup;
    }
    get cpu() {
        return this._cpu;
    }
    get dnsNameLabel() {
        return this._dnsNameLabel;
    }
    get environmentVariables() {
        return this._environmentVariables;
    }
    get gpuCount() {
        return this._gpuCount;
    }
    get gpuSku() {
        return this._gpuSKU;
    }
    get image() {
        return this._image;
    }
    get ipAddress() {
        return this._ipAddress;
    }
    get location() {
        return this._location;
    }
    get memory() {
        return this._memory;
    }
    get containerName() {
        return this._containerName;
    }
    get osType() {
        return this._osType;
    }
    get ports() {
        return this._ports;
    }
    get registryLoginServer() {
        return this._registryLoginServer;
    }
    get registryUsername() {
        return this._registryUsername;
    }
    get registryPassword() {
        return this._registryPassword;
    }
    get restartPolicy() {
        return this._restartPolicy;
    }
    get subscriptionId() {
        return this._subscriptionId;
    }
}
exports.TaskParameters = TaskParameters;
