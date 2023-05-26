import { RoomId } from "../main";
import ChatDBClient, { ChatInfo, IChatDBConfig } from "./client";
import randomString from "../../utils/randomString";

export { ChatInfo };

export default class ChatDB {
    client: ChatDBClient

    constructor(client: ChatDBClient) {
        this.client = client;
    }

    static async create(chatDBConfig: IChatDBConfig) {
        return new ChatDB(await ChatDBClient.create(chatDBConfig));
    }

    async addChat(roomid: RoomId, username: string, chatInfo: Partial<ChatInfo>) : Promise<string> {
        // if (!(
        //     typeof chatInfo.content === "string" &&
        //     typeof chatInfo.type === "string"
        // )) {

        // }
        const chatid = randomString(12);
        await this.client.insert({
            chatid,
            username,
            roomid,
            type: chatInfo.type!,
            content: chatInfo.content!,
            time: chatInfo.time!
        })
        return chatid;
    }

    async removeChat(roomid: RoomId, chatid: string) {
        await this.client.deleteOne({ roomid, chatid });
    }

    async getChat(roomid: RoomId, chatid: string) : Promise<ChatInfo> {
        const result = await this.client.selectOne({ roomid: roomid, chatid: chatid });
        return result;
    }

    async getChats(roomid: RoomId, count: number, time: number) : Promise<ChatInfo[]> {
        const result = await this.client.selectSortLimitTime({ roomid }, count, time);
        return result;
    }

    async close() {
        await this.client.close();
    }
}