import { RoomId } from "@databases/main";
import ChatDBClient, { ChatInfo } from "./client";
import randomString from "@utils/randomString";

export default class ChatDB {
    client: ChatDBClient

    constructor(client: ChatDBClient) {
        this.client = client;
    }

    static async create() {
        return new ChatDB(await ChatDBClient.create());
    }

    async addChat(username: string,
                  roomid: RoomId,
                  type: string,
                  content: string,
                  time: number) : Promise<string> {
        const chatid = randomString(12);
        await this.client.insert({
            chatid,
            username,
            roomid,
            type,
            content,
            time
        })
        return chatid;
    }

    async removeChat(roomid: RoomId, chatid: string) {
        await this.client.deleteOne({ roomid, chatid });
    }

    async getChat(roomid: RoomId, count: number, time: number) : Promise<ChatInfo[]> {
        const result = await this.client.selectSortLimitTime({ roomid }, count, time);
        return result;
    }

    async close() {
        await this.client.close();
    }
}