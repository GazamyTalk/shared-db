import { Connection, Model } from "mongoose";
import { RoomId } from "./RoomInfo";
export interface UserInfo {
    username: string;
    nickname: string;
    description: string;
    userImage: string;
    rooms: RoomId[];
    friends: string[];
}
export declare const mutableUserInfoFields: string[];
export declare function createUserInfoModel(connection: Connection): Model<UserInfo>;
