"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goToPlanets = exports.goToWelcome = exports.goToMenu = void 0;
const ivr_1 = require("../lib/ivr");
const goToMenu = (request, response, next) => {
    try {
        const { Digits } = request.body;
        return response.send((0, ivr_1.menu)(Digits));
    }
    catch (error) {
        next(error);
    }
};
exports.goToMenu = goToMenu;
const goToWelcome = (request, response, next) => {
    try {
        response.send((0, ivr_1.welcome)());
    }
    catch (error) {
        next(error);
    }
};
exports.goToWelcome = goToWelcome;
const goToPlanets = (request, response, next) => {
    try {
        const { Digits } = request.body;
        response.send((0, ivr_1.planets)(Digits));
    }
    catch (error) {
        next(error);
    }
};
exports.goToPlanets = goToPlanets;
