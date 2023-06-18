"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFriendInfoModel = exports.mutableFriendInfoFields = void 0;
const mongoose_1 = require("mongoose");
exports.mutableFriendInfoFields = [];
const FriendInfoSchema = new mongoose_1.Schema({
    username: { type: String, require: true },
    roomid: { type: String, require: true },
});
function createFriendInfoModel(connection) {
    return connection.model("FriendInfo", FriendInfoSchema);
}
exports.createFriendInfoModel = createFriendInfoModel;
