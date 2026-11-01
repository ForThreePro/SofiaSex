import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import FormDataNode from "form-data"
import { fileTypeFromBuffer } from "file-type"
import fetch from 'node-fetch'
import axios from 'axios'

const STELLAR_KEY = 'proyectsV2'

async function myCloud(content) {
  const ft = await fileTypeFromBuffer(content)
  const form = new FormData()
  form.append("file", new Blob([content], { type: ft?.mime || 'image/jpeg' }), `${crypto.randomBytes(5).toString("hex")}.${ft?.ext || 'jpg'}`)
  const r = await fetch("https://evogb.win/api/upload", { method: "POST", body: form })
  const j = await r.json()
  return j.url || j.data?.url
}

async function stellarUpscale(buffer, scale) {
  let form = new FormDataNode()
  form.append('file', buffer, { filename: `upscale-${scale}.jpg`, contentType: 'image/jpeg' })
  let url = `https://api.stellarwa.xyz/tools/upscale?method=local&scale=${scale}&key=${STELLAR_KEY}`
  let { data } = await axios.post(url, form, {
    headers: form.getHeaders(),
    responseType: 'arraybuffer',
    timeout: 120000
  })
  let str = Buffer.from(data).toString('utf8').slice(0, 500)
  if (str.trim().startsWith('{')) {
    try {
      let json = JSON.parse(Buffer.from(data).toString())
      let resultUrl = json.result || json.data || json.url
      if (resultUrl) {
        let img = await axios.get(resultUrl, { responseType: 'arraybuffer' })
        return Buffer.from(img.data)
      }
    } catch {}
  }
  return Buffer.from(data)
}

// ===== REMOVEBG STELLAR - POR ARCHIVO, NO POR URL =====
async function stellarRemovebg(buffer) {
  // Intento 1: POST con archivo method=local (el correcto para Stellar)
  try {
    let form = new FormDataNode()
    form.append('file', buffer, { filename: `removebg.jpg`, contentType: 'image/jpeg' })
    let { data, headers } = await axios.post(
      `https://api.stellarwa.xyz/tools/removebg?method=local&key=${STELLAR_KEY}`,
      form,
      { headers: form.getHeaders(), responseType: 'arraybuffer', timeout: 120000, maxContentLength: Infinity, maxBodyLength: Infinity }
    )
    return parseStellarResult(data, headers)
  } catch (e1) {
    console.log('Removebg POST falló, intentando GET url:', e1.message)
  }

  // Intento 2: Fallback GET con url (por si Stellar lo soporta con method=url)
  let linkTmp = await myCloud(buffer)
  const apiUrl = `https://api.stellarwa.xyz/tools/removebg?method=url&url=${encodeURIComponent(linkTmp)}&key=${STELLAR_KEY}`
  const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } })
  return parseStellarResult(data, {})
}

async function parseStellarResult(data, headers = {}) {
  const ct = headers['content-type'] || ''
  // Si es imagen directa
  if (ct.includes('image') || !Buffer.from(data).toString('utf8').slice(0, 200).trim().startsWith('{')) {
    // Verificar que no sea JSON disfrazado
    try {
      const txt = Buffer.from(data).toString('utf8')
      if (txt.trim().startsWith('{')) throw new Error('es json')
      return Buffer.from(data)
    } catch {}
  }
  // Si es JSON
  const j = JSON.parse(Buffer.from(data).toString())
  let resultData = j.result?.url || j.result?.image || j.result?.data || j.result || j.url || j.data || j.image
  if (typeof resultData === 'object') resultData = resultData.url || resultData.image || resultData.data
  if (!resultData) throw new Error('API vacía: ' + JSON.stringify(j).slice(0, 200))
  const str = String(resultData).trim()
  if (str.startsWith('http')) {
    const { data: img } = await axios.get(str, { responseType: 'arraybuffer', timeout: 120000 })
    return Buffer.from(img.data)
  } else if (str.startsWith('data:image')) {
    return Buffer.from(str.split(',')[1], 'base64')
  } else {
    return Buffer.from(str, 'base64')
  }
}

let handler = async (m, { conn, text }) => {
  let link = text?.trim()
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  let media = null
  if (link && /^https?:\/\//i.test(link)) {
    try {
      const { data } = await axios.get(link, { responseType: 'arraybuffer' })
      media = Buffer.from(data)
    } catch {}
  } else if (/image/.test(mime)) {
    media = await q.download()
    link = null
  }

  if (!media && !link) {
    await conn.sendMessage(m.chat, { react: { text: '❄️', key: m.key } })
    return conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n꒰❄️꒱ Responde a una imagen o manda link\n\n❄️ Ejemplo: *.removebg*\n❄️ Ejemplo: *.removebg https://link.jpg*\n\nPasos: 1️⃣ Sube a Evogb → 2️⃣ HD x2 → x4 → 3️⃣ Quita fondo` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    await conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n1️⃣ *PASO 1/3:* Subiendo original a Evogb...` }, { quoted: m })
    let linkOriginal = link
    if (!linkOriginal) linkOriginal = await myCloud(media)
    if (!linkOriginal) throw new Error('No se pudo subir original a Evogb')

    await conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n2️⃣ *PASO 2/3:* Mejorando HD x2...` }, { quoted: m })
    let hdX2 = await stellarUpscale(media, 2)
    await conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n2️⃣ *PASO 2/3:* Mejorando HD x4 automático...` }, { quoted: m })
    let hdX4 = await stellarUpscale(hdX2, 2)
    let linkHD = await myCloud(hdX4)

    await conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n3️⃣ *PASO 3/3:* Quitando fondo (POST archivo)...` }, { quoted: m })
    // CAMBIO CLAVE: le pasamos el BUFFER, no la URL
    let finalBuffer = await stellarRemovebg(hdX4)

    let linkFinal = await myCloud(finalBuffer).catch(() => null)

    const caption = `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

╭───INFO ꒰❄️꒱────╮
❄️ Tipo: Removebg + HD x4
❄️ API: Stellar
❄️ Peso final: ${(finalBuffer.length / 1024).toFixed(0)} KB
╰─────── ݁ ˖Ი𐑼⋆────╯

🔗 *Original:* ${linkOriginal}
🔗 *HD x4:* ${linkHD || 'No se pudo subir'}
🔗 *Sin fondo:* ${linkFinal || 'No se pudo subir'}

꒰❄️꒱ Fondo eliminado - listo`

    await conn.sendMessage(m.chat, { react: { text: '❄️', key: m.key } })
    await conn.sendMessage(m.chat, { image: finalBuffer, caption }, { quoted: m })
    await conn.sendMessage(m.chat, { document: finalBuffer, mimetype: 'image/png', fileName: `removebg-hd-phantom-frost.png` }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    return conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n꒰❌꒱ Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['removebg', 'nobg', 'quitarfondo']
handler.tags = ['tools']
handler.help = ['removebg']
handler.group = true
export default handler