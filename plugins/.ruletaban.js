let handler = async (m, { conn }) => {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid

    let candidates = participants.filter(p => !p.admin && p.id !== botNumber)
    if (!candidates.length) return m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ No hay víctimas, todos son admins... se salvaron del sistema 👻`)

    let victim = candidates[Math.floor(Math.random() * candidates.length)]

    await conn.sendMessage(m.chat, { 
        text: 
`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡
*𝐑 𝐔 𝐋 𝐄 𝐓 𝐀  𝐁 𝐀 𝐍*
*PHANTOM FROST*

╭─── GIRANDO ❄️ ───╮
⛓️ Escaneando sistema...
👻 Participantes: ${candidates.length}
╰─────── ݁ ˖Ი𐑼⋆────╯

🦂 El sistema eligió a @${victim.id.split('@')[0]} 💥

*¡PHANTOM SE LO LLEVÓ!* ⚡❄️

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`,
        mentions: [victim.id]
    })

    await new Promise(r => setTimeout(r, 1500))

    try {
        await conn.groupParticipantsUpdate(m.chat, [victim.id], 'remove')
        await conn.sendMessage(m.chat, { text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ @${victim.id.split('@')[0]} fue eliminado del grupo\n⚡ Sistema PHANTOM ejecutado\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369\n━━━━━━━━━━━`, mentions: [victim.id] })
        await conn.sendMessage(m.chat, { react: { text: '❄️', key: m.key } })
    } catch (e) {
        m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ No pude eliminar a @${victim.id.split('@')[0]} - tiene protección del sistema`, null, { mentions: [victim.id] })
    }
}

handler.help = ['ruletaban']
handler.tags = ['group']
handler.command = /^(ruletaban|ruletab|ruletaban-halloween)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler