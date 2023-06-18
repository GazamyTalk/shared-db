import { MongoClient, Filter, UpdateFilter, Collection } from "mongodb";
import { RoomId } from "../main";
import { ChatInfo } from "./models/ChatInfo";
export { ChatInfo };
export interface IChatDBConfig {
    uri: string;
}
export default class ChatDBClient {
    private client;
    private db;
    constructor(client: MongoClient);
    static create(chatDBConfig: IChatDBConfig): Promise<ChatDBClient>;
    getRoomCollection(roomid: RoomId): Collection<ChatInfo>;
    insert(chatInfo: ChatInfo): Promise<number>;
    update(beforeChatInfo: Filter<ChatInfo>, afterChatInfo: UpdateFilter<ChatInfo>): Promise<number>;
    updateOne(beforeChatInfo: Filter<ChatInfo>, afterChatInfo: UpdateFilter<ChatInfo>): Promise<void>;
    delete(chatInfo: Filter<ChatInfo>): Promise<number>;
    deleteOne(chatInfo: Filter<ChatInfo>): Promise<void>;
    select(chatInfo: Filter<ChatInfo>): Promise<ChatInfo[]>;
    selectOne(chatInfo: Filter<ChatInfo>): Promise<ChatInfo>;
    selectSortLimitTime(chatInfo: Filter<ChatInfo>, limit: number, time: number): Promise<ChatInfo[]>;
    deleteCollection(roomid: RoomId): Promise<void>;
    close(): Promise<void>;
}
