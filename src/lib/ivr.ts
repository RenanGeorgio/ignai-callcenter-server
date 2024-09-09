import twilio from "twilio";

export function welcome() {
  // TO-DO: checkar se o usuario possui IVR (URA)
  const hasIvr = true;
  const client = new twilio.twiml.VoiceResponse();

  if (hasIvr) {
    const action = client.gather({
      action: '/menu',
      language: 'pt-BR',
      numDigits: 1, // TO-DO: colocar dimanico qd identificar cliente
      timeout: 5, // default = 5
      method: 'POST',
      actionOnEmptyResult: false,
    });

    // TO-DO: Obter as falas atravez da identificação do cliente e puxando isso de um banco de dados
    action.say(
      { 
        language: 'pt-BR',
        voice: 'Polly.Camila', // Polly.Ricardo
        loop: 3
      },
      'Muito obrigado por ligar. ' +
      'Por favor pressione 1 para receber direções. ' +
      'Pressione 2 para obter uma lista de telefones de contato para ligar.' +
      'Pressione 3 para falar com um atendente. ' +
    );

    client.say(
      { 
        language: 'pt-BR',
        voice: 'Polly.Ricardo',
        loop: 1
      },
      'Não detectamos nenhum digito!'
    );
  } else {
    client.redirect('/incoming');
  }

  return client.toString();
};

export function menu(digit: string) {
  // TO-DO estudar abordagem para puxar isso do cliente
  const optionActions = {
    '1': giveExtractionPointInstructions,
    '2': listPlanets,
    '3': serviceAgent,
  };

  return (optionActions[digit]) ? optionActions[digit]() : redirectWelcome();
};

export function planets(digit: string) {
  const optionActions = {
    '2': '+19295566487',
    '3': '+17262043675',
    '4': '+16513582243',
  };

  if (optionActions[digit]) {
    const client = new twilio.twiml.VoiceResponse();
    client.dial(optionActions[digit]);

    return client.toString();
  }

  return redirectWelcome();
};

/**
 * Retorna Twiml
 * @return {String}
 */
function giveExtractionPointInstructions() {
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
function listPlanets() {
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
function serviceAgent() {
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
function redirectWelcome() {
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