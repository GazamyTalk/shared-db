import { Connection, Model } from "mongoose";
import { RoomId } from "./RoomInfo";
import { FriendInfo } from "./FriendInfo";
export interface UserInfo {
    username: string;
    nickname: string;
    description: string;
    userImage: string;
    rooms: RoomId[];
    friends: FriendInfo[];
}
export declare const mutableUserInfoFields: string[];
export declare function createUserInfoModel(connection: Connection): Model<UserInfo>;
