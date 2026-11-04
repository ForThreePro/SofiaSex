import moment from 'moment-timezone'
moment.locale('es')

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`

    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!mentionedJid) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰🍨꒱ Menciona o responde a un usuario pe\n꒰🍪꒱ Ej: *.mute @user*\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍫꒱ Número: +52 862 102 9907`, m) 
    }

    if (participants.find(p=>p.id===mentionedJid)?.admin) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰🍪꒱ No puedes silenciar admins pe\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍫꒱ Número: +52 862 102 9907`, m) 
    }
    if (mentionedJid===conn.user.jid) { 
        await react('🍫'); 
        return m.reply(head+`\n꒰💗꒱ No puedo silenciarme pe\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍫꒱ Número: +52 862 102 9907`, m) 
    }

    if (command==="mute") {
        if (mutedUsers.has(mentionedJid)) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰🍨꒱ Ya está silenciado pe\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍪꒱ Número: +52 862 102 9907`, m) 
        }
        mutedUsers.add(mentionedJid); 
        await react('🍫')
        return conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ MUTE APLICADO ───
꒰꒱ ${fecha}

꒰🍫꒱ Silenciado en el sistema pe
꒰🍨꒱ Usuario: @${mentionedJid.split('@')[0]}
꒰🍪꒱ Estado: *Silenciado*

꒰🍨꒱ falto estás cositas
꒰꒱

─── ꒰💗꒱ CONTACTO ───
꒰🍪꒱ Número: +52 862 102 9907`, mentions:[mentionedJid] }, { quoted:m })
    } else {
        if (!mutedUsers.has(mentionedJid)) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰💗꒱ No está silenciado pe\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍫꒱ Número: +52 862 102 9907`, m) 
        }
        mutedUsers.delete(mentionedJid); 
        await react('🍫')
        return conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ UNMUTE LIBERADO ───
꒰꒱ ${fecha}

꒰🍫꒱ Liberado del silencio pe
꒰🍨꒱ Usuario: @${mentionedJid.split('@')[0]}
꒰🍪꒱ Estado: *Liberado*

꒰🍨꒱ falto estás cositas
꒰꒱

─── ꒰💗꒱ CONTACTO ───
꒰🍪꒱ Número: +52 862 102 9907`, mentions:[mentionedJid] }, { quoted:m })
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