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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_json_1 = require("../config/auth.json");
function checkToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: "No token provided" });
            }
            jsonwebtoken_1.default.verify(token, auth_json_1.secret, (error, decoded) => {
                if (error) {
                    if (error.message === 'jwt expired') {
                        return res.status(401).send({ message: 'Token expired' });
                    }
                    return res.status(401).send({ message: 'Invalid token' });
                }
                else {
                    const { companyId } = req.params;
                    req.params.companyId = companyId ? companyId : decoded.companyId;
                    req.params.userId = decoded.id;
                    next();
                }
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    });
}
exports.default = checkToken;
