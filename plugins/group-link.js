import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    try {
        await react('🔗')
        let link = await conn.groupInviteCode(m.chat)
        let groupMetadata = await conn.groupMetadata(m.chat)

        let texto = `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⛓️ ┇ 𝐋𝐈𝐍𝐊 ﹒ DEL GRUPO
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`INVITACIÓN\`\` 🔗 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ ❄️
👥 ➛ Grupo: *${groupMetadata.subject}*
👻 ➛ PHANTOM te pasa el link

── *🔗 ENLACE* ╏ ⛓️
https://chat.whatsapp.com/${link}

── *📝 NOTAS* ╏ ❄️
🔒 ➛ Solo admins pueden resetear el link
⚠️ ➛ No lo compartas con desconocidos
❄️ ➛ PHANTOM lo aprueba

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`

        await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    } catch (e) {
        await react('❌')
        let error = `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⛓️ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ LINK
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` ❌ —˙𖦹.꒷

── *📝 AVISO* ╏ ❄️
❌ ➛ No pude obtener el link
🔒 ➛ ¿Soy admin del grupo?
👻 ➛ PHANTOM dice: hazme admin pe

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'linkgroup', 'grouplink']
handler.group = true
handler.admin = true

export default handler