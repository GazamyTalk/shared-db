import mongoose, { Document, Schema, Connection, Model } from "mongoose";
import { RoomId } from "./RoomInfo";

export interface UserInfo {
    username: string
    nickname: string
    description: string
    rooms: RoomId[]
    friends: string[]
}

export const mutableUserInfoFields = ['nickname', 'description'];

const UserInfoSchema = new Schema(
    {
        username: { type: String, require: true },
        nickname: { type: String, require: true },
        description: { type: String, require: true },
        rooms: { type: Array<number>, require: true },
        friends: { type: Array<string>, require: true }
    }
)

export function createUserInfoModel(connection: Connection): Model<UserInfo> {
    return connection.model<UserInfo>("UserInfo", UserInfoSchema);
}