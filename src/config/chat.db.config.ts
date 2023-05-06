import { assertUndefinedValue } from "./helpers";

export const chatDBConfig = {
    uri: process.env.CHAT_DB_URI!
}
assertUndefinedValue(chatDBConfig, 'chatDBConfig');