import axios from 'axios'
import FormData from 'form-data'
import moment from 'moment-timezone'
moment.locale('es')

async function stellarUpscale(buffer, scale, key) {
  let form = new FormData()
  form.append('file', buffer, { filename: `upscale-${scale}.jpg`, contentType: 'image/jpeg' })
  let url = `https://api.stellarwa.xyz/tools/upscale?method=local&scale=${scale}&key=${key}`

  let { data, headers } = await axios.post(url, form, {
    headers: form.getHeaders(),
    responseType: 'arraybuffer',
    timeout: 180000
  })

  // Si devuelve JSON con URL
  let str = data.toString('utf8').slice(0, 500)
  if (str.trim().startsWith('{')) {
    try {
      let json = JSON.parse(data.toString())
      let resultUrl = json.result || json.data || json.url
      if (resultUrl) {
        let img = await axios.get(resultUrl, { responseType: 'arraybuffer' })
        return Buffer.from(img.data)
      }
    } catch {}
  }
  return Buffer.from(data)
}

let handler = async (m, { conn, usedPrefix }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/image/.test(mime)) {
    return conn.reply(m.chat, head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍨꒱ Responde a una imagen con *${usedPrefix}hd*\n\n꒰🍫꒱ Hará: x2 y luego automático a x4` + foot, m)
  }

  let key = 'proyectsV2'

  try {
    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })
    let media = await q.download()

    // Si la imagen ya es pesada, solo 1 paso para no dar timeout
    let isHeavy = media.length > 2500000
    let statusMsg = await conn.sendMessage(m.chat, { text: head + `\n─── ꒰🍨꒱ ${isHeavy ? 'PASO 1/1' : 'PASO 1/2'} ───\n\n꒰🍫꒱ ${isHeavy ? 'Imagen pesada, hago solo 1 paso x2 para no tardar...' : 'Mejorando a x2...'}` + foot }, { quoted: m })

    // PASO 1: x2
    let firstHD = await stellarUpscale(media, 2, key)

    let finalHD = firstHD
    if (!isHeavy) {
      // PASO 2: x2 de nuevo = x4 total - edita el mismo mensaje
      try {
        await conn.sendMessage(m.chat, { text: head + `\n─── ꒰🍨꒱ PASO 2/2 ───\n\n꒰🍫꒱ Mejorando a x4 automático...` + foot, edit: statusMsg.key })
      } catch {}
      finalHD = await stellarUpscale(firstHD, 2, key)
    }

    await conn.sendFile(m.chat, finalHD, isHeavy ? 'hd-x2.jpg' : 'hd-x4.jpg', 
head + `\n─── ꒰🍨꒱ COMPLETADO ───\n\n꒰🍫꒱ *${isHeavy ? 'HD x2 completado' : 'HD x4 completado'}* ꒰💗꒱\n\n꒰🍨꒱ ${isHeavy ? '1 paso x2 - imagen pesada' : 'x2 → x4 automático'}\n꒰🍪꒱ Stellar API` + foot, m)

    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })
    conn.reply(m.chat, head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error: ${e.message}` + foot, m)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'upscale', 'mejorar', 'remini']
export default handler