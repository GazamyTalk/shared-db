import { RoomDB, UserDB } from "./databases/main";
import ChatDB from "./databases/chat";
import LoginDB from "./databases/login";
import { IMainDBConfig } from "./databases/main/client";
import { IChatDBConfig } from "./databases/chat/client";
import { ILoginDBConfig } from "./databases/login/client";
export { RoomDB, UserDB };
export { UserInfo, RoomInfo, RoomId } from "./databases/main";
export { ChatInfo } from "./databases/chat";
export { LoginInfo } from "./databases/login";
export interface IConfig {
    mainDB?: IMainDBConfig;
    chatDB?: IChatDBConfig;
    loginDB?: ILoginDBConfig;
}
export default class SharedDB {
    private mainDB?;
    private chatDB?;
    private loginDB?;
    constructor();
    static create(config: IConfig): Promise<SharedDB>;
    get users(): UserDB;
    get rooms(): RoomDB;
    get chats(): ChatDB;
    get login(): LoginDB;
    close(): Promise<void>;
}
