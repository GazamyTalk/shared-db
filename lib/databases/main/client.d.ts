import { Connection, UpdateQuery, FilterQuery } from "mongoose";
import { UserInfo } from "./models/UserInfo";
import { RoomInfo, RoomId } from "./models/RoomInfo";
export { UserInfo };
export { RoomInfo, RoomId };
export interface IMainDBConfig {
    uri: string;
}
export declare class UserClient {
    private UserInfoModel;
    constructor(connection: Connection);
    insert(userInfo: Partial<UserInfo>): Promise<void>;
    update(beforeUserInfo: FilterQuery<UserInfo>, afterUserInfo: UpdateQuery<UserInfo>): Promise<number>;
    updateOne(beforeUserInfo: FilterQuery<UserInfo>, afterUserInfo: UpdateQuery<UserInfo>): Promise<void>;
    delete(userInfo: FilterQuery<UserInfo>): Promise<number>;
    deleteOne(userInfo: FilterQuery<UserInfo>): Promise<void>;
    select(userInfo: FilterQuery<UserInfo>): Promise<UserInfo[]>;
    selectOne(userInfo: FilterQuery<UserInfo>): Promise<UserInfo>;
}
export declare class RoomClient {
    private RoomInfoModel;
    constructor(connection: Connection);
    insert(roomInfo: Partial<RoomInfo>): Promise<RoomId>;
    update(beforeRoomInfo: FilterQuery<RoomInfo>, afterRoomInfo: UpdateQuery<RoomInfo>): Promise<number>;
    updateOne(beforeRoomInfo: FilterQuery<RoomInfo>, afterRoomInfo: UpdateQuery<RoomInfo>): Promise<void>;
    delete(roomInfo: FilterQuery<RoomInfo>): Promise<number>;
    deleteOne(roomInfo: FilterQuery<RoomInfo>): Promise<void>;
    select(roomInfo: FilterQuery<RoomInfo>): Promise<RoomInfo[]>;
    selectOne(roomInfo: FilterQuery<RoomInfo>): Promise<RoomInfo>;
}
export default class MainDBClient {
    userClient: UserClient;
    roomClient: RoomClient;
    private connection;
    constructor(connection: Connection);
    static create(mainDBConfig: IMainDBConfig): Promise<MainDBClient>;
    close(): Promise<void>;
}
