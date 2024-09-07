import twilio from "twilio";

export function welcome() {
  const client = new twilio.twiml.VoiceResponse();

  const action = client.gather({
    action: '/ivr/menu',
    language: 'pt-BR',
    numDigits: 1, // TO-DO: colocar dimanico qd identificar cliente
    timeout: 5, // default = 5
    method: 'POST',
    actionOnEmptyResult: false,
  });

  action.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Camila', // Polly.Ricardo
      loop: 3
     },
    'Thanks for calling the E T Phone Home Service. ' +
    'Please press 1 for directions. ' +
    'Press 2 for a list of planets to call.'
  );

  client.say(
    { 
      language: 'pt-BR',
      voice: 'Polly.Ricardo',
      loop: 1
     },
    'Não detectamos nenhum digito!'
  );

  return client.toString();
};

export function menu(digit: string) {
  const optionActions = {
    '1': giveExtractionPointInstructions,
    '2': listPlanets,
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
 * Returns Twiml
 * @return {String}
 */
function giveExtractionPointInstructions() {
  const client = new twilio.twiml.VoiceResponse();

  client.say(
    { voice: 'Polly.Amy', language: 'en-GB' },
    'To get to your extraction point, get on your bike and go down ' +
    'the street. Then Left down an alley. Avoid the police cars. Turn left ' +
    'into an unfinished housing development. Fly over the roadblock. Go ' +
    'passed the moon. Soon after you will see your mother ship.'
  );

  client.say(
    'Thank you for calling the ET Phone Home Service - the ' +
    'adventurous alien\'s first choice in intergalactic travel'
  );

  client.hangup();

  return client.toString();
}

/**
 * Returns a TwiML to interact with the client
 * @return {String}
 */
function listPlanets() {
  const client = new twilio.twiml.VoiceResponse();

  const gather = client.gather({
    action: '/ivr/planets',
    numDigits: 1,
    method: 'POST',
  });

  gather.say(
    { voice: 'Polly.Amy', language: 'en-GB', loop: 3 },
    'To call the planet Broh doe As O G, press 2. To call the planet DuhGo ' +
    'bah, press 3. To call an oober asteroid to your location, press 4. To ' +
    'go back to the main menu, press the star key '
  );

  return client.toString();
}

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const client = new twilio.twiml.VoiceResponse();

  client.say({
    voice: 'Polly.Amy',
    language: 'en-GB',
  }, 'Returning to the main menu');

  client.redirect('/ivr/welcome');

  return client.toString();
}