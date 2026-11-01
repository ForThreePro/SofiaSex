const userSpamData = {}

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return global.dfail('owner', m, conn)
  let bot = global.db.data.settings[conn.user.jid] || {}

  if (/on/i.test(args[0])) {
    bot.antiSpam = true
    await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ ┇ 𝐀𝐍𝐓𝐈-𝐒𝐏𝐀𝐌 ﹒ 𝐎𝐍\n\n✅ ➛ Anti-Spam: *Activado*\n👻 ➛ Solo filtra Stickers y Emojis\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369\n━━━━━━━━━━━`, m)
  } else if (/off/i.test(args[0])) {
    bot.antiSpam = false
    await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ ┇ 𝐀𝐍𝐓𝐈-𝐒𝐏𝐀𝐌 ﹒ 𝐎𝐅𝐅\n\n❌ ➛ Anti-Spam: *Desactivado*\n🦂 ➛ Stickers y emojis permitidos\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369\n━━━━━━━━━━━`, m)
  } else {
    await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ ┇ 𝐀𝐍𝐓𝐈-𝐒𝐏𝐀𝐌 ﹒ 𝐔𝐒𝐎\n\n⚡ ➛ Uso: *.antispam on/off*\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369\n━━━━━━━━━━━`, m)
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
      await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ Hey creador, tranquilo... No satures con tanto sticker/emoji.`, m)
    }
    return 
  }

  if (m.isGroup && (isAdmin || isPrems || !isBotAdmin)) return  

  if (count === warnLimit) {
    await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⚡ *@${sender.split('@')[0]}*, ¡Corta el spam de stickers/emojis! (${count}/${kickLimit})\n\n⛓️ *PHANTOM IA - VENTAS* ⚡`, m, { mentions: [sender] })
  } 
  else if (count >= kickLimit) {
    await conn.reply(m.chat, `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n🚨 *@${sender.split('@')[0]}* fue eliminado por flood de stickers/emojis.\n\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369`, m, { mentions: [sender] })
    if (m.isGroup) {
      await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
    }
    delete userSpamData[sender]
  }
}

export default handler