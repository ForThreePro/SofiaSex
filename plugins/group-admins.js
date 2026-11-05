import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }
  const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

  if (!m.mentionedJid[0] && !m.quoted) {
    await react('🍫')
    let texto = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ADMINISTRACION PROMOTE ───
꒰꒱ ${fecha}

꒰🍫꒱ Uso:
꒰🍨꒱ Menciona a un usuario
꒰🍪꒱ Responde al mensaje del usuario
꒰💗꒱ Cupid: menciona

꒰🍪꒱ Ejemplos:
꒰🍫꒱ .promote @user
꒰🍨꒱ .demote @user

꒰🍫꒱ Aviso:
꒰💗꒱ Solo admins
꒰🍪꒱ Solo los del sistema` + foot
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin' ? 'promote' : 'demote'

  await react(action === 'promote' ? '🍫' : '🍪')

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], action)
  } catch {
    await react('🍫')
    let error = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ERROR ADMIN ───
꒰꒱ ${fecha}

꒰🍫꒱ No se pudo completar la acción
꒰🍨꒱ Verifica permisos del bot
꒰🍪꒱ Cupid dice: el bot no es admin` + foot
    return conn.sendMessage(m.chat, { text: error }, { quoted: m })
  }

  let msgAccion = action === 'promote'
? `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ PROMOVIDO NUEVO ADMIN ───
꒰꒱ ${fecha}

꒰🍫꒱ Nuevo Admin: @${user.split('@')[0]}
꒰🍨꒱ Por: @${m.sender.split('@')[0]}
꒰🍪꒱ Cupid aprobó al nuevo admin` + foot
    : `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ DEGRADADO QUITAR ADMIN ───
꒰꒱ ${fecha}

꒰🍫꒱ Ya no es Admin: @${user.split('@')[0]}
꒰🍨꒱ Por: @${m.sender.split('@')[0]}
꒰🍪꒱ Cupid le quitó el poder` + foot

  await conn.sendMessage(m.chat, { text: msgAccion, mentions: [user, m.sender] }, { quoted: m })
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupo']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler