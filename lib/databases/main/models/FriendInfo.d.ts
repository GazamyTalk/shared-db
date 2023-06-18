import { Connection, Model } from "mongoose";
export interface FriendInfo {
    username: string;
    roomid: string;
}
export declare const mutableFriendInfoFields: never[];
export declare function createFriendInfoModel(connection: Connection): Model<FriendInfo>;
