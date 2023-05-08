import dotenv from "dotenv";
dotenv.config();

import ChatDB from "@databases/chat";
import { RoomId } from "@databases/main";

describe("test chatDB", () => {

    let chatDB: ChatDB;
    let chatid1: string;
    let chatid2: string;
    let chatid3: string;

    beforeAll(async () => {
        chatDB = await ChatDB.create({
            uri: process.env.CHAT_DB_URI!
        })
    })

    test("make chat", async () => {
        chatid1 = await chatDB.addChat("__dev_test_username",
                             new RoomId("1234567890"),
                             "string",
                             "__dev_test_content_1",
                             100);

        chatid2 = await chatDB.addChat("__dev_test_username",
                             new RoomId("1234567891"),
                             "string",
                             "__dev_test_content_2",
                             100.1);
        chatid3 = await chatDB.addChat("__dev_test_username",
                             new RoomId("1234567890"),
                             "string",
                             "__dev_test_content_3",
                             100.2);
    })

    test("get chat", async () => {
        let result = await chatDB.getChat(new RoomId("1234567890"), 2, 100.2);
        console.log(result);
        expect(result.length).toBe(1);
        expect(result[0].content).toBe("__dev_test_content_1");
        expect(result[0].chatid).toBe(chatid1);

        result = await chatDB.getChat(new RoomId("1234567890"), 2, 100.3);
        expect(result.length).toBe(2);
        expect(result[0].content).toBe("__dev_test_content_1");
        expect(result[1].content).toBe("__dev_test_content_3");
        expect(result[1].chatid).toBe(chatid3);

        result = await chatDB.getChat(new RoomId("1234567891"), 2, 100.3);
        expect(result.length).toBe(1);
        expect(result[0].content).toBe("__dev_test_content_2");
    })


    afterAll(async () => {
        await chatDB.removeChat(new RoomId("1234567890"), chatid1);
        await chatDB.removeChat(new RoomId("1234567891"), chatid2);
        await chatDB.removeChat(new RoomId("1234567890"), chatid3);
        await chatDB.close();
    })

})