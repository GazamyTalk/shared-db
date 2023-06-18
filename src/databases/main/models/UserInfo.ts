import mongoose, { Document, Schema, Connection, Model } from "mongoose";
import { RoomId } from "./RoomInfo";
import { FriendInfo } from "./FriendInfo";

export interface UserInfo {
    username: string
    nickname: string
    description: string
    userImage: string
    rooms: RoomId[]
    friends: FriendInfo[]
}

export const mutableUserInfoFields = ['nickname', 'description', 'userImage'];

const UserInfoSchema = new Schema(
    {
        username: { type: String, require: true },
        nickname: { type: String, require: true },
        description: { type: String, require: true },
        userImage: { type: String, require: true },
        rooms: { type: Array<number>, require: true },
        friends: { type: Array<FriendInfo>, require: true }
    }
)

export function createUserInfoModel(connection: Connection): Model<UserInfo> {
    return connection.model<UserInfo>("UserInfo", UserInfoSchema);
}