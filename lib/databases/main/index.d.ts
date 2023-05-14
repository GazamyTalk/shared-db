import MainDBClient, { RoomId, RoomInfo, UserInfo, RoomClient, UserClient, IMainDBConfig } from "./client";
export { UserInfo, RoomInfo, RoomId };
export { RoomDB, UserDB };
declare class RoomDB {
    private roomClient;
    constructor(roomClient: RoomClient);
    create(roomImage: string): Promise<RoomId>;
    remove(roomid: RoomId): Promise<void>;
    isExist(roomid: RoomId): Promise<boolean>;
    getInfo(roomid: RoomId): Promise<RoomInfo>;
    getInfos(roomids: RoomId[]): Promise<RoomInfo[]>;
    setInfo(roomid: RoomId, info: Partial<RoomInfo>): Promise<void>;
    userEnter(roomid: RoomId, username: string): Promise<void>;
    userExit(roomid: RoomId, username: string): Promise<void>;
}
declare class UserDB {
    private userClient;
    constructor(userClient: UserClient);
    create(username: string, nickname: string, userImage: string): Promise<void>;
    remove(username: string): Promise<void>;
    isExist(username: string): Promise<boolean>;
    getInfo(username: string): Promise<UserInfo>;
    getInfos(username: string[]): Promise<UserInfo[]>;
    setInfo(username: string, info: Partial<UserInfo>): Promise<void>;
    addFriend(username: string, friendname: string): Promise<void>;
    removeFriend(username: string, friendname: string): Promise<boolean>;
    isFriend(username: string, friendname: string): Promise<boolean>;
    enterRoom(username: string, roomid: RoomId): Promise<void>;
    exitRoom(username: string, roomid: RoomId): Promise<void>;
    isInRoom(username: string, roomid: RoomId): Promise<boolean>;
}
export default class MainDB {
    private mainDBClient;
    users: UserDB;
    rooms: RoomDB;
    constructor(mainDBClient: MainDBClient);
    static create(mainDBConfig: IMainDBConfig): Promise<MainDB>;
    close(): Promise<void>;
}
