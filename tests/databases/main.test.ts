import dotenv from "dotenv";
dotenv.config();

import MainDB, { RoomId } from "@databases/main";

describe("test MainDB", () => {

    let mainDB: MainDB;

    beforeAll(async () => {
        mainDB = await MainDB.create({
            uri: process.env.MAIN_DB_URI!
        });
    })


    describe("test MainDB.users", () => {

        let roomid1: RoomId;
        let roomid2: RoomId;
        let roomid3: RoomId;

        beforeAll(async () => {
            roomid1 = await mainDB.rooms.create();
            roomid2 = await mainDB.rooms.create();
            roomid3 = await mainDB.rooms.create();
        })

        test("create user", async () => {
            await mainDB.users.create("__dev_test_username_1", "__dev_test_nickname_1");
            await mainDB.users.create("__dev_test_username_2", "__dev_test_nickname_2");
            await mainDB.users.create("__dev_test_username_3", "__dev_test_nickname_3");
        })

        test("remove user", async () => {
            await mainDB.users.remove("__dev_test_username_3");
        })

        test("isExist user", async () => {
            expect(await mainDB.users.isExist("__dev_test_username_1")).toBe(true);
            expect(await mainDB.users.isExist("__dev_test_username_3")).toBe(false);
            expect(await mainDB.users.isExist("__dev_test_username_4")).toBe(false);
        })

        test("setInfo", async () => {
            await mainDB.users.setInfo("__dev_test_username_1", { description: "__dev_test_description_1" });
        })

        test("getInfo", async () => {
            let result = await mainDB.users.getInfo("__dev_test_username_1");
            expect(result.username).toBe("__dev_test_username_1");
            expect(result.nickname).toBe("__dev_test_nickname_1");
            expect(result.description).toBe("__dev_test_description_1");
            expect(result.friends).toStrictEqual([]);
            expect(result.rooms).toStrictEqual([]);

            result = await mainDB.users.getInfo("__dev_test_username_2");
            expect(result.username).toBe("__dev_test_username_2");
            expect(result.nickname).toBe("__dev_test_nickname_2");
            expect(result.description).toBe("");
            expect(result.friends).toStrictEqual([]);
            expect(result.rooms).toStrictEqual([]);
        })

        test("getInfos", async () => {
            const result = await mainDB.users.getInfos([ "__dev_test_username_1", "__dev_test_username_2", "__dev_test_username_3" ]);
            expect(result.length).toBe(2);
            expect(result[0].username).toBe("__dev_test_username_1");
            expect(result[1].username).toBe("__dev_test_username_2");
        })

        test("addFriend", async () => {
            await mainDB.users.addFriend("__dev_test_username_1", "__dev_test_username_2");
            await mainDB.users.addFriend("__dev_test_username_1", "__dev_test_username_3");
        })

        test("removeFriend", async () => {
            await mainDB.users.removeFriend("__dev_test_username_1", "__dev_test_username_3");
        })

        test("isFriend", async () => {
            expect(await mainDB.users.isFriend("__dev_test_username_1", "__dev_test_username_2")).toBe(true);
            expect(await mainDB.users.isFriend("__dev_test_username_1", "__dev_test_username_3")).toBe(false);
            expect(await mainDB.users.isFriend("__dev_test_username_2", "__dev_test_username_1")).toBe(false);
        })

        test("enterRoom", async () => {
            await mainDB.users.enterRoom("__dev_test_username_1", roomid1);
            await mainDB.users.enterRoom("__dev_test_username_1", roomid2);
        })

        test("exitRoom", async () => {
            await mainDB.users.exitRoom("__dev_test_username_1", roomid2);
        })

        test("isInRoom", async () => {
            expect(await mainDB.users.isInRoom("__dev_test_username_1", roomid1)).toBe(true);
            expect(await mainDB.users.isInRoom("__dev_test_username_1", roomid2)).toBe(false);
            expect(await mainDB.users.isInRoom("__dev_test_username_1", roomid3)).toBe(false);
            expect(await mainDB.users.isInRoom("__dev_test_username_2", roomid1)).toBe(false);
        })

        afterAll(async () => {
            await mainDB.users.remove("__dev_test_username_1");
            await mainDB.users.remove("__dev_test_username_2");

            await mainDB.rooms.remove(roomid1);
            await mainDB.rooms.remove(roomid2);
            await mainDB.rooms.remove(roomid3);
        })

    })


    describe("test MainDB.rooms", () => {

        let roomid1: RoomId;
        let roomid2: RoomId;
        let roomid3: RoomId;

        beforeAll(async () => {
            await mainDB.users.create("__dev_test_room_username_1", "__dev_test_room_nickname_1");
            await mainDB.users.create("__dev_test_room_username_2", "__dev_test_room_nickname_2");
            await mainDB.users.create("__dev_test_room_username_3", "__dev_test_room_nickname_3");
        })

        test("create room", async () => {
            roomid1 = await mainDB.rooms.create();
            roomid2 = await mainDB.rooms.create();
            roomid3 = await mainDB.rooms.create();
        })

        test("remove room", async () => {
            await mainDB.rooms.remove(roomid3);
        })

        test("isExist", async () => {
            expect(await mainDB.rooms.isExist(roomid1)).toBe(true);
            expect(await mainDB.rooms.isExist(roomid2)).toBe(true);
            expect(await mainDB.rooms.isExist(roomid3)).toBe(false);
        })

        test("setInfo", async () => {
            await mainDB.rooms.setInfo(roomid1, { description: "__dev_test_description_1" });
        })

        test("getInfo", async () => {
            const result = await mainDB.rooms.getInfo(roomid1);
            expect(result.description).toBe("__dev_test_description_1");
            expect(result.roomid.valueOf()).toBe(roomid1.valueOf());
            expect(result.roomname).toBe("");
            expect(result.users).toStrictEqual([]);
        })

        test("getInfos", async () => {
            const result = await mainDB.rooms.getInfos([ roomid1, roomid2, roomid3 ]);
            expect(result.length).toBe(2);
            expect(result[0].description).toBe("__dev_test_description_1");
            expect(result[1].description).toBe("");
        })

        test("userEnter", async () => {
            await mainDB.rooms.userEnter(roomid1, "__dev_test_room_username_1");
            await mainDB.rooms.userEnter(roomid1, "__dev_test_room_username_2");
            expect((await mainDB.rooms.getInfo(roomid1)).users.includes("__dev_test_room_username_1")).toBe(true);
            expect((await mainDB.rooms.getInfo(roomid1)).users.includes("__dev_test_room_username_2")).toBe(true);
            expect((await mainDB.rooms.getInfo(roomid1)).users.includes("__dev_test_room_username_3")).toBe(false);
        })
        
        test("userExit", async () => {
            await mainDB.rooms.userEnter(roomid1, "__dev_test_room_username_2");
            expect(await mainDB.users.isInRoom("__dev_test_room_username_2", roomid1)).toBe(false);
        })

        afterAll(async () => {
            await mainDB.rooms.remove(roomid1);
            await mainDB.rooms.remove(roomid2);

            await mainDB.users.remove("__dev_test_room_username_1");
            await mainDB.users.remove("__dev_test_room_username_2");
            await mainDB.users.remove("__dev_test_room_username_3");
        })

    })

    
    afterAll(async () => {
        await mainDB.close();
    })

})