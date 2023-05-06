import mongodb, { MongoClient, Db, Filter, UpdateFilter, Collection, OptionalId } from "mongodb";

import { chatDBConfig } from "@config/chat.db.config";
import { RoomId } from "@databases/main";

import { ChatInfo } from "./models/ChatInfo";

export { ChatInfo };



export default class ChatDBClient {
    private client: MongoClient;
    private db: Db;

    constructor (client: MongoClient) {
        this.client = client
        this.db = client.db();
    }

    static async create() : Promise<ChatDBClient> {
        return new ChatDBClient(await MongoClient.connect(chatDBConfig.uri));
    }

    getRoomCollection(roomid: RoomId) : Collection<ChatInfo> {
        return this.db.collection<ChatInfo>(`room-${roomid}`);
    }

    async insert(chatInfo: ChatInfo) : Promise<number> {
        if ( chatInfo.roomid === undefined ) {
            throw new Error("chatInfo must include roomid");
        }
        let collection = this.getRoomCollection(chatInfo.roomid);
        let result = await collection.insertOne(chatInfo);
        return result.acknowledged ? 1 : 0;
    }

    async update(beforeChatInfo: Filter<ChatInfo>, afterChatInfo: UpdateFilter<ChatInfo>) : Promise<number> {
        if (beforeChatInfo.roomid === undefined) {
            throw new Error("beforeChatInfo must include roomid");
        }
        let collection = this.getRoomCollection(beforeChatInfo.roomid as RoomId);
        let result = await collection.updateMany(beforeChatInfo, afterChatInfo);
        return result.matchedCount;
    }

    async updateOne(beforeChatInfo: Filter<ChatInfo>, afterChatInfo: UpdateFilter<ChatInfo>) : Promise<void> {
        const result = await this.update(beforeChatInfo, afterChatInfo);
        if ( result !== 1 ) {
            throw new Error(`result of update must be 1, not ${result}`);
        }
    }
    
    async delete(chatInfo: Filter<ChatInfo>) : Promise<number> {
        if ( chatInfo.roomid === undefined ) {
            throw new Error("chatInfo must include roomid");
        }
        let collection = this.getRoomCollection(chatInfo.roomid as RoomId);
        let result = await collection.deleteMany(chatInfo);
        return result.deletedCount;
    }

    async deleteOne(chatInfo: Filter<ChatInfo>) : Promise<void> {
        const result = await this.delete(chatInfo);
        if ( result !== 1 ) {
            throw new Error(`result of delete must be 1, not ${result}`);
        }
    }
    
    async select(chatInfo: Filter<ChatInfo>) : Promise<ChatInfo[]> {
        if (chatInfo.roomid === undefined) {
            throw new Error("chatInfo must include roomid");
        }
        let collection = this.getRoomCollection(chatInfo.roomid as RoomId);
        let result = await collection.find(chatInfo).toArray();
        return result;
    }

    async selectOne(chatInfo: Filter<ChatInfo>) : Promise<ChatInfo> {
        const result = await this.select(chatInfo);
        if ( result.length !== 1 ) {
            throw new Error(`length of select must be 1, not ${result.length}`);
        }
        return result[0];
    }

    async selectSortLimitTime(chatInfo: Filter<ChatInfo>, limit: number, time: number) : Promise<ChatInfo[]> {
        if (chatInfo.roomid === undefined) {
            throw new Error("chatInfo must include roomid");
        }
        let collection = this.getRoomCollection(chatInfo.roomid as RoomId);
        let result = (await collection.find({ ...chatInfo, time: { $lt: time }}).sort({time: -1}).limit(limit).toArray()).reverse();
        return result;
    }

    async close() : Promise<void> {
        await this.client.close();
    }
}