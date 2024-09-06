import VoiceResponse from "twilio";

export function welcome() {
  const client = new VoiceResponse.twiml.VoiceResponse();

  const gather = client.gather({
    action: '/ivr/menu',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'Thanks for calling the E T Phone Home Service. ' +
    'Please press 1 for directions. ' +
    'Press 2 for a list of planets to call.',
    {loop: 3}
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
    const client = new VoiceResponse.twiml.VoiceResponse();
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
  const client = new VoiceResponse.twiml.VoiceResponse();

  client.say(
    'To get to your extraction point, get on your bike and go down ' +
    'the street. Then Left down an alley. Avoid the police cars. Turn left ' +
    'into an unfinished housing development. Fly over the roadblock. Go ' +
    'passed the moon. Soon after you will see your mother ship.',
    {voice: 'Polly.Amy', language: 'en-GB'}
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
  const client = new VoiceResponse.twiml.VoiceResponse();

  const gather = client.gather({
    action: '/ivr/planets',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'To call the planet Broh doe As O G, press 2. To call the planet DuhGo ' +
    'bah, press 3. To call an oober asteroid to your location, press 4. To ' +
    'go back to the main menu, press the star key ',
    {voice: 'Polly.Amy', language: 'en-GB', loop: 3}
  );

  return client.toString();
}

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const client = new VoiceResponse.twiml.VoiceResponse();

  client.say('Returning to the main menu', {
    voice: 'Polly.Amy',
    language: 'en-GB',
  });

  client.redirect('/ivr/welcome');

  return client.toString();
}