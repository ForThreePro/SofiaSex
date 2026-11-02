import fetch from 'node-fetch'
import axios from 'axios'
import yts from 'yt-search'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, command, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!text) return conn.reply(m.chat, 
`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ${command.toUpperCase()} ───
Fecha: ${fecha}

🍫 Ejemplo:
🍨 .play diles - bad bunny
🍪 .play2 diles - video
💗 .play3 diles - video nota

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })

    let link = text
    let info = null
    if (!/^https?:\/\//.test(text)) {
      const s = await yts(text)
      if (!s.videos.length) throw new Error('No se encontró nada')
      info = s.videos[0]
      link = info.url
    }

    const isAudio = command === 'play'
    const apiUrl = isAudio
      ? `https://api-faa.my.id/faa/ytmp3?url=${encodeURIComponent(link)}`
      : `https://api-faa.my.id/faa/ytmp4?url=${encodeURIComponent(link)}`

    const j = await fetch(apiUrl).then(r => r.json())
    if (!j.status || !j.result) throw new Error('API caída')

    const downloadUrl = isAudio ? j.result.mp3 : j.result.download_url
    const title = (j.result.title || info?.title || 'cupid').replace(/[^\w\s-]/gi, '').trim()

    const res = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(res.data)
    const size = (buffer.length / 1024 / 1024).toFixed(2)
    const type = isAudio ? 'AUDIO' : 'VIDEO'

    const caption = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESCARGA ${type} ───
Fecha: ${fecha}

🍫 Título: ${title}
${info ? `🍨 Canal: ${info.author.name}\n🍪 Duración: ${info.timestamp}\n💗 Vistas: ${info.views.toLocaleString()}\n` : ''}🍫 Peso: ${size} MB
🍨 API: FAA-BOT
🍪 Estado: Listo

─── 💗 CONTACTO ───
Número: +52 862 102 9907`.trim()

    if (command === 'play') {
      return conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3`, caption: caption }, { quoted: m })
    }

    if (command === 'play2') {
      return conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: caption }, { quoted: m })
    }

    if (command === 'play3') {
      return conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: caption, ptv: true }, { quoted: m })
    }

  } catch (e) {
    console.log(e)
    return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 ERROR ───\n\n🍫 ${e.message}\n🍨 No se encontró la canción\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
  }
}

handler.help = ['play <texto>', 'play2 <texto>', 'play3 <texto>']
handler.tags = ['descargas']
handler.command = ['play', 'play2', 'play3']
export default handler