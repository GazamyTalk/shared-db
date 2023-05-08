import LoginDBClient, { ILoginDBConfig, LoginInfo } from "./client";
export { LoginInfo };
export default class LoginDB {
    private loginDBClient;
    constructor(loginDBClient: LoginDBClient);
    static create(loginDBConfig: ILoginDBConfig): Promise<LoginDB>;
    create(username: string, password: string): Promise<void>;
    remove(username: string): Promise<void>;
    isExist(username: string): Promise<boolean>;
    tryLogin(username: string, password: string): Promise<boolean>;
    close(): Promise<void>;
}
