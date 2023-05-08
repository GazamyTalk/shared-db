import { RoomId } from "../main";
import ChatDBClient, { ChatInfo, IChatDBConfig } from "./client";
export { ChatInfo };
export default class ChatDB {
    client: ChatDBClient;
    constructor(client: ChatDBClient);
    static create(chatDBConfig: IChatDBConfig): Promise<ChatDB>;
    addChat(username: string, roomid: RoomId, type: string, content: string, time: number): Promise<string>;
    removeChat(roomid: RoomId, chatid: string): Promise<void>;
    getChat(roomid: RoomId, count: number, time: number): Promise<ChatInfo[]>;
    close(): Promise<void>;
}
