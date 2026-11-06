import { webp2mp4 } from '../lib/webp2mp4.js'
import { toAudio } from '../lib/converter.js'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted || !/webp/.test(m.quoted.mimetype || '')) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Responde a un *sticker*` + foot, m)
    }
    try {
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍫꒱ Convirtiendo tu sticker a video...\n꒰🍨꒱ Espera un momento` + foot, m)
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await react('🍫')
      await conn.sendFile(m.chat, out, 'video.mp4', head + `\n─── ꒰🍨꒱ CONVERTIDO ───\n\n꒰🍫꒱ *Sticker a video completado*` + foot, m)
    } catch { await react('🍫'); await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ No se pudo convertir` + foot, m) }
  }

  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) { await react('🍫'); return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Responde a un *video o audio*` + foot, m) }
    try {
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍫꒱ Extrayendo tu audio...\n꒰🍨꒱ Espera un momento` + foot, m)
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await react('🍫')
      await conn.sendFile(m.chat, audio.data, 'audio.mp3', head + `\n─── ꒰🍨꒱ CONVERTIDO ───\n\n꒰🍫꒱ *Audio extraído*` + foot, m, null, { mimetype: 'audio/mp4' })
    } catch { await react('🍫'); await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ No se pudo convertir a audio` + foot, m) }
  }

  if (['toimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    if (!((q.mimetype || '').includes('webp'))) { await react('🍫'); return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Responde a un *sticker*` + foot, m) }
    try {
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍫꒱ Convirtiendo tu sticker a imagen...\n꒰🍨꒱ Espera un momento` + foot, m)
      let media = await q.download()
      await react('🍫')
      await conn.sendMessage(m.chat, { image: media, caption: head + `\n─── ꒰🍨꒱ CONVERTIDO ───\n\n꒰🍫꒱ *Sticker a imagen*` + foot }, { quoted: m })
    } catch { await react('🍫'); await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ No se pudo convertir` + foot, m) }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler