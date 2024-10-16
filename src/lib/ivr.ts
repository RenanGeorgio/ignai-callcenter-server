import twilio from "twilio";
import { giveInstructions, listRouters, serviceQeue, listAgents, listTasks } from "../actions";
import { MenuType, Obj, WelcomeValues } from "../types";

const actions = { giveInstructions, listRouters, serviceQeue, listAgents, listTasks };

export function welcome(company: string, menu: MenuType, values: WelcomeValues) {
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

export function menu(digit: string, menuList: string[], user: string) {
  const optionActions: Obj = {};

  let index = 1;
  for (const menuItem in menuList) {
    optionActions[index.toString()] = actions[menuItem];
    index++;
  }

  // @ts-ignore
  return (optionActions[digit]) ? optionActions[digit](user) : redirectWelcome();
};

export function routerFlow(digit: string) {
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

export function taskFlow(digit: string) {
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

export function agents(digit: string, agentList: string[]) {
  const optionActions: Obj = {};

  let index = 2;
  for (const agent in agentList) {
    optionActions[index.toString()] = agent;
    index++;
  }

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
function serviceAgent(agentId: string): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    }, 
    'Encaminhando para atendimento'
  );

  client.redirect(`/enqueue-incoming?agent=${agentId}`);

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