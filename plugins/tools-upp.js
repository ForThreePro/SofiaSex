import fetch from 'node-fetch'
import FormData from 'form-data'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n꒰🍨꒱ falto estás cositas\n꒰🍫꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍪꒱ Número: +52 862 102 9907`

  // --- STATS: .tourl stats ---
  if (text?.toLowerCase().trim() === 'stats') {
    try {
      await react('🍫')
      let res = await fetch('https://evogb.win/api/stats')
      let data = await res.json()
      return conn.reply(m.chat, head + `\n꒰🍨꒱ *Stats evogb pe:*\n\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\`` + foot, m)
    } catch (e) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n꒰🍪꒱ Error pe: ${e.message}` + foot, m)
    }
  }

  // --- SUBIR POR URL: .tourl https://... ---
  let urlMatch = (text || '').match(/https?:\/\/[^\s]+/i)
  if (urlMatch) {
    try {
      await react('🍫')
      let res = await fetch('https://evogb.win/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlMatch[0],
          author: 'ConsoleUser'
        })
      })
      let data = await res.json()
      console.log(data)
      let link = data.url || data.data?.url || data.result?.url || data.link || JSON.stringify(data)
      return conn.reply(m.chat, head + `\n꒰🍫꒱ *Subido pe:*\n\n${link}` + foot, m)
    } catch (e) {
      await react('🍫')
      return conn.reply(m.chat, head + `\n꒰🍪꒱ Error pe: ${e.message}` + foot, m)
    }
  }

  // --- SUBIR ARCHIVO: responde a imagen/video/archivo ---
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mimetype || ''
  if (!mime) {
    await react('🍫')
    return conn.reply(m.chat, head + `\n꒰🍨꒱ Usa pe:\n*${usedPrefix}${command} https://tu-imagen.jpg*\nO responde a una imagen / video con *${usedPrefix}${command}*` + foot, m)
  }

  try {
    await react('🍫')
    let media = await q.download()
    let ext = mime.split('/')[1]?.split(';')[0] || 'jpg'
    let filename = `cupid-${Date.now()}.${ext}`

    let form = new FormData()
    form.append('file', media, { filename, contentType: mime })
    // si la API también acepta author en multipart
    form.append('author', 'ConsoleUser')

    let res = await fetch('https://evogb.win/api/upload', {
      method: 'POST',
      headers: form.getHeaders(),
      body: form
    })
    let data = await res.json()
    console.log(data)
    let link = data.url || data.data?.url || data.result?.url || data.link || data.id ? `https://evogb.win/api/metadata/${data.id || data.data?.id || ''}` : JSON.stringify(data)
    // si viene url directa la usamos, si no mostramos todo
    let finalLink = data.url || data.data?.url || data.result?.url || data.link || link

    await conn.reply(m.chat, head + `\n꒰🍫꒱ *Subido pe:*\n\n${finalLink}\n\n꒰🍨꒱ ID: ${data.id || data.data?.id || 'no dio id pe'}` + foot, m)
    await react('🍫')
  } catch (e) {
    console.error(e)
    await react('🍫')
    await conn.reply(m.chat, head + `\n꒰🍪꒱ Error pe: ${e.message}` + foot, m)
  }
}

handler.help = ['tourl <url / responde a archivo>', 'tourl stats']
handler.tags = ['tools']
handler.command = /^(tourl|upload|evogb|subir)$/i
export default handler