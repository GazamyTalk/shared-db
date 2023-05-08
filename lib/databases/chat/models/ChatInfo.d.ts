import { RoomId } from "../../main";
export interface ChatInfo {
    chatid: string;
    username: string;
    roomid: RoomId;
    type: string;
    content: string;
    time: number;
}
