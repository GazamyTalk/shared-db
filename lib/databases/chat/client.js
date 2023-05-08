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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class ChatDBClient {
    constructor(client) {
        this.client = client;
        this.db = client.db();
    }
    static create(chatDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ChatDBClient(yield mongodb_1.MongoClient.connect(chatDBConfig.uri));
        });
    }
    getRoomCollection(roomid) {
        return this.db.collection(`room-${roomid}`);
    }
    insert(chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chatInfo.roomid === undefined) {
                throw new Error("chatInfo must include roomid");
            }
            let collection = this.getRoomCollection(chatInfo.roomid);
            let result = yield collection.insertOne(chatInfo);
            return result.acknowledged ? 1 : 0;
        });
    }
    update(beforeChatInfo, afterChatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (beforeChatInfo.roomid === undefined) {
                throw new Error("beforeChatInfo must include roomid");
            }
            let collection = this.getRoomCollection(beforeChatInfo.roomid);
            let result = yield collection.updateMany(beforeChatInfo, afterChatInfo);
            return result.matchedCount;
        });
    }
    updateOne(beforeChatInfo, afterChatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.update(beforeChatInfo, afterChatInfo);
            if (result !== 1) {
                throw new Error(`result of update must be 1, not ${result}`);
            }
        });
    }
    delete(chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chatInfo.roomid === undefined) {
                throw new Error("chatInfo must include roomid");
            }
            let collection = this.getRoomCollection(chatInfo.roomid);
            let result = yield collection.deleteMany(chatInfo);
            return result.deletedCount;
        });
    }
    deleteOne(chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.delete(chatInfo);
            if (result !== 1) {
                throw new Error(`result of delete must be 1, not ${result}`);
            }
        });
    }
    select(chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chatInfo.roomid === undefined) {
                throw new Error("chatInfo must include roomid");
            }
            let collection = this.getRoomCollection(chatInfo.roomid);
            let result = yield collection.find(chatInfo).toArray();
            return result;
        });
    }
    selectOne(chatInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.select(chatInfo);
            if (result.length !== 1) {
                throw new Error(`length of select must be 1, not ${result.length}`);
            }
            return result[0];
        });
    }
    selectSortLimitTime(chatInfo, limit, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chatInfo.roomid === undefined) {
                throw new Error("chatInfo must include roomid");
            }
            let collection = this.getRoomCollection(chatInfo.roomid);
            let result = (yield collection.find(Object.assign(Object.assign({}, chatInfo), { time: { $lt: time } })).sort({ time: -1 }).limit(limit).toArray()).reverse();
            return result;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
}
exports.default = ChatDBClient;
