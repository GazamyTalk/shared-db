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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = exports.RoomDB = exports.RoomId = void 0;
const client_1 = __importStar(require("./client"));
Object.defineProperty(exports, "RoomId", { enumerable: true, get: function () { return client_1.RoomId; } });
class RoomDB {
    constructor(roomClient) {
        this.roomClient = roomClient;
    }
    create(roomImage, isOnly2) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomid = yield this.roomClient.insert({
                users: [],
                roomname: "",
                description: "",
                roomImage,
                isOnly2: isOnly2 !== null && isOnly2 !== void 0 ? isOnly2 : false,
            });
            return roomid;
        });
    }
    remove(roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.deleteOne({ roomid });
        });
    }
    isExist(roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.roomClient.select({ roomid })).length !== 0;
        });
    }
    isMember(roomid, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.roomClient.selectOne({ roomid })).users.includes(username);
        });
    }
    areMembers(roomid, usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield this.roomClient.selectOne({ roomid })).users;
            return usernames.map((username) => users.includes(username));
        });
    }
    getInfo(roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.roomClient.selectOne({ roomid });
        });
    }
    getInfos(roomids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.roomClient.select({ roomid: { $in: roomids } });
            return result;
        });
    }
    setInfo(roomid, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.updateOne({ roomid }, info);
        });
    }
    userEnter(roomid, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.updateOne({ roomid }, { $push: { users: username } });
        });
    }
    usersEnterRoom(roomid, usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.updateOne({ roomid }, { $push: { users: { $each: usernames } } });
        });
    }
    userExit(roomid, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.updateOne({ roomid }, { $pull: { users: username } });
        });
    }
    // async userExitFromAll(username: string) : Promise<void> {
    //     await this.roomClient.update({ users: username }, { $pull : { users: username }});
    // }
    exitRooms(roomids, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomClient.update({ roomid: { $in: roomids } }, { $pull: { users: username } });
        });
    }
    removeEmptyRooms(roomids) {
        return __awaiter(this, void 0, void 0, function* () {
            const rooms = yield this.roomClient.select({ roomid: { $in: roomids } });
            const toRemoveRoomIds = rooms.filter((value) => {
                return value.users.length === 0;
            }).map((value) => {
                return value.roomid;
            });
            yield this.roomClient.delete({ roomid: { $in: toRemoveRoomIds } });
        });
    }
}
exports.RoomDB = RoomDB;
class UserDB {
    constructor(userClient) {
        this.userClient = userClient;
    }
    create(username, nickname, userImage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.insert({
                username,
                nickname,
                description: "",
                userImage,
                rooms: [],
                friends: [],
            });
        });
    }
    remove(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.deleteOne({ username });
        });
    }
    isExist(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getInfos([username])).length !== 0;
        });
    }
    getInfo(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userClient.selectOne({ username });
        });
    }
    getInfos(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userClient.select({ username: { $in: username } });
            return result;
        });
    }
    setInfo(username, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.updateOne({ username }, info);
        });
    }
    addFriend(username, friendInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.updateOne({ username }, { $push: { friends: friendInfo } });
        });
    }
    removeFriend(username, friendname) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.updateOne({ username }, { $pull: { friends: { username: friendname } } });
            return true;
        });
    }
    isFriend(username, friendname) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.userClient.selectOne({ username })).friends.map((value) => value.username).includes(friendname);
        });
    }
    areFriends(username, friendnames) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = (yield this.userClient.selectOne({ username })).friends;
            return friendnames.map((friendname) => friends.map((value) => value.username).includes(friendname));
        });
    }
    enterRoom(username, roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.updateOne({ username }, { $push: { rooms: roomid } });
        });
    }
    usersEnterRoom(usernames, roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.update({ username: { $in: usernames } }, { $push: { rooms: roomid } });
        });
    }
    exitRoom(username, roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userClient.updateOne({ username }, { $pull: { rooms: roomid } });
        });
    }
    isInRoom(username, roomid) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.userClient.selectOne({ username })).rooms.includes(roomid);
        });
    }
    removeFriendFromAll(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = (yield this.userClient.selectOne({ username })).friends;
            yield this.userClient.update({ username: { $in: friends } }, { $pull: { friends: username } });
        });
    }
}
exports.UserDB = UserDB;
class MainDB {
    constructor(mainDBClient) {
        this.mainDBClient = mainDBClient;
        this.users = new UserDB(this.mainDBClient.userClient);
        this.rooms = new RoomDB(this.mainDBClient.roomClient);
    }
    static create(mainDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainDBClient = yield client_1.default.create(mainDBConfig);
            return new MainDB(mainDBClient);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mainDBClient.close();
        });
    }
}
exports.default = MainDB;
