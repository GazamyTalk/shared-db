import MainDB, { RoomDB, UserDB } from "./databases/main";
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
    mainDB?: IMainDBConfig
    chatDB?: IChatDBConfig
    loginDB?: ILoginDBConfig
}

export default class SharedDB {

    private mainDB?: MainDB
    private chatDB?: ChatDB
    private loginDB?: LoginDB

    constructor() {}

    static async create(config: IConfig) {
        const sharedDB = new SharedDB();
        sharedDB.mainDB = config.mainDB && await MainDB.create(config.mainDB);
        sharedDB.chatDB = config.chatDB && await ChatDB.create(config.chatDB);
        sharedDB.loginDB = config.loginDB && await LoginDB.create(config.loginDB);
        return sharedDB;
    }


    get users() : UserDB {
        if ( this.mainDB === undefined ) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.users;
    }
    
    get rooms() : RoomDB {
        if ( this.mainDB === undefined ) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.rooms;
    }
    
    get chats() : ChatDB {
        if ( this.chatDB === undefined ) {
            throw new Error("Unable to use 'chats': chatDB is undefined");
        }
        return this.chatDB;
    }
    
    get login() : LoginDB {
        if ( this.loginDB === undefined ) {
            throw new Error("Unable to use 'login': loginDB is undefined");
        }
        return this.loginDB;
    }
    

    async close() : Promise<void> {
        this.mainDB && await this.mainDB.close();
        this.chatDB && await this.chatDB.close();
        this.loginDB && await this.loginDB.close();
    }
}