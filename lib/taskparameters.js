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
        this._image = core.getInput('image', { required: true });
        this._memory = parseFloat(core.getInput('memory'));
        this._containerName = core.getInput('name', { required: true });
        let ports = core.getInput('ports');
        let portObjArr = [];
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
    get image() {
        return this._image;
    }
    get memory() {
        return this._memory;
    }
    get containerName() {
        return this._containerName;
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
    get subscriptionId() {
        return this._subscriptionId;
    }
}
exports.TaskParameters = TaskParameters;
