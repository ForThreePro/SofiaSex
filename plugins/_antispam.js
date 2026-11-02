const userSpamData = {}

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return global.dfail('owner', m, conn)
  let bot = global.db.data.settings[conn.user.jid] || {}

  if (/on/i.test(args[0])) {
    bot.antiSpam = true
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTISPAM ON ───

🍫 Anti-Spam: Activado
🍨 Solo filtra Stickers y Emojis

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
  } else if (/off/i.test(args[0])) {
    bot.antiSpam = false
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTISPAM OFF ───

🍫 Anti-Spam: Desactivado
🍨 Stickers y emojis permitidos

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
  } else {
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTISPAM ───

🍫 Uso: .antispam on / off

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
  }
}

handler.help = ['antispam on/off']
handler.tags = ['config']
handler.command = /^(antispam)$/i

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}

  if (!bot.antiSpam || m.fromMe) return

  const sender = m.sender
  const currentTime = Date.now()
  const timeWindow = 6000 
  const warnLimit = 4 
  const kickLimit = 6 

  const isEmojiOnly = m.text ? /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier}|\p{Emoji_Component})+$/u.test(m.text.trim()) : false
  const isSticker = m.mtype === 'stickerMessage'

  if (!isSticker && !isEmojiOnly) return 

  if (!userSpamData[sender] || (currentTime - userSpamData[sender].startTime > timeWindow)) {
    userSpamData[sender] = { 
      startTime: currentTime, 
      messageCount: 1 
    }
  } else {
    userSpamData[sender].messageCount++
  }

  const count = userSpamData[sender].messageCount

  if (isOwner || isROwner) {
    if (count === warnLimit) {
      await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Hey creadora, tranquila... No satures con tanto sticker/emoji`, m)
    }
    return 
  }

  if (m.isGroup && (isAdmin || isPrems || !isBotAdmin)) return  

  if (count === warnLimit) {
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 SPAM ───\n\n🍫 @${sender.split('@')[0]}, corta el spam de stickers/emojis\n🍨 (${count}/${kickLimit})\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m, { mentions: [sender] })
  } 
  else if (count >= kickLimit) {
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 SPAM ───\n\n🍫 @${sender.split('@')[0]} fue eliminada por flood de stickers/emojis\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m, { mentions: [sender] })
    if (m.isGroup) {
      await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
    }
    delete userSpamData[sender]
  }
}

export default handler