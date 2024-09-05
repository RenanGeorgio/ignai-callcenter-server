/**
 * Verifica se o valor fornecido é válido como número de telefone
 * @param {Number | String} number
 * @return {Boolean}
 */
export function isAValidPhoneNumber(number: string) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}