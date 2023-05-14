import { Schema, Connection, Model } from "mongoose";
export declare class RoomId extends Schema.Types.ObjectId {
}
export interface RoomInfo {
    roomid: RoomId;
    roomname: string;
    description: string;
    roomImage: string;
    users: string[];
}
export declare const mutableRoomInfoFields: string[];
export declare function createRoomInfoModel(connection: Connection): Model<RoomInfo>;
