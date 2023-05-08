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
exports.RoomClient = exports.UserClient = exports.RoomId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserInfo_1 = require("./models/UserInfo");
const RoomInfo_1 = require("./models/RoomInfo");
Object.defineProperty(exports, "RoomId", { enumerable: true, get: function () { return RoomInfo_1.RoomId; } });
class UserClient {
    constructor(connection) {
        this.UserInfoModel = (0, UserInfo_1.createUserInfoModel)(connection);
    }
    insert(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.create(userInfo);
        });
    }
    update(beforeUserInfo, afterUserInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.updateMany(beforeUserInfo, afterUserInfo);
            return result.matchedCount;
        });
    }
    updateOne(beforeUserInfo, afterUserInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.updateOne(beforeUserInfo, afterUserInfo);
            if (result.matchedCount !== 1) {
                throw new Error(`matchedCount must be 1, not ${result.matchedCount}`);
            }
        });
    }
    delete(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.deleteMany(userInfo);
            return result.deletedCount;
        });
    }
    deleteOne(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.deleteOne(userInfo);
            if (result.deletedCount !== 1) {
                throw new Error(`deletedCount must be 1, not ${result.deletedCount}`);
            }
        });
    }
    select(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.find(userInfo);
            return result;
        });
    }
    selectOne(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UserInfoModel.findOne(userInfo);
            if (result === null) {
                throw new Error("selectOne must have one result, but no result");
            }
            return result;
        });
    }
}
exports.UserClient = UserClient;
class RoomClient {
    constructor(connection) {
        this.RoomInfoModel = (0, RoomInfo_1.createRoomInfoModel)(connection);
    }
    insert(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.create(roomInfo);
            return result.roomid;
        });
    }
    update(beforeRoomInfo, afterRoomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.updateMany(beforeRoomInfo, afterRoomInfo);
            return result.matchedCount;
        });
    }
    updateOne(beforeRoomInfo, afterRoomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.updateOne(beforeRoomInfo, afterRoomInfo);
            if (result.matchedCount !== 1) {
                throw new Error("nothing was matched.");
            }
        });
    }
    delete(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.deleteMany(roomInfo);
            return result.deletedCount;
        });
    }
    deleteOne(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.deleteOne(roomInfo);
            if (result.deletedCount !== 1) {
                throw new Error("nothing was deleted.");
            }
        });
    }
    select(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.find(roomInfo);
            return result;
        });
    }
    selectOne(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.RoomInfoModel.findOne(roomInfo);
            if (result === null) {
                throw new Error("selectOne must have one result, but no result");
            }
            return result;
        });
    }
}
exports.RoomClient = RoomClient;
class MainDBClient {
    constructor(connection) {
        this.connection = connection;
        this.userClient = new UserClient(this.connection);
        this.roomClient = new RoomClient(this.connection);
    }
    static create(mainDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MainDBClient(yield mongoose_1.default.createConnection(mainDBConfig.uri));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.close();
        });
    }
}
exports.default = MainDBClient;
