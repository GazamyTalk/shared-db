import { assertUndefinedValue } from "./helpers";

export const mainDBConfig = {
    uri: process.env.MAIN_DB_URI!
}
assertUndefinedValue(mainDBConfig, 'mainDBConfig');