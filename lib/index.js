"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RoomId = exports.UserDB = exports.RoomDB = void 0;
const main_1 = __importStar(require("./databases/main"));
Object.defineProperty(exports, "RoomDB", { enumerable: true, get: function () { return main_1.RoomDB; } });
Object.defineProperty(exports, "UserDB", { enumerable: true, get: function () { return main_1.UserDB; } });
const chat_1 = __importDefault(require("./databases/chat"));
const login_1 = __importDefault(require("./databases/login"));
var main_2 = require("./databases/main");
Object.defineProperty(exports, "RoomId", { enumerable: true, get: function () { return main_2.RoomId; } });
class SharedDB {
    constructor() { }
    static create(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const sharedDB = new SharedDB();
            sharedDB.mainDB = config.mainDB && (yield main_1.default.create(config.mainDB));
            sharedDB.chatDB = config.chatDB && (yield chat_1.default.create(config.chatDB));
            sharedDB.loginDB = config.loginDB && (yield login_1.default.create(config.loginDB));
            return sharedDB;
        });
    }
    get users() {
        if (this.mainDB === undefined) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.users;
    }
    get rooms() {
        if (this.mainDB === undefined) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.rooms;
    }
    get chats() {
        if (this.chatDB === undefined) {
            throw new Error("Unable to use 'chats': chatDB is undefined");
        }
        return this.chatDB;
    }
    get login() {
        if (this.loginDB === undefined) {
            throw new Error("Unable to use 'login': loginDB is undefined");
        }
        return this.loginDB;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mainDB && (yield this.mainDB.close());
            this.chatDB && (yield this.chatDB.close());
            this.loginDB && (yield this.loginDB.close());
        });
    }
}
exports.default = SharedDB;
