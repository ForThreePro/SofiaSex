import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  let stickdados = [
    'https://tinyurl.com/gdd01',
    'https://tinyurl.com/gdd02',
    'https://tinyurl.com/gdd003',
    'https://tinyurl.com/gdd004',
    'https://tinyurl.com/gdd05',
    'https://tinyurl.com/gdd006'
  ]

  let url = stickdados[Math.floor(Math.random() * stickdados.length)]

  await react('🎲')

  let caption = `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⤷ ┇ 𝐃𝐀𝐃𝐎 ﹒ RANDOM ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🎲 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ ❄️
🎲 ➛ Tiraste el dado
🍀 ➛ Que la suerte te acompañe

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`

  await conn.sendFile(m.chat, url, 'dado.webp', caption, m, { asSticker: true })
  await react('✅')
}

handler.help = ['dado'];
handler.tags = ['sticker'];
handler.command = ['dado', 'dados', 'dadu'];
export default handler;