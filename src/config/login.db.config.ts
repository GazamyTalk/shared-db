import { assertUndefinedValue } from "./helpers";

export const loginDBConfig = {
    host: process.env.LOGIN_DB_HOST!,
    port: Number.parseInt(process.env.LOGIN_DB_PORT || "0"),
    user: process.env.LOGIN_DB_USER!,
    password: process.env.LOGIN_DB_PASSWORD!,
    database: process.env.LOGIN_DB_DATABASE!
};
assertUndefinedValue(loginDBConfig, 'loginDBConfig');