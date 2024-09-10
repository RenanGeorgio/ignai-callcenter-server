"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_pino_logger_1.default)());
// routes
app.use(routes_1.routes);
// @ts-ignore
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
/*
app.use(flash());

// middleware for flash message handling
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('errors');
    next();
});
*/
// notFound
app.use((req, res, next) => {
    const error = new Error('Not found');
    // @ts-ignore
    error.status = 404;
    next(error);
});
// catch all
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: error.message });
});
exports.default = app;
