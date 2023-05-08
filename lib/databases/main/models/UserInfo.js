"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserInfoModel = exports.mutableUserInfoFields = void 0;
const mongoose_1 = require("mongoose");
exports.mutableUserInfoFields = ['nickname', 'description'];
const UserInfoSchema = new mongoose_1.Schema({
    username: { type: String, require: true },
    nickname: { type: String, require: true },
    description: { type: String, require: true },
    rooms: { type: (Array), require: true },
    friends: { type: (Array), require: true }
});
function createUserInfoModel(connection) {
    return connection.model("UserInfo", UserInfoSchema);
}
exports.createUserInfoModel = createUserInfoModel;
