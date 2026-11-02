const linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,30})/i

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!isAdmin && !isOwner) throw "🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Solo los admins pueden usar este comando"

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (/on/i.test(args[0])) {
        chat.antiLink = true
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTILINK ON ───

🍫 Anti-Link: Activado
🍨 Los enlaces serán eliminados

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    } else if (/off/i.test(args[0])) {
        chat.antiLink = false
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTILINK OFF ───

🍫 Anti-Link: Desactivado
🍨 Los enlaces están permitidos

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    } else {
        await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANTILINK ───

🍫 Uso: .antilink on / off
🍨 Ejemplo:
🍪 .antilink on
💗 .antilink off

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, m)
    }
}

handler.help = ['antilink <on/off>']
handler.tags = ['config']
handler.command = /^(antilink|antilinks)$/i

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return !0
    const botNumber = conn.user.jid
    if (m.sender === botNumber || m.fromMe || m.isBaileys) return !0

    const chat = global.db.data.chats[m.chat]
    if (!chat?.antiLink) return !0

    const isGroupLink = linkRegex.exec(m.text)
    const isChannelLink = channelLinkRegex.exec(m.text)

    if ((isGroupLink || isChannelLink) && !isAdmin) {
        if (!isBotAdmin) return !0

        if (isGroupLink) {
            const groupCode = await conn.groupInviteCode(m.chat).catch(() => null)
            if (groupCode && m.text.includes(groupCode)) return !0
        }

        await conn.sendMessage(m.chat, { delete: m.key })
        await conn.reply(
            m.chat,
            `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ENLACE PROHIBIDO ───

🍫 @${m.sender.split('@')[0]} intentó enviar un enlace
🍨 Acción: Eliminado del grupo
🍪 No se permiten enlaces aquí

─── 💗 CONTACTO ───
Número: +52 862 102 9907`,
            m,
            { mentions: [m.sender] }
        )
        return await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }
    return !0
}

export default handler