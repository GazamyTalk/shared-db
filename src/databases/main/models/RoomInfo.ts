import mongoose, { Document, Schema, Connection, Model } from "mongoose";

// import { RoomId } from "./ids";
// export { RoomId };

// export const RoomId = Schema.Types.ObjectId;
// export const zeroRoomId = new RoomId('0');

export class RoomId extends Schema.Types.ObjectId {}

export interface RoomInfo {
    roomid: RoomId
    roomname: string
    description: string
    users: string[]
}

export const mutableRoomInfoFields = ['roomname', 'description'];

const RoomInfoSchema = new Schema(
    {
        roomid: { type: RoomId, auto: true },
        roomname: { type: String, require: true },
        description: { type: String, require: true },
        users: { type: Array<number>, require: true }
    }
)

export function createRoomInfoModel(connection: Connection): Model<RoomInfo> {
    return connection.model<RoomInfo>("RoomInfo", RoomInfoSchema);
}