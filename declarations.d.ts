declare module 'express' {
    interface Request {
        rawBody: any;
    }
};

declare module '*.json' {
    export const content: any;
};