import mysql, { FieldPacket, RowDataPacket, OkPacket } from "mysql2/promise";
import { loginDBConfig } from "@config/login.db.config";


export interface LoginInfo {
    username: string
    password: string
}

interface LoginDBResultData extends RowDataPacket, LoginInfo {};

function isAllowedString(value: string) : boolean {
    return value.match(/[^A-za-z0-9_]/) === null;
}

const alternativeFields = { password: "ACCESS DENIED" };
function removeBlockedFields(loginData: LoginInfo) {
    return {...loginData, ...alternativeFields};
}

function keys2query(keys: string[], pwIndex?: number, delimiter?: string) : string {
    return keys.map((value, index) => pwIndex === index ? `${value}=SHA2(?, 256)` : `${value}=?`).join(delimiter ?? " and ");
}



export default class LoginDBClient {
    private connection: mysql.Connection;
    
    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }


    static async create(): Promise<LoginDBClient> {
        return new LoginDBClient(await mysql.createConnection(loginDBConfig));
    }


    async insert(insertData: Partial<LoginInfo> & {[key: string]: string | number}): Promise<number> {
        if (insertData.password === undefined) {
            throw new Error("LoginDBClient.insert must receive 'password'.")
        }

        const keys = Object.keys(insertData).filter(isAllowedString);
        const values = keys.map((value) => insertData[value]);
        const pwIndex = keys.indexOf("password");
        const keyPart = keys.join(", ");
        const valuePart = Array(values.length).fill("?")
            .map((_, index) => index === pwIndex ? "SHA2(?, 256)" : "?")
            .join(", ");

        const sql = `INSERT INTO users(${keyPart}) VALUES (${valuePart})`;

        const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
        return result.insertId;
    }


    async update(beforeData: Partial<LoginInfo>, afterData: Partial<LoginInfo>): Promise<number> {
        const beforeDataKeys = Object.keys(beforeData).filter(isAllowedString);
        const afterDataKeys = Object.keys(afterData).filter(isAllowedString);
        const beforeDataValues = Object.values(beforeData);
        const afterDataValues = Object.values(afterData);
        // const values = beforeDataValues.concat(afterDataValues);
        const values = afterDataValues.concat(beforeDataValues);


        const beforePwIndex = beforeDataKeys.indexOf("password");
        const afterPwIndex = afterDataKeys.indexOf("password");
        const sql = `UPDATE users SET ${keys2query(afterDataKeys, afterPwIndex, ", ")}
            WHERE ${keys2query(beforeDataKeys, beforePwIndex)}`;

        const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
        return result.affectedRows;
    }

    async updateOne(beforeData: Partial<LoginInfo>, afterData: Partial<LoginInfo>): Promise<void> {
        const result = await this.update(beforeData, afterData);
        if ( result !== 1) {
            throw new Error(`result of update must be 1, not ${result}`);
        }
    }


    async delete(deleteData: Partial<LoginInfo>): Promise<number> {
        const keys = Object.keys(deleteData).filter(isAllowedString);
        const values = Object.values(deleteData);
        const pwIndex = keys.indexOf("password");
        const sql = `DELETE FROM users WHERE ${keys2query(keys, pwIndex)}`;

        const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
        return result.affectedRows;
    }

    async deleteOne(deleteData: Partial<LoginInfo>): Promise<void> {
        const result = await this.delete(deleteData);
        if ( result !== 1) {
            throw new Error(`result of delete must be 1, not ${result}`);
        }
    }


    async select(selectData: Partial<LoginInfo>): Promise<LoginInfo[]> {
        const keys = Object.keys(selectData).filter(isAllowedString);
        const values = Object.values(selectData);
        const pwIndex = keys.indexOf("password");
        const sql = `SELECT * FROM users WHERE ${keys2query(keys, pwIndex)}`;

        const [result]: [LoginDBResultData[], FieldPacket[]] = await this.connection.query(sql, values);
        return result.map(removeBlockedFields);
    }

    async selectOne(selectData: Partial<LoginInfo>): Promise<LoginInfo> {
        const result = await this.select(selectData);
        if ( result.length !== 1) {
            throw new Error(`selectOne must have one length, but ${result}`);
        }
        return result[0];
    }


    async close(): Promise<void> {
        await this.connection.end();
    }
}