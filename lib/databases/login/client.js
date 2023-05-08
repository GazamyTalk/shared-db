"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
;
function isAllowedString(value) {
    return value.match(/[^A-za-z0-9_]/) === null;
}
const alternativeFields = { password: "ACCESS DENIED" };
function removeBlockedFields(loginData) {
    return Object.assign(Object.assign({}, loginData), alternativeFields);
}
function keys2query(keys, pwIndex, delimiter) {
    return keys.map((value, index) => pwIndex === index ? `${value}=SHA2(?, 256)` : `${value}=?`).join(delimiter !== null && delimiter !== void 0 ? delimiter : " and ");
}
class LoginDBClient {
    constructor(connection) {
        this.connection = connection;
    }
    static create(loginDBConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return new LoginDBClient(yield promise_1.default.createConnection(loginDBConfig));
        });
    }
    insert(insertData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (insertData.password === undefined) {
                throw new Error("LoginDBClient.insert must receive 'password'.");
            }
            const keys = Object.keys(insertData).filter(isAllowedString);
            const values = keys.map((value) => insertData[value]);
            const pwIndex = keys.indexOf("password");
            const keyPart = keys.join(", ");
            const valuePart = Array(values.length).fill("?")
                .map((_, index) => index === pwIndex ? "SHA2(?, 256)" : "?")
                .join(", ");
            const sql = `INSERT INTO users(${keyPart}) VALUES (${valuePart})`;
            const [result] = yield this.connection.query(sql, values);
            return result.insertId;
        });
    }
    update(beforeData, afterData) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [result] = yield this.connection.query(sql, values);
            return result.affectedRows;
        });
    }
    updateOne(beforeData, afterData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.update(beforeData, afterData);
            if (result !== 1) {
                throw new Error(`result of update must be 1, not ${result}`);
            }
        });
    }
    delete(deleteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(deleteData).filter(isAllowedString);
            const values = Object.values(deleteData);
            const pwIndex = keys.indexOf("password");
            const sql = `DELETE FROM users WHERE ${keys2query(keys, pwIndex)}`;
            const [result] = yield this.connection.query(sql, values);
            return result.affectedRows;
        });
    }
    deleteOne(deleteData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.delete(deleteData);
            if (result !== 1) {
                throw new Error(`result of delete must be 1, not ${result}`);
            }
        });
    }
    select(selectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(selectData).filter(isAllowedString);
            const values = Object.values(selectData);
            const pwIndex = keys.indexOf("password");
            const sql = `SELECT * FROM users WHERE ${keys2query(keys, pwIndex)}`;
            const [result] = yield this.connection.query(sql, values);
            return result.map(removeBlockedFields);
        });
    }
    selectOne(selectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.select(selectData);
            if (result.length !== 1) {
                throw new Error(`selectOne must have one length, but ${result}`);
            }
            return result[0];
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.end();
        });
    }
}
exports.default = LoginDBClient;
