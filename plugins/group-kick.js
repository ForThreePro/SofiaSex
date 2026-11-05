import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }
    const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null

    if (!mentionedJid) {
        await react('🍫')
        let error = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ EXPULSAR USUARIO ───
꒰꒱ ${fecha}

꒰🍫꒱ Uso:
꒰🍨꒱ Menciona a un usuario
꒰🍪꒱ Responde al mensaje del usuario
꒰💗꒱ Cupid: apunta bien

꒰🍫꒱ Aviso:
꒰🍨꒱ Solo admins` + foot
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) {
            await react('🍫')
            return conn.sendMessage(m.chat, { text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n─── ꒰🍨꒱ ERROR KICK ───\n꒰꒱ ${fecha}\n\n꒰🍫꒱ No puedo expulsarme a mí mismo\n꒰🍨꒱ Cupid no se auto-banea` + foot }, { quoted: m })
        }
        if (mentionedJid === ownerGroup) {
            await react('🍫')
            return conn.sendMessage(m.chat, { text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n─── ꒰🍨꒱ ERROR KICK ───\n꒰꒱ ${fecha}\n\n꒰🍫꒱ No puedo expulsar al propietario del grupo` + foot }, { quoted: m })
        }
        if (mentionedJid === ownerBot) {
            await react('🍫')
            return conn.sendMessage(m.chat, { text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n─── ꒰🍨꒱ ERROR KICK ───\n꒰꒱ ${fecha}\n\n꒰🍫꒱ No puedo expulsar al dueño del bot` + foot }, { quoted: m })
        }
        if (isAdmin) {
            await react('🍫')
            return conn.sendMessage(m.chat, { text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n─── ꒰🍨꒱ ERROR KICK ───\n꒰꒱ ${fecha}\n\n꒰🍫꒱ No puedo expulsar a un administrador` + foot }, { quoted: m })
        }

        await react('🍫')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        let kickMsg = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ EXPULSADO USUARIO ───
꒰꒱ ${fecha}

꒰🍫꒱ Usuario: @${mentionedJid.split('@')[0]}
꒰🍨꒱ Por: @${m.sender.split('@')[0]}
꒰🍪꒱ Cupid le dio su patada dulce` + foot
        conn.sendMessage(m.chat, { text: kickMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    } catch (e) {
        await react('🍫')
        let error = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ERROR KICK ───
꒰꒱ ${fecha}

꒰🍫꒱ Se ha producido un problema
꒰🍨꒱ ${e.message}
꒰🍪꒱ Cupid falló` + foot
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler