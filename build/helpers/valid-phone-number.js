"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAValidPhoneNumber = isAValidPhoneNumber;
/**
 * Verifica se o valor fornecido é válido como número de telefone
 * @param {Number | String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
    return /^[\d\+\-\(\) ]+$/.test(number);
}
