const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')






const flowClima = addKeyword(['clima', 'temperatura']).addAnswer('🌡️ La temperatura actual es de 30°C')
        
const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *CalorcitoBot*')
    .addAnswer(
        [
            'Me puedes escribir los siguiente comandos:',
            '👉 *Clima* y te dire la temperatura actual',
            '👉 *cumplido*  y te diré algo lindo',
        ],
        null,
        null,
        [flowClima]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
