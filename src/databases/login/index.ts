import LoginDBClient, { LoginInfo } from "@databases/login/client";
export { LoginInfo };

export default class LoginDB {
    private loginDBClient: LoginDBClient

    constructor(loginDBClient: LoginDBClient) {
        this.loginDBClient = loginDBClient;
    }

    static async create() {
        const loginDBClient = await LoginDBClient.create();
        return new LoginDB(loginDBClient);
    }

    async create(username: string, password: string) : Promise<void> {
        await this.loginDBClient.insert({ username, password });
    }

    async remove(username: string) : Promise<void> {
        await this.loginDBClient.deleteOne({ username });
    }

    async isExist(username: string) : Promise<boolean> {
        const loginInfos = await this.loginDBClient.select({ username });
        return loginInfos.length !== 0;
    }

    async tryLogin(username: string, password: string) : Promise<boolean> {
        const loginInfos = await this.loginDBClient.select({ username, password });
        return loginInfos.length !== 0;
    }

    async close() {
        await this.loginDBClient.close();
    }
}