import fetch from 'node-fetch'
import FormData from 'form-data'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n꒰🍨꒱ falto estás cositas\n꒰🍫꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍪꒱ Número: +52 862 102 9907`

  // Sacar link limpio de la respuesta de la API
  const getLink = (data) => {
    if (!data) return null
    if (typeof data === 'string') return data.startsWith('http') ? data : null
    return data.url || data.link || data.result?.url || data.data?.url || data.data?.link || data.result || null
  }

  // Si la API solo da un ID, pedir metadata para sacar la URL real
  const getLinkById = async (id) => {
    try {
      let r = await fetch(`https://evogb.win/api/metadata/${id}`)
      let j = await r.json()
      return getLink(j) || j.url || j.file || j.data?.url || null
    } catch { return null }
  }

  // Enviar preview + link
  const sendPreview = async (link, id) => {
    if (!link && id) link = await getLinkById(id)
    if (!link) return conn.reply(m.chat, head + `\n꒰🍪꒱ Se subió pe pero no me dio link, ID: ${id || '?'}` + foot, m)
    try {
      // Preview: manda la imagen subida como imagen
      await conn.sendMessage(m.chat, { image: { url: link }, caption: head + `\n꒰🍫꒱ *Subido pe:*\n\n${link}\n꒰🍨꒱ ID: ${id || 'no dio id pe'}` + foot }, { quoted: m })
    } catch {
      // Si no es imagen (video/archivo) manda solo el link
      await conn.reply(m.chat, head + `\n꒰🍫꒱ *Subido pe:*\n\n${link}` + foot, m)
    }
  }

  // ============ .tourl https://... ============
  if (command === 'tourl') {
    let urlMatch = (text || '').match(/https?:\/\/[^\s]+/i)
    if (!urlMatch) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n꒰🍨꒱ Usa pe: *${usedPrefix}tourl https://tu-imagen.jpg*` + foot, m)
    }
    try {
      await react('🍫')
      let res = await fetch('https://evogb.win/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlMatch[0], author: 'ConsoleUser' })
      })
      let data = await res.json()
      console.log(data)
      await sendPreview(getLink(data), data.id || data.data?.id)
      await react('🍫')
    } catch (e) {
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍪꒱ Error pe: ${e.message}` + foot, m)
    }
    return
  }

  // ============ .upp responde a archivo ============
  if (command === 'upp') {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''
    if (!mime) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n꒰🍨꒱ Responde a una imagen / video / archivo con *${usedPrefix}upp* pe` + foot, m)
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
      await sendPreview(getLink(data), data.id || data.data?.id)
      await react('🍫')
    } catch (e) {
      console.error(e)
      await react('🍫')
      await conn.reply(m.chat, head + `\n꒰🍪꒱ Error pe: ${e.message}` + foot, m)
    }
    return
  }
}

handler.help = ['upp', 'tourl <url>']
handler.tags = ['tools']
handler.command = /^(upp|tourl)$/i
export default handler