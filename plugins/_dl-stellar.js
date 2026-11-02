import ytsearch from "yt-search"
import fetch from "node-fetch"
import moment from 'moment-timezone'
moment.locale('es')

const api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const getBuffer = async (url) => {
    const res = await fetch(url)
    if(!res.ok) throw new Error('No se pudo descargar el buffer')
    return Buffer.from(await res.arrayBuffer())
}

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '528621029907'
    let text = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || ''
    text = text.replace(`.${command}`, '').trim()

    if (!text) {
        return conn.sendMessage(m.chat, { text: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESCARGAS ───
Fecha: ${fecha}

🍫 .play1 <nombre de canción>
🍨 Descarga audio de YouTube MP3

🍫 .ttmp3 <link de tiktok>
🍨 Descarga audio de TikTok MP3

🍫 .fb <link de facebook>
🍨 Descarga video de Facebook

💗 Ejemplos:
🍫 .play1 despacito
🍨 .ttmp3 https://tiktok.com/@user/video
🍪 .fb https://facebook.com/watch?v=xxx

─── 💗 CONTACTO ───
Número: +52 862 102 9907
Owner: @${ownerNum}`, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    await react(conn, m, '🍫')
    try {
        if (command === 'play1') {
            const searchResult = await ytsearch(text)
            if (!searchResult.videos.length) throw new Error("No se encontró la canción.")
            const video = searchResult.videos[0]

            const apiUrl = `${api.url}/dl/ytmp3?url=${encodeURIComponent(video.url)}&key=${api.key}`
            const resDl = await fetch(apiUrl).then(r => r.json())
            const dl = resDl?.data?.dl || resDl?.data?.download
            if (!dl) throw new Error('No se pudo descargar el audio de YT')

            const audioBuffer = await getBuffer(dl)
            let caption = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PLAY1 ───\nFecha: ${fecha}\n\n🍫 Título: ${video.title}\n🍨 Canal: ${video.author.name}\n🍪 Duración: ${video.timestamp}\n💗 Link: ${video.url}\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`,
                caption: caption
            }, { quoted: m })
        }

        if (command === 'ttmp3') {
            const apiUrl = `${api.url}/dl/tiktokmp3?url=${encodeURIComponent(text)}&key=${api.key}`
            const res = await fetch(apiUrl).then(r => r.json())
            const data = res?.data || res?.result
            let dl = data?.download || data?.dl || data?.music
            const title = data?.title || 'TikTok'
            if (!dl) throw new Error('No se pudo descargar. Link mal o privado')

            const audioBuffer = await getBuffer(dl)
            let caption = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TTMP3 ───\nFecha: ${fecha}\n\n🍫 Título: ${title}\n🍨 Fuente: TikTok\n🍪 Estado: Listo\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                caption: caption
            }, { quoted: m })
        }

        if (command === 'fb' || command === 'facebook') {
            const apiUrl = `${api.url}/dl/facebook?url=${encodeURIComponent(text)}&key=${api.key}`
            const res = await fetch(apiUrl)

            let videoBuffer
            const ct = res.headers.get('content-type')
            if(ct?.includes('application/json')){
                const data = await res.json()
                if(!data.status) throw new Error(data.message || 'Error API')
                videoBuffer = await getBuffer(data.result.url)
            } else {
                videoBuffer = Buffer.from(await res.arrayBuffer())
            }

            await conn.sendMessage(m.chat, {
                video: videoBuffer,
                caption: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 FACEBOOK ───\nFecha: ${fecha}\n\n🍫 Video descargado correctamente\n🍨 Disfrútalo\n🍪 Cupid lo aprueba\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`
            }, { quoted: m })
        }

        await react(conn, m, '🍫')
    } catch (e) {
        await react(conn, m, '🍫')
        const fecha2 = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        console.log("ERROR:", e)
        return conn.sendMessage(m.chat, { text: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 ERROR ${command.toUpperCase()} ───\nFecha: ${fecha2}\n\n🍫 ${e.message}\n🍨 Verifica que el link sea válido\n🍪 Asegúrate que no sea privado\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907` }, { quoted: m })
    }
}

handler.help = ['play1 <nombre>', 'ttmp3 <link>', 'fb <link>']
handler.tags = ['descargas']
handler.command = /^(play1|ttmp3|fb|facebook)$/i
handler.register = false
export default handler