import moment from 'moment-timezone'
moment.locale('es')

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
    const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!mentionedJid) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰🍨꒱ Menciona o responde a un usuario\n꒰🍪꒱ Ej: *.mute @user*`+foot, m) 
    }

    if (participants.find(p=>p.id===mentionedJid)?.admin) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰🍪꒱ No puedes silenciar admins`+foot, m) 
    }
    if (mentionedJid===conn.user.jid) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰💗꒱ No puedo silenciarme`+foot, m) 
    }

    if (command==="mute") {
        if (mutedUsers.has(mentionedJid)) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰🍨꒱ Ya está silenciado`+foot, m) 
        }
        mutedUsers.add(mentionedJid); 
        await react('🍫')
        return conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ MUTE APLICADO ───
꒰꒱ ${fecha}

꒰🍫꒱ Silenciado en el sistema
꒰🍨꒱ Usuario: @${mentionedJid.split('@')[0]}
꒰🍪꒱ Estado: *Silenciado*`+foot, mentions:[mentionedJid] }, { quoted:m })
    } else {
        if (!mutedUsers.has(mentionedJid)) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰💗꒱ No está silenciado`+foot, m) 
        }
        mutedUsers.delete(mentionedJid); 
        await react('🍫')
        return conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ UNMUTE LIBERADO ───
꒰꒱ ${fecha}

꒰🍫꒱ Liberado del silencio
꒰🍨꒱ Usuario: @${mentionedJid.split('@')[0]}
꒰🍪꒱ Estado: *Liberado*`+foot, mentions:[mentionedJid] }, { quoted:m })
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) { try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {} }
}

handler.help = ['mute @user','unmute @user']
handler.tags = ['grupo']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler