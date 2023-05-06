import mongoose, { Connection, Model, UpdateQuery, FilterQuery } from "mongoose";

import { UserInfo, createUserInfoModel } from "./models/UserInfo";
import { RoomInfo, createRoomInfoModel, RoomId } from "./models/RoomInfo";
import { mainDBConfig } from "@config/main.db.config";

export { UserInfo };
export { RoomInfo, RoomId };


export class UserClient {
    private UserInfoModel: Model<UserInfo>

    constructor(connection: Connection) {
        this.UserInfoModel = createUserInfoModel(connection);
    }

    async insert(userInfo: Partial<UserInfo>) : Promise<void> {
        const result = await this.UserInfoModel.create(userInfo);
    }

    async update(beforeUserInfo: FilterQuery<UserInfo>, afterUserInfo: UpdateQuery<UserInfo>) : Promise<number> {
        const result = await this.UserInfoModel.updateMany(beforeUserInfo, afterUserInfo);
        return result.matchedCount;
    }

    async updateOne(beforeUserInfo: FilterQuery<UserInfo>, afterUserInfo: UpdateQuery<UserInfo>) : Promise<void> {
        const result = await this.UserInfoModel.updateOne(beforeUserInfo, afterUserInfo);
        if ( result.matchedCount !== 1 ) {
            throw new Error(`matchedCount must be 1, not ${result.matchedCount}`);
        }
    }

    async delete(userInfo: FilterQuery<UserInfo>) : Promise<number> {
        const result = await this.UserInfoModel.deleteMany(userInfo);
        return result.deletedCount;
    }

    async deleteOne(userInfo: FilterQuery<UserInfo>) : Promise<void> {
        const result = await this.UserInfoModel.deleteOne(userInfo);
        if ( result.deletedCount !== 1 ) {
            throw new Error(`deletedCount must be 1, not ${result.deletedCount}`);
        }
    }

    async select(userInfo: FilterQuery<UserInfo>) : Promise<UserInfo[]> {
        const result: UserInfo[] = await this.UserInfoModel.find(userInfo);
        return result;
    }

    async selectOne(userInfo: FilterQuery<UserInfo>) : Promise<UserInfo> {
        const result: UserInfo | null = await this.UserInfoModel.findOne(userInfo);
        if ( result === null ) {
            throw new Error("selectOne must have one result, but no result");
        }
        return result;
    }
}


export class RoomClient {
    private RoomInfoModel: Model<RoomInfo>
    
    constructor(connection: Connection) {
        this.RoomInfoModel = createRoomInfoModel(connection);
    }

    async insert(roomInfo: Partial<RoomInfo>) : Promise<RoomId> {
        const result = await this.RoomInfoModel.create(roomInfo);
        return result.roomid;
    }

    async update(beforeRoomInfo: FilterQuery<RoomInfo>, afterRoomInfo: UpdateQuery<RoomInfo>) : Promise<number> {
        const result = await this.RoomInfoModel.updateMany(beforeRoomInfo, afterRoomInfo);
        return result.matchedCount;
    }

    async updateOne(beforeRoomInfo: FilterQuery<RoomInfo>, afterRoomInfo: UpdateQuery<RoomInfo>) : Promise<void> {
        const result = await this.RoomInfoModel.updateOne(beforeRoomInfo, afterRoomInfo);
        if ( result.matchedCount !== 1 ) {
            throw new Error("nothing was matched.");
        }
    }

    async delete(roomInfo: FilterQuery<RoomInfo>) : Promise<number> {
        const result = await this.RoomInfoModel.deleteMany(roomInfo);
        return result.deletedCount;
    }

    async deleteOne(roomInfo: FilterQuery<RoomInfo>) : Promise<void> {
        const result = await this.RoomInfoModel.deleteOne(roomInfo);
        if ( result.deletedCount !== 1 ) {
            throw new Error("nothing was deleted.");
        }
    }

    async select(roomInfo: FilterQuery<RoomInfo>) : Promise<RoomInfo[]> {
        const result: RoomInfo[] = await this.RoomInfoModel.find(roomInfo);
        return result;
    }

    async selectOne(roomInfo: FilterQuery<RoomInfo>) : Promise<RoomInfo> {
        const result: RoomInfo | null = await this.RoomInfoModel.findOne(roomInfo);
        if ( result === null ) {
            throw new Error("selectOne must have one result, but no result");
        }
        return result;
    }
}


export default class MainDBClient {
    public userClient: UserClient
    public roomClient: RoomClient
    private connection: Connection

    constructor(connection: Connection) {
        this.connection = connection
        this.userClient = new UserClient(this.connection);
        this.roomClient = new RoomClient(this.connection);
    }

    static async create() : Promise<MainDBClient> {
        return new MainDBClient(await mongoose.createConnection(mainDBConfig.uri))
    }

    async close() : Promise<void> {
        this.connection.close();
    }

}