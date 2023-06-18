import MainDBClient, { RoomId, RoomInfo, UserInfo, RoomClient, UserClient, IMainDBConfig } from "./client";
import { FriendInfo } from "./models/FriendInfo";
export { UserInfo, RoomInfo, RoomId };
export { RoomDB, UserDB };
declare class RoomDB {
    private roomClient;
    constructor(roomClient: RoomClient);
    create(roomImage: string, isOnly2?: boolean): Promise<RoomId>;
    remove(roomid: RoomId): Promise<void>;
    isExist(roomid: RoomId): Promise<boolean>;
    isMember(roomid: RoomId, username: string): Promise<boolean>;
    areMembers(roomid: RoomId, usernames: string[]): Promise<boolean[]>;
    getInfo(roomid: RoomId): Promise<RoomInfo>;
    getInfos(roomids: RoomId[]): Promise<RoomInfo[]>;
    setInfo(roomid: RoomId, info: Partial<RoomInfo>): Promise<void>;
    userEnter(roomid: RoomId, username: string): Promise<void>;
    usersEnterRoom(roomid: RoomId, usernames: string[]): Promise<void>;
    userExit(roomid: RoomId, username: string): Promise<void>;
    exitRooms(roomids: RoomId[], username: string): Promise<void>;
    removeEmptyRooms(roomids: RoomId[]): Promise<void>;
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
    addFriend(username: string, friendInfo: FriendInfo): Promise<void>;
    removeFriend(username: string, friendname: string): Promise<boolean>;
    isFriend(username: string, friendname: string): Promise<boolean>;
    areFriends(username: string, friendnames: string[]): Promise<boolean[]>;
    enterRoom(username: string, roomid: RoomId): Promise<void>;
    usersEnterRoom(usernames: string[], roomid: RoomId): Promise<void>;
    exitRoom(username: string, roomid: RoomId): Promise<void>;
    isInRoom(username: string, roomid: RoomId): Promise<boolean>;
    removeFriendFromAll(username: string): Promise<void>;
}
export default class MainDB {
    private mainDBClient;
    users: UserDB;
    rooms: RoomDB;
    constructor(mainDBClient: MainDBClient);
    static create(mainDBConfig: IMainDBConfig): Promise<MainDB>;
    close(): Promise<void>;
}
