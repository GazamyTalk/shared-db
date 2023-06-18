import { RoomId } from "../main";
import ChatDBClient, { ChatInfo, IChatDBConfig } from "./client";
export { ChatInfo };
export default class ChatDB {
    client: ChatDBClient;
    constructor(client: ChatDBClient);
    static create(chatDBConfig: IChatDBConfig): Promise<ChatDB>;
    addChat(roomid: RoomId, username: string, chatInfo: Partial<ChatInfo>): Promise<string>;
    removeChat(roomid: RoomId, chatid: string): Promise<void>;
    getChat(roomid: RoomId, chatid: string): Promise<ChatInfo>;
    getChats(roomid: RoomId, count: number, time: number): Promise<ChatInfo[]>;
    removeChatRoom(roomid: RoomId): Promise<void>;
    close(): Promise<void>;
}
