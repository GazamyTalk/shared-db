import { Types, Connection, Model } from "mongoose";
export declare class RoomId extends Types.ObjectId {
}
export interface RoomInfo {
    roomid: RoomId;
    roomname: string;
    description: string;
    roomImage: string;
    users: string[];
    isOnly2: boolean;
}
export declare const mutableRoomInfoFields: string[];
export declare function createRoomInfoModel(connection: Connection): Model<RoomInfo>;
