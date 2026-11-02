import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    // Validación de permisos para el comando
    if (!isAdmin && !isOwner) throw `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Solo los admins pueden usar este comando.`

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (/on/i.test(args[0])) {
        chat.modoadmin = true
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 MODO ADMIN ON ───
Fecha: ${fecha}

🍫 *Modo Administrador activado*
🍨 Ahora solo los admins pueden usar el bot
🍪 Modo Cupid activo

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    } else if (/off/i.test(args[0])) {
        chat.modoadmin = false
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 MODO ADMIN OFF ───
Fecha: ${fecha}

🍫 *Modo Administrador desactivado*
🍨 Todos pueden usar el bot de nuevo
🍪 Cupid abierto para todos

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    } else {
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 MODO ADMIN ───
Fecha: ${fecha}

🍫 .modoadmin on - Activa modo solo admins
🍨 .modoadmin off - Desactiva modo

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    }
}

handler.help = ['modoadmin <on/off>']
handler.tags = ['config']
handler.command = /^(modoadmin|adminmode)$/i

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isPrems }) {
    if (m.isBaileys || m.fromMe) return !0

    let chat = global.db.data.chats[m.chat]
    if (!chat) return !0

    if (m.isGroup) {
        if (chat.modoadmin && !isAdmin && !isOwner && !isROwner && !isPrems) {
            if (m.text.startsWith('.') || m.text.startsWith('/') || m.text.startsWith('#')) {
                return false
            }
        }
    } else {
        if (!isOwner && !isROwner && !isPrems) {
            // return false
        }
    }

    return !0
}

export default handler