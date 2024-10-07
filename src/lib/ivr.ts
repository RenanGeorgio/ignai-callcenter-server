import twilio from "twilio";
import { MenuType, WelcomeValues } from "../types";

export function welcome(From: string, To: string, CallSid: string, company: string, menu: MenuType, values: WelcomeValues) {
  const client = new twilio.twiml.VoiceResponse();

  const { language, numDigits, timeout, actionOnEmptyResult } = menu;

  const action = client.gather({
    action: '/menu',
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

export function menu(digit: string) {
  // TO-DO estudar abordagem para puxar isso do cliente
  const selectedFunction = templateFunctions[RedirectPath];


  const optionActions = {
    '1': giveExtractionPointInstructions,
    '2': listPlanets,
    '3': serviceAgent,
  };

  // @ts-ignore
  return (optionActions[digit]) ? optionActions[digit]() : redirectWelcome();
};

// PARECE UM DOS CAMINHOS MAIS APROPRIADOS
export function menu2(digit: string) {
  // TO-DO estudar abordagem para puxar isso do cliente
  const selectedFunction = templateFunctions[RedirectPath];


  const optionActions = {
    '1': giveExtractionPointInstructions,
    '2': listPlanets,
    '3': serviceAgent,
  };

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
 * Retorna Twiml
 * @return {String}
 */
function giveExtractionPointInstructions(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Para chegar ao seu ponto de extração, suba na bicicleta e desça ' +
    'a rua. Então saiu por um beco. Evite os carros da polícia. Vire à esquerda ' +
    'em um conjunto habitacional inacabado. Voe sobre o bloqueio. Ir ' +
    'passou a lua. Logo depois você verá sua nave-mãe.'
  );

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
    },
    'Obrigado por ligar para o ET Phone Home Service - o ' +
    'A primeira escolha de um alienígena aventureiro em viagens intergalácticas'
  );

  client.hangup();

  return client.toString();
}

/**
 * Retorna uma TwiML para interagir com o cliente
 * @return {String}
 */
function listPlanets(): string {
  const client = new twilio.twiml.VoiceResponse();

  const action = client.gather({
    action: '/planets',
    language: 'pt-BR',
    numDigits: 1,
    timeout: 3,
    method: 'POST',
    actionOnEmptyResult: false,
  });

  action.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Camila',
      loop: 3
     },
    'Para chamar o planeta Broh doe As O G, pressione 2. Para chamar o planeta DuhGo ' +
    'bah, pressione 3. Para chamar um asteróide oober para sua localização, pressione 4. Para ' +
    'volte ao menu principal, pressione a tecla estrela '
  );

  return client.toString();
}

/**
 * Retorna um xml com o redirecionamento
 * @return {String}
 */
function serviceAgent(): string {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
     }, 
    'Encaminhando para atendimento'
  );

  client.redirect('/incoming');

  return client.toString();
}

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