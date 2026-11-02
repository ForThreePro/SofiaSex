import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 IGDL ───\nFecha: ${fecha}\n\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim()
  if (!url.includes('instagram.com')) {
    return conn.reply(m.chat, head + `🍫 Usa: ${usedPrefix+command} https://www.instagram.com/reel/DeQKKA8pJ0e/\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
  }

  try {
    await react('🍫')

    let json = null
    for (let i = 0; i < 3; i++) {
      try {
        let api = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(url)}`
        let res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 })
        json = await res.json()
        if (json?.result?.url || json?.result?.length) break
      } catch (e) {
        console.log(`Intento ${i+1} fail:`, e.message)
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    if (!json) throw new Error('API no respondió, intenta de nuevo en 5s')

    console.log(json)

    let result = json.result || json.data || json
    let urls = result.url || result.urls || result.download || []
    if (!Array.isArray(urls)) urls = [urls]

    let captionMeta = result.metadata?.caption || ''
    let likes = result.metadata?.like || ''

    urls = urls.map(u => typeof u === 'string'? u : u?.url).filter(v => typeof v === 'string' && v.startsWith('http'))

    if (!urls.length) throw new Error('Sin links: ' + JSON.stringify(json).slice(0,600))

    // 1 SOLO MENSAJE - solo el primer archivo
    let dl = urls[0]
    let caption = head + `🍫 IGDL\n🍨 Likes: ${likes || '?'}\n🍪 Caption: ${captionMeta.slice(0,100) || 'Sin caption'}\n💗 Link: ${url}\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`

    await conn.sendFile(m.chat, dl, 'ig.mp4', caption, m)

    await react('🍫')

  } catch (e) {
    console.error(e)
    await react('🍫')
    conn.reply(m.chat, head + `🍫 Error IG: ${e.message}\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
  }
}

handler.help = ['ig <url>']
handler.tags = ['descargas']
handler.command = ['igdl','ig','instagram','igreel']
export default handler