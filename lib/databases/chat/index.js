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
const randomString_1 = __importDefault(require("../../utils/randomString"));
class ChatDB {
    constructor(client) {
        this.client = client;
    }
    static create(chatDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ChatDB(yield client_1.default.create(chatDBConfig));
        });
    }
    addChat(roomid, username, chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!(
            //     typeof chatInfo.content === "string" &&
            //     typeof chatInfo.type === "string"
            // )) {
            // }
            const chatid = (0, randomString_1.default)(12);
            yield this.client.insert({
                chatid,
                username,
                roomid,
                type: chatInfo.type,
                content: chatInfo.content,
                time: chatInfo.time
            });
            return chatid;
        });
    }
    removeChat(roomid, chatid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.deleteOne({ roomid, chatid });
        });
    }
    getChat(roomid, chatid) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.selectOne({ roomid: roomid, chatid: chatid });
            return result;
        });
    }
    getChats(roomid, count, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.selectSortLimitTime({ roomid }, count, time);
            return result;
        });
    }
    removeChatRoom(roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.deleteCollection(roomid);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
}
exports.default = ChatDB;
