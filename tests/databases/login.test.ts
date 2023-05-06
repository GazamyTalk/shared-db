import dotenv from "dotenv";
dotenv.config();

import LoginDB from "@databases/login";

describe("test LoginDB", () => {

    let loginDB: LoginDB;

    beforeAll(async () => {
        loginDB = await LoginDB.create();
    })


    test("create user", async () => {
        await loginDB.create("__dev_test_username_1", "__dev_test_password_1");
        await loginDB.create("__dev_test_username_2", "__dev_test_password_2");
        await loginDB.create("__dev_test_username_3", "__dev_test_password_3");
    })
    test("remove user", async () => {
        await loginDB.remove("__dev_test_username_3");
    })

    test("is exist user", async () => {
        expect(await loginDB.isExist("__dev_test_username_1")).toBe(true);
        expect(await loginDB.isExist("__dev_test_username_3")).toBe(false);
        expect(await loginDB.isExist("__dev_test_username_4")).toBe(false);
    })

    test("try login", async () => {
        expect(await loginDB.tryLogin("__dev_test_username_1", "__dev_test_password_1")).toBe(true);
        expect(await loginDB.tryLogin("__dev_test_username_1", "__dev_test_password_2")).toBe(false);
        expect(await loginDB.tryLogin("__dev_test_username_3", "__dev_test_password_3")).toBe(false);
        expect(await loginDB.tryLogin("__dev_test_username_4", "__dev_test_password_4")).toBe(false);
    })


    afterAll(async () => {
        await loginDB.close();
    })


})