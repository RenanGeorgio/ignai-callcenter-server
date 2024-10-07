import twilio from "twilio";

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

export {
  giveExtractionPointInstructions,
  listPlanets,
  serviceAgent
}