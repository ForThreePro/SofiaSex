import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, text, command, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const footer = `\n\n꒰🍨꒱ falto estás cositas\n꒰🍫꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍪꒱ Número: +52 862 102 9907`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n${txt}` + footer }, { quoted: m })

  if (!isAdmin && !isOwner) { await react('🍫'); return reply(`꒰🍪꒱ Solo admins del sistema pe`) }

  if (['resetlink','revokelink'].includes(command)) {
    try {
      await react('🍫')
      await conn.groupRevokeInvite(m.chat)
      let code = await conn.groupInviteCode(m.chat)
      await react('🍫')
      return reply(`꒰🍨꒱ Nuevo link del grupo pe\n꒰🍫꒱ https://chat.whatsapp.com/${code}`)
    } catch { await react('🍫'); return reply(`꒰🍪꒱ Necesito ser admin pe`) }
  }

  if (['setname','setgroupname'].includes(command)) {
    if (!text) { await react('🍫'); return reply(`꒰🍨꒱ Usa: *${usedPrefix}setname Nuevo nombre* pe`) }
    try { await react('🍫'); await conn.groupUpdateSubject(m.chat, text); await react('🍫'); return reply(`꒰🍫꒱ Nombre cambiado a: *${text}* pe`) }
    catch { await react('🍫'); return reply(`꒰🍪꒱ Error al cambiar nombre pe`) }
  }

  if (['setdesc','setgroupdesc'].includes(command)) {
    if (!text) { await react('🍫'); return reply(`꒰🍨꒱ Usa: *${usedPrefix}setdesc Nueva descripción* pe`) }
    try { await react('🍫'); await conn.groupUpdateDescription(m.chat, text); await react('🍫'); return reply(`꒰💗꒱ Descripción actualizada pe`) }
    catch { await react('🍫'); return reply(`꒰🍪꒱ Error al cambiar descripción pe`) }
  }

  if (['setfoto','setppgroup','setppgc'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    try {
      await react('🍫')
      if (text && /https?:\/\//.test(text)) {
        await conn.updateProfilePicture(m.chat, { url: text })
      } else if (/image/.test(mime)) {
        let img = await q.download()
        await conn.updateProfilePicture(m.chat, img)
      } else { await react('🍫'); return reply(`꒰🍪꒱ Responde a una imagen o pasa un link pe`) }
      await react('🍫')
      return reply(`꒰🍫꒱ Foto del grupo actualizada pe`)
    } catch { await react('🍫'); return reply(`꒰🍪꒱ Error al actualizar foto pe`) }
  }
}

handler.help = ['resetlink','setname','setdesc','setfoto']
handler.tags = ['grupos']
handler.command = ['resetlink','revokelink','setname','setgroupname','setdesc','setgroupdesc','setfoto','setppgroup','setppgc']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler