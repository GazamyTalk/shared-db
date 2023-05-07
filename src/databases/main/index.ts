import MainDBClient, { RoomId, RoomInfo, UserInfo, RoomClient, UserClient, IMainDBConfig } from "./client";
export { UserInfo, RoomInfo, RoomId };
export { RoomDB, UserDB };

class RoomDB {

    private roomClient: RoomClient

    constructor(roomClient: RoomClient) {
        this.roomClient = roomClient;
    }

    async create() : Promise<RoomId> {
        const roomid = await this.roomClient.insert({
            users: [],
            roomname: "",
            description: "",
        })
        return roomid;
    }

    async remove(roomid: RoomId) : Promise<void> {
        await this.roomClient.deleteOne({ roomid });
    }

    async isExist(roomid: RoomId) : Promise<boolean> {
        return (await this.roomClient.select({ roomid })).length !== 0;
    }

    async getInfo(roomid: RoomId) : Promise<RoomInfo> {
        return await this.roomClient.selectOne({ roomid });
    }

    async getInfos(roomids: RoomId[]) : Promise<RoomInfo[]> {
        const result = await this.roomClient.select({ roomid: { $in: roomids } });
        return result;
    }

    async setInfo(roomid: RoomId, info: Partial<RoomInfo>) : Promise<void> {
        await this.roomClient.updateOne({ roomid }, info);
    }

    async userEnter(roomid: RoomId, username: string) : Promise<void> {
        await this.roomClient.updateOne({ roomid }, { $push : { users: username }});
    }

    async userExit(roomid: RoomId, username: string) : Promise<void> {
        await this.roomClient.updateOne({ roomid }, { $pull : { users: username }});
    }
}


class UserDB {

    private userClient: UserClient

    constructor(userClient: UserClient) {
        this.userClient = userClient;
    }

    async create(username: string, nickname: string) : Promise<void> {
        await this.userClient.insert({
            username,
            nickname,
            description: "",
            rooms: [],
            friends: [],
        });
    }

    async remove(username: string) : Promise<void> {
        await this.userClient.deleteOne({ username });
    }

    async isExist(username: string) : Promise<boolean> {
        return (await this.getInfos([ username ])).length !== 0;
    }
    
    async getInfo(username: string) : Promise<UserInfo> {
        return await this.userClient.selectOne({ username });
    }

    async getInfos(username: string[]) : Promise<UserInfo[]> {
        const result = await this.userClient.select({ username: { $in: username } });
        return result;
    }

    async setInfo(username: string, info: Partial<UserInfo>) : Promise<void> {
        await this.userClient.updateOne({ username }, info);
    }
    
    async addFriend(username: string, friendname: string) : Promise<void> {
        await this.userClient.updateOne({ username }, { $push: { friends: friendname } });
    }

    async removeFriend(username: string, friendname: string) {
        await this.userClient.updateOne({ username }, { $pull: { friends: friendname } });
        return true;
    }

    async isFriend(username: string, friendname: string) : Promise<boolean> {
        return (await this.userClient.selectOne({ username })).friends.includes(friendname);
    }

    async enterRoom(username: string, roomid: RoomId) : Promise<void> {
        await this.userClient.updateOne({ username }, { $push: { rooms: roomid }});
    }

    async exitRoom(username: string, roomid: RoomId) : Promise<void> {
        await this.userClient.updateOne({ username }, { $pull: { rooms: roomid }});
    }

    async isInRoom(username: string, roomid: RoomId) : Promise<boolean> {
        return (await this.userClient.selectOne({ username })).rooms.includes(roomid);
    }
    
}



export default class MainDB {
    private mainDBClient: MainDBClient
    public users: UserDB
    public rooms: RoomDB

    constructor(mainDBClient: MainDBClient) {
        this.mainDBClient = mainDBClient;
        this.users = new UserDB(this.mainDBClient.userClient);
        this.rooms = new RoomDB(this.mainDBClient.roomClient);
    }

    static async create(mainDBConfig: IMainDBConfig) {
        const mainDBClient = await MainDBClient.create(mainDBConfig);
        return new MainDB(mainDBClient);
    }

    async close() {
        await this.mainDBClient.close();
    }
}