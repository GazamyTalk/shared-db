import mongoose, { Document, Schema, Connection, Model } from "mongoose";
import { RoomId } from "./RoomInfo";

export interface FriendInfo {
    username: string
    roomid: string
}

export const mutableFriendInfoFields = [];

const FriendInfoSchema = new Schema(
    {
        username: { type: String, require: true },
        roomid: { type: String, require: true },
    }
)

export function createFriendInfoModel(connection: Connection): Model<FriendInfo> {
    return connection.model<FriendInfo>("FriendInfo", FriendInfoSchema);
}