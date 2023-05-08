"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
class LoginDB {
    constructor(loginDBClient) {
        this.loginDBClient = loginDBClient;
    }
    static create(loginDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginDBClient = yield client_1.default.create(loginDBConfig);
            return new LoginDB(loginDBClient);
        });
    }
    create(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loginDBClient.insert({ username, password });
        });
    }
    remove(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loginDBClient.deleteOne({ username });
        });
    }
    isExist(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginInfos = yield this.loginDBClient.select({ username });
            return loginInfos.length !== 0;
        });
    }
    tryLogin(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginInfos = yield this.loginDBClient.select({ username, password });
            return loginInfos.length !== 0;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loginDBClient.close();
        });
    }
}
exports.default = LoginDB;
