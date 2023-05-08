import mysql from "mysql2/promise";
export interface LoginInfo {
    username: string;
    password: string;
}
export interface ILoginDBConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
export default class LoginDBClient {
    private connection;
    constructor(connection: mysql.Connection);
    static create(loginDBConfig: ILoginDBConfig): Promise<LoginDBClient>;
    insert(insertData: Partial<LoginInfo> & {
        [key: string]: string | number;
    }): Promise<number>;
    update(beforeData: Partial<LoginInfo>, afterData: Partial<LoginInfo>): Promise<number>;
    updateOne(beforeData: Partial<LoginInfo>, afterData: Partial<LoginInfo>): Promise<void>;
    delete(deleteData: Partial<LoginInfo>): Promise<number>;
    deleteOne(deleteData: Partial<LoginInfo>): Promise<void>;
    select(selectData: Partial<LoginInfo>): Promise<LoginInfo[]>;
    selectOne(selectData: Partial<LoginInfo>): Promise<LoginInfo>;
    close(): Promise<void>;
}
