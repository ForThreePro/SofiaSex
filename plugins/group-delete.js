import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  if (!m.quoted) {
    await react('🍫')
    let error = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ELIMINAR MENSAJE ───
꒰꒱ ${fecha}

꒰🍫꒱ Responde al mensaje que deseas eliminar
꒰🍨꒱ Cupid dice: responde al mensaje

꒰🍪꒱ Ejemplo:
꒰💗꒱ Responde a un mensaje + .del
꒰🍫꒱ Responde a un mensaje + .delete` + foot
    return conn.sendMessage(m.chat, { text: error }, { quoted: m })
  }

  await react('🍫')

  try {
    let delet = m.message.extendedTextMessage.contextInfo.participant
    let bang = m.message.extendedTextMessage.contextInfo.stanzaId
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
  } catch {
    await conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
  }

  let ok = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ELIMINADO MENSAJE ───
꒰꒱ ${fecha}

꒰🍫꒱ Mensaje eliminado
꒰🍨꒱ Por: @${m.sender.split('@')[0]}
꒰🍪꒱ Cupid lo borró` + foot
  conn.sendMessage(m.chat, { text: ok, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['del','delete']
handler.tags = ['grupo']
handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler