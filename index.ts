import mongoose from "mongoose";
import MainDB from "@databases/main";
import ChatDB from "@databases/chat";
import LoginDB from "@databases/login";

export default class SharedDB {

    mainDB?: MainDB
    chatDB?: ChatDB
    loginDB?: LoginDB

    constructor() {}

    async useUsers() {
        if ( this.mainDB === undefined ) {
            this.mainDB = await MainDB.create();
        }
        return this;
    }
    
    async useRooms() {
        return await this.useUsers();
    }

    async useChats() {
        if ( this.chatDB === undefined ) {
            this.chatDB = await ChatDB.create();
        }
        return this;
    }

    async useLogin() {
        if ( this.loginDB === undefined ) {
            this.loginDB = await LoginDB.create();
        }
        return this;
    }
    

    get users() {
        if ( this.mainDB === undefined ) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.users;
    }
    
    get rooms() {
        if ( this.mainDB === undefined ) {
            throw new Error("Unable to use 'users': mainDB is undefined");
        }
        return this.mainDB.rooms;
    }
    
    get chats() {
        if ( this.chatDB === undefined ) {
            throw new Error("Unable to use 'chats': chatDB is undefined");
        }
        return this.chatDB;
    }
    
    get login() {
        if ( this.loginDB === undefined ) {
            throw new Error("Unable to use 'login': loginDB is undefined");
        }
        return this.loginDB;
    }
    

    async close() {
        this.mainDB && await this.mainDB.close();
        this.chatDB && await this.chatDB.close();
        this.loginDB && await this.loginDB.close();
    }
}