"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomInfoModel = exports.mutableRoomInfoFields = exports.RoomId = void 0;
const mongoose_1 = require("mongoose");
// import { RoomId } from "./ids";
// export { RoomId };
// export const RoomId = Schema.Types.ObjectId;
// export const zeroRoomId = new RoomId('0');
class RoomId extends mongoose_1.Types.ObjectId {
}
exports.RoomId = RoomId;
exports.mutableRoomInfoFields = ['roomname', 'description', 'roomImage'];
const RoomInfoSchema = new mongoose_1.Schema({
    roomid: { type: mongoose_1.Types.ObjectId, auto: true },
    roomname: { type: String, require: true },
    description: { type: String, require: true },
    roomImage: { type: String, require: true },
    users: { type: (Array), require: true },
    isOnly2: { type: Boolean, require: true }
});
function createRoomInfoModel(connection) {
    return connection.model("RoomInfo", RoomInfoSchema);
}
exports.createRoomInfoModel = createRoomInfoModel;
