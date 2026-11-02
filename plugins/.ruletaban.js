let handler = async (m, { conn }) => {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid

    let candidates = participants.filter(p => !p.admin && p.id !== botNumber)
    if (!candidates.length) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 No hay víctimas, todos son admins`)

    let victim = candidates[Math.floor(Math.random() * candidates.length)]

    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })

    await new Promise(r => setTimeout(r, 1500))

    try {
        await conn.groupParticipantsUpdate(m.chat, [victim.id], 'remove')
        await conn.sendMessage(m.chat, { text: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 RULETA BAN ───

🍫 Participantes: ${candidates.length}
🍨 La ruleta eligió a @${victim.id.split('@')[0]}
🍪 Fue eliminada del grupo
💗 Cupid se la llevó

─── 💗 CONTACTO ───
Número: +52 862 102 9907`, mentions: [victim.id] })
    } catch (e) {
        m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 No pude eliminar a @${victim.id.split('@')[0]}\n🍨 Tiene protección`, null, { mentions: [victim.id] })
    }
}

handler.help = ['ruletaban']
handler.tags = ['group']
handler.command = /^(ruletaban|ruletab|ruletaban-halloween)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler