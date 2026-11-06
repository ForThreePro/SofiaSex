import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, text, command, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
  const footer = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n${txt}` + footer }, { quoted: m })

  if (!isAdmin && !isOwner) { await react('🍫'); return reply(`─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Solo admins del sistema`) }

  if (['resetlink','revokelink'].includes(command)) {
    try {
      await react('🍫')
      await conn.groupRevokeInvite(m.chat)
      let code = await conn.groupInviteCode(m.chat)
      await react('🍫')
      return reply(`─── ꒰🍨꒱ LINK ───\n\n꒰🍫꒱ Nuevo link del grupo\n꒰🍨꒱ https://chat.whatsapp.com/${code}`)
    } catch { await react('🍫'); return reply(`─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Necesito ser admin`) }
  }

  if (['setname','setgroupname'].includes(command)) {
    if (!text) { await react('🍫'); return reply(`─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Usa: *${usedPrefix}setname Nuevo nombre*`) }
    try { await react('🍫'); await conn.groupUpdateSubject(m.chat, text); await react('🍫'); return reply(`─── ꒰🍨꒱ NOMBRE ───\n\n꒰🍫꒱ Nombre cambiado a: *${text}*`) }
    catch { await react('🍫'); return reply(`─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error al cambiar nombre`) }
  }

  if (['setdesc','setgroupdesc'].includes(command)) {
    if (!text) { await react('🍫'); return reply(`─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Usa: *${usedPrefix}setdesc Nueva descripción*`) }
    try { await react('🍫'); await conn.groupUpdateDescription(m.chat, text); await react('🍫'); return reply(`─── ꒰🍨꒱ DESCRIPCIÓN ───\n\n꒰💗꒱ Descripción actualizada`) }
    catch { await react('🍫'); return reply(`─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error al cambiar descripción`) }
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
      } else { await react('🍫'); return reply(`─── ꒰🍨꒱ USO ───\n\n꒰🍪꒱ Responde a una imagen o pasa un link`) }
      await react('🍫')
      return reply(`─── ꒰🍨꒱ FOTO ───\n\n꒰🍫꒱ Foto del grupo actualizada`)
    } catch { await react('🍫'); return reply(`─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Error al actualizar foto`) }
  }
}

handler.help = ['resetlink','setname','setdesc','setfoto']
handler.tags = ['grupos']
handler.command = ['resetlink','revokelink','setname','setgroupname','setdesc','setgroupdesc','setfoto','setppgroup','setppgc']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler