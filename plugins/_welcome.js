import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  if (!isAdmin && !isOwner) return

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    return conn.sendMessage(m.chat, { text: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Bienvenida activada - Cupid despertó\nFecha: ${fecha}\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907` }, { quoted: m })
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    return conn.sendMessage(m.chat, { text: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Bienvenida desactivada - Cupid a dormir\nFecha: ${fecha}\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907` }, { quoted: m })
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['configuración']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0
  const chat = global.db?.data?.chats?.[m.chat]
  if (!chat || !chat.bienvenida) return !0

  const userJid = m.messageStubParameters?.[0] || m.participant
  if (!userJid) return !0

  // TU FOTO POR DEFECTO
  const DEFAULT_IMG = 'https://files.evogb.win/yoMAez.jpg'
  let imgBuffer = null
  try {
    let userPP = await conn.profilePictureUrl(userJid, 'image')
    let res = await fetch(userPP)
    imgBuffer = await res.buffer()
  } catch {
    try {
      let res = await fetch(DEFAULT_IMG)
      imgBuffer = await res.buffer()
    } catch {}
  }

  const userTag = `@${userJid.split('@')[0]}`
  const groupName = groupMetadata.subject
  const groupDesc = groupMetadata.desc || 'Sin descripción'
  const membersCount = groupMetadata.participants.length

  let txt = '', audio = null

  switch (m.messageStubType) {
    case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      audio = chat.audiowelcome
      txt = chat.customWelcome ? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 BIENVENIDO ───

🍫 ${userTag} apareció en *${groupName}*
🍨 Miembro N°: *${membersCount}*
🍪 Cupid dice: bienvenido a Cupid Dolls

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
      audio = chat.audiobye
      txt = chat.customBye ? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESPEDIDA ───

🍫 ${userTag} desapareció de *${groupName}*
🍨 Cupid: "Uno menos en Cupid"

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      break
    case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
      audio = chat.audiokick
      txt = chat.customKick ? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 EXPULSADO ───

🍫 ${userTag} fue eliminado de *${groupName}*
🍨 Cupid: "Fuera de Cupid"

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      break
  }

  if (txt) {
    // 1 SOLO MENSAJE - imagen + texto juntos
    if (imgBuffer) {
      await conn.sendMessage(m.chat, { image: imgBuffer, caption: txt, mentions: [userJid] })
    } else {
      await conn.sendMessage(m.chat, { text: txt, mentions: [userJid] })
    }

    // Audio solo si está configurado con .audiowelcome / .audiobye / .audiokick
    // Si no hay audio configurado, queda en 1 solo mensaje
    if (audio) {
      try {
        let audioBuffer = typeof audio === 'string' ? Buffer.from(audio, 'base64') : audio
        await conn.sendMessage(m.chat, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false
        })
      } catch (e) {
        console.log('Error audio:', e)
      }
    }
  }
  return !0
}

export default handler