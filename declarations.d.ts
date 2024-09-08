declare module 'express' {
    interface Request {
        rawBody: any;
    }
};

declare namespace Express {
    export interface Request {
        rawBody: any;
    }
};

declare module '*.json' {
    export const content: any;
};