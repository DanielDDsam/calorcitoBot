const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const fetch = require('node-fetch'); // Agregamos esta línea para importar 'node-fetch'

// Configura tu clave de API de pronóstico del tiempo
const WEATHER_API_KEY = '14bae0fad7a7b351359804e252851579';
const LOCATION = 'valparaiso';

async function getWeather() {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${WEATHER_API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;

    const weatherMessage = `El clima en ${LOCATION} es ${weatherDescription} con una temperatura de ${temperature}°C.`;
    return weatherMessage;
  } catch (error) {
    console.error('Error al obtener el pronóstico del tiempo:', error);
    return 'No se pudo obtener el pronóstico del tiempo.';
  }
}

const flowClima = addKeyword(['clima', 'temperatura']).addAnswer(async () => {
  const weatherMessage = await getWeather();
  return weatherMessage;
});

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola bienvenido a este *CalorcitoBot*')
  .addAnswer(
    [
      'Me puedes escribir los siguientes comandos:',
      '👉 *Clima* y te diré la temperatura actual',
      '👉 *cumplido*  y te diré algo lindo',
    ],
    null,
    null,
    [flowClima]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
