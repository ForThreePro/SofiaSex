import { sticker } from '../lib/sticker.js'
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

const fetchStickerVideo = async (text) => {
  const { data } = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, { params: { text }, responseType: 'arraybuffer' })
  if (!data) throw new Error('API sin respuesta')
  return data
}

const handler = async (m, { conn, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  text = m.quoted?.text || text
  if (!text) {
    await react('🍫')
    return conn.reply(m.chat, head + `\n꒰🍨꒱ Usa: *.bratv Tu texto*` + foot, m)
  }
  try {
    await react('🍫')
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker || 'CUPID DOLLS'
    let texto2 = packstickers.text2 || global.packsticker2 || 'DULCE EDITION 💗'

    const videoBuffer = await fetchStickerVideo(text)
    const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
    await react('🍫')
  } catch (e) {
    await react('🍫')
    await conn.reply(m.chat, head + `\n꒰🍪꒱ Error al generar sticker` + foot, m)
  }
}

handler.tags = ['sticker']
handler.help = ['bratv <texto>']
handler.command = ['bratv']
export default handler