import { WebsocketUser } from "./types";

export type Obj = {
    [key: string]: any
};

export type MenuType = {
    language: string
    numDigits: number
    timeout?: number
    actionOnEmptyResult?: boolean
}

export type WelcomeValues = {
    voice?: string
    loop?: number
    messages: string[]
}

export {
    WebsocketUser
}