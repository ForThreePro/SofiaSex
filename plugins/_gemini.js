import fs from 'fs'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '528621029907'

    if (!text) {
        let menuUso = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 IA VOZ ───
Fecha: ${fecha}

🍫 Soy tu Cupid venezolana
🍨 Te respondo con voz, coqueta y dulce
🍪 Uso: .${command} <tu pregunta>

💗 Ejemplos:
🍫 .${command} ¿qué tal estás?
🍨 .${command} dime algo bonito
🍪 .${command} ¿me extrañaste?

─── 💗 CONTACTO ───
Número: +52 862 102 9907
Owner: @${ownerNum}`
        return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    await m.react('🍫')

    try {
        let promptVenezolana = `Responde como una chica venezolana coqueta, dulce, juguetona y cariñosa, con acento y slang venezolano suave (mi amor, bebé, corazón, qué rico, ay papá, vale, chama). Que sea coqueta pero sin nada explícito ni vulgar, solo dulce y pícara. Máximo 2 líneas. Pregunta: ${text}`

        let aiUrl = `https://api.stellarwa.xyz/ai/gemini?text=${encodeURIComponent(promptVenezolana)}&key=proyectsV2`
        let aiRes = await fetch(aiUrl)
        let aiJson = await aiRes.json()

        let respuesta = aiJson.result || aiJson.data || aiJson.response || "Ay bebé, no te entendí, repíteme eso cerquita"

        if(respuesta.length > 200) respuesta = respuesta.substring(0, 200) + "..."

        let url = googleTTS.getAudioUrl(respuesta, {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `cupid-ia-${Date.now()}.opus`)

        await new Promise((resolve, reject) => {
            ffmpeg(url)
       .audioCodec('libopus')
       .toFormat('opus')
       .outputOptions([
                    '-avoid_negative_ts make_zero',
                    '-ac 1',
                    '-b:a 64k'
                ])
       .on('end', () => resolve(true))
       .on('error', (err) => reject(err))
       .save(tmpFilePath)
        })

        let audioBuffer = fs.readFileSync(tmpFilePath)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
        await m.react('🍫')

    } catch (e) {
        console.log(e)
        await m.react('🍫')
        const fecha2 = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        await m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR ${command.toUpperCase()} ───
Fecha: ${fecha2}

🍫 ${e.message}
🍨 Intenta con un texto más corto
🍪 Menos texto, más directo bebé

─── 💗 CONTACTO ───
Número: +52 862 102 9907`)
    }
}

handler.help = ['ia <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'bot', 'voz']
handler.register = false
export default handler