import twilio from "twilio";
import * as actions from "../actions";
import { giveExtractionPointInstructions, listPlanets, serviceAgent } from "../actions";
import { MenuType, Obj, WelcomeValues } from "../types";

export function welcome(From: string, To: string, CallSid: string, company: string, menu: MenuType, values: WelcomeValues) {
  const client = new twilio.twiml.VoiceResponse();

  const { language, numDigits, timeout, actionOnEmptyResult } = menu;

  const action = client.gather({
    action: `/menu?user=${company}`,
    language: language,
    numDigits: numDigits,
    timeout: timeout ? timeout : 5,
    method: 'POST',
    actionOnEmptyResult: actionOnEmptyResult ? actionOnEmptyResult : false,
  });

  const { voice, loop, messages } = values;
  
  action.say(
    { 
      language: language,
      voice: voice ? voice : 'Polly.Camila',
      loop: loop ? loop : 3
    },
    messages.join(" ")
  );

  client.say(
    { 
      language: language,
      voice: voice ? voice : 'Polly.Ricardo',
      loop: 1
    },
    'Não detectamos nenhum digito!'
  );

  return client.toString();
};

export function menu(digit: string, menuList: string[]) {
  // TO-DO estudar abordagem para puxar isso do cliente
  //const selectedFunction = templateFunctions[RedirectPath];

  const optionActions: Obj = {};
  let index = 1;
  for (const menuItem in menuList) {
    optionActions[index.toString()] = actions[menuItem] as Function;
    index++;
  }

  // @ts-ignore
  return (optionActions[digit]) ? optionActions[digit](selectedFunction) : redirectWelcome();
};

export function planets(digit: string) {
  const optionActions = {
    '2': '+19295566487',
    '3': '+17262043675',
    '4': '+16513582243',
  };

  // @ts-ignore
  if (optionActions[digit]) {
    const client = new twilio.twiml.VoiceResponse();
    // @ts-ignore
    client.dial(optionActions[digit]);

    return client.toString();
  }

  return redirectWelcome();
};

/**
 * Retorna um xml com o redirecionamento
 * @return {String}
 */
function redirectWelcome(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
     }, 
    'Voltando ao menu principal'
  );

  client.redirect('/welcome');

  return client.toString();
}