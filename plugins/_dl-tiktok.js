import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

var handler = async (m, { conn, args }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const ownerNum = '528621029907'

  if (!args[0]) {
    let menuUso = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TIKTOK ───
Fecha: ${fecha}

🍫 Descarga videos de TikTok sin marca de agua
🍨 Uso: .tiktok <link de tiktok>

🍫 Ejemplo:
🍨 https://vm.tiktok.com/ZMkcmTCa6/

🍪 Soporte:
💗 vm.tiktok.com
🍫 vt.tiktok.com
🍨 www.tiktok.com

─── 💗 CONTACTO ───
Número: +52 862 102 9907
Owner: @${ownerNum}`
    return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
  }

  const url = args[0]
  if (!url.match(/(https?:\/\/)?(www\.)?(vm\.|vt\.|www\.)?tiktok\.com\//)) {
    await react(conn, m, '🍫')
    let menuError = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR TIKTOK ───
Fecha: ${fecha}

🍫 El enlace no es válido
🍨 Eso no es TikTok

🍪 Uso: Solo links de tiktok.com

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
    return conn.sendMessage(m.chat, { text: menuError }, { quoted: m })
  }

  try {
    await react(conn, m, "🍫")

    const tiktokData = await tiktokdl(url)
    if (!tiktokData?.data) throw new Error('No se pudo obtener el video.')

    const videoURL = tiktokData.data.play
    const title = tiktokData.data.title || 'Sin título'
    const author = tiktokData.data.author?.nickname || 'Desconocido'
    const likes = formatNum(tiktokData.data.digg_count)
    const comments = formatNum(tiktokData.data.comment_count)

    let caption = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TIKTOK ───
Fecha: ${fecha}

🍫 Título: ${title}
🍨 Autor: @${author}
🍪 Likes: ${likes}
💗 Comentarios: ${comments}
🍫 Link: ${url}

🍨 Video sin marca de agua
🍪 Listo para ver

─── 💗 CONTACTO ───
Número: +52 862 102 9907`

    await conn.sendMessage(m.chat, { video: { url: videoURL }, mimetype: 'video/mp4', fileName: 'tiktok.mp4', caption: caption }, { quoted: m })
    await react(conn, m, "🍫")

  } catch (error) {
    await react(conn, m, "🍫")
    const fecha2 = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let menuErr = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR TIKTOK ───
Fecha: ${fecha2}

🍫 ${error.message}
🍨 Verifica que el video sea público
🍪 Intenta con otro link

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
    return conn.sendMessage(m.chat, { text: menuErr }, { quoted: m })
  }
}

async function tiktokdl(url) {
  const tikwm = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
  return await (await fetch(tikwm, { signal: AbortSignal.timeout(20000) })).json()
}

const formatNum = (n) => {
  n = Number(n)
  if (!n) return "0"
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

handler.help = ['tiktok <link>']
handler.tags = ['descargas']
handler.command = ['tt', 'tiktok']
handler.limit = true
export default handler