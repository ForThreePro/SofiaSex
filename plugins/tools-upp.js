import fetch from 'node-fetch'
import FormData from 'form-data'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  const getLink = (data) => {
    if (!data) return null
    if (typeof data === 'string') return data.startsWith('http') ? data : null
    return data.url || data.link || data.result?.url || data.data?.url || data.data?.link || data.result || null
  }

  const getLinkById = async (id) => {
    try {
      let r = await fetch(`https://evogb.win/api/metadata/${id}`)
      let j = await r.json()
      return getLink(j) || j.url || j.file || j.data?.url || null
    } catch { return null }
  }

  const sendPreview = async (link, id, mime = '') => {
    if (!link && id) link = await getLinkById(id)
    if (!link) return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ SUBIDO ───\n\n꒰🍪꒱ Se subió pero no me dio link\n꒰🍨꒱ ID: ${id || '?'}` + foot, m)
    let caption = head + `\n─── ꒰🍨꒱ SUBIDO ───\n\n꒰🍫꒱ *Subido con éxito*\n\n꒰🍨꒱ Link: ${link}\n꒰🍫꒱ ID: ${id || '—'}` + foot
    try {
      if (mime.startsWith('video')) {
        await conn.sendMessage(m.chat, { video: { url: link }, caption }, { quoted: m })
      } else if (mime.startsWith('audio')) {
        await conn.sendMessage(m.chat, { audio: { url: link }, mimetype: mime, caption }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, { image: { url: link }, caption }, { quoted: m })
      }
    } catch {
      await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ SUBIDO ───\n\n꒰🍫꒱ *Subido con éxito*\n\n꒰🍨꒱ Link: ${link}` + foot, m)
    }
  }

  // ============ .tourl https://... ============
  if (command === 'tourl') {
    let urlMatch = (text || '').match(/https?:\/\/[^\s]+/i)
    if (!urlMatch) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍨꒱ Usa: *${usedPrefix}tourl https://tu-imagen.jpg*` + foot, m)
    }
    try {
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍫꒱ Subiendo tu link...\n꒰🍨꒱ Espera un momento` + foot, m)
      let url = urlMatch[0]
      // Adivinar tipo por extensión para la vista previa
      let mimeGuess = /\.mp4|\.mov|\.mkv/i.test(url) ? 'video/mp4' : /\.mp3|\.ogg|\.wav|\.m4a/i.test(url) ? 'audio/mpeg' : 'image/jpeg'
      let res = await fetch('https://evogb.win/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, author: 'ConsoleUser' })
      })
      let data = await res.json()
      console.log(data)
      await sendPreview(getLink(data), data.id || data.data?.id, mimeGuess)
      await react('🍫')
    } catch (e) {
      await react('🍫')
      await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error: ${e.message}` + foot, m)
    }
    return
  }

  // ============ .upp responde a archivo ============
  if (command === 'upp') {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''
    if (!mime) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍨꒱ Responde a una imagen / video / archivo con *${usedPrefix}upp*` + foot, m)
    }
    try {
      await react('🍫')
      let media = await q.download()
      let ext = mime.split('/')[1]?.split(';')[0] || 'jpg'
      let form = new FormData()
      form.append('file', media, { filename: `cupid-${Date.now()}.${ext}`, contentType: mime })
      form.append('author', 'ConsoleUser')

      let res = await fetch('https://evogb.win/api/upload', {
        method: 'POST',
        headers: form.getHeaders(),
        body: form
      })
      let data = await res.json()
      console.log(data)
      await sendPreview(getLink(data), data.id || data.data?.id, mime)
      await react('🍫')
    } catch (e) {
      console.error(e)
      await react('🍫')
      await conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error: ${e.message}` + foot, m)
    }
    return
  }
}

handler.help = ['upp', 'tourl <url>']
handler.tags = ['tools']
handler.command = /^(upp|tourl)$/i
export default handler