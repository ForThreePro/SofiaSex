import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  let q = m.quoted ? m.quoted : m
  let txt = text || q.text || q.caption || ''
  if (!txt) {
    await react('🍫')
    return m.reply(head + `\n─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Usa: *${usedPrefix}${command} Tu texto*` + foot, m)
  }

  let tmpInput = ''
  let tmpOutput = ''
  try {
    await react('🍫')
    await m.reply(head + `\n─── ꒰🍨꒱ GENERANDO ───\n\n꒰🍫꒱ Generando tu sticker Brat...\n꒰🍨꒱ Espera un momento` + foot, m)
    txt = txt.slice(0, 60)
    let apiUrl = `https://api.stellarwa.xyz/tools/brat?text=${encodeURIComponent(txt)}&key=proyectsV2`
    let res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API ${res.status}`)
    let inputBuffer = await res.buffer()

    tmpInput = path.join(tmpdir(), `brat-${Date.now()}.gif`)
    tmpOutput = path.join(tmpdir(), `brat-${Date.now()}.webp`)
    fs.writeFileSync(tmpInput, inputBuffer)

    await new Promise((resolve, reject) => {
      ffmpeg(tmpInput).frames(1).size('512x512').aspect('1:1').autopad()
        .outputOptions('-vcodec','libwebp','-lossless','0','-q:v','50','-preset','picture','-an','-vsync','0')
        .toFormat('webp').on('end',resolve).on('error',reject).save(tmpOutput)
    })

    let stickerBuffer = fs.readFileSync(tmpOutput)
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
    try { fs.unlinkSync(tmpInput); fs.unlinkSync(tmpOutput) } catch {}
    await react('🍫')
  } catch (e) {
    try { if (tmpInput && fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput) } catch {}
    try { if (tmpOutput && fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput) } catch {}
    await react('🍫')
    await m.reply(head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error al generar sticker: ${e.message}` + foot, m)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i
export default handler