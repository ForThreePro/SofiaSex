import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

    // TUS 2 NÚMEROS PROTEGIDOS
    const owners = ['51927174369', '51930858072']
    const ownerJids = owners.map(n => n + '@s.whatsapp.net')

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    // Solo tú con cualquiera de tus 2 números puedes usarlo
    const senderNum = m.sender.replace(/[^0-9]/g, '')
    const isOwner = owners.some(n => senderNum.includes(n) || senderNum.endsWith(n.slice(2)))
    if (!isOwner) {
        await react('❌')
        return conn.sendMessage(m.chat, { 
            text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⛓️ ┇ 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ﹒ ACCESO DENEGADO
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`DENEGADO\`\` 🔴 —˙𖦹.꒷
❄️ Solo mi dueño puede usar esto pe

── *📊 INFO* ╏ ❄️
🔒 ➛ Comando: *.kickall*
👑 ➛ Solo: +51 927 174 369 / +51 930 858 072

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })
    }

    if (!m.isGroup) return m.reply('❄️ Solo en grupos pe')

    try {
        await react('❄️')
        let groupMetadata = await conn.groupMetadata(m.chat)
        let botId = conn.user.jid
        let botLid = conn.user.lid || ''

        // Normalizar número de un JID/LID para comparar
        const getNum = (id) => id.split('@')[0].replace(/[^0-9]/g, '')

        let toKick = groupMetadata.participants
            .map(p => p.id)
            .filter(id => {
                // 1. NUNCA sacar al BOT (JID o LID)
                if (id === botId) return false
                if (botLid && id === botLid) return false
                if (id === conn.user.jid) return false

                // 2. NUNCA sacar a TUS 2 NÚMEROS (aunque sean creador, admin, o LID)
                const num = getNum(id)
                for (let owner of owners) {
                    if (num.includes(owner) || owner.includes(num) || num.endsWith(owner.slice(2))) return false
                    if (id.includes(owner)) return false
                }
                if (ownerJids.includes(id)) return false

                // 3. AQUÍ ESTÁ LA CLAVE: NO PROTEGEMOS AL CREADOR
                // Si el creador es uno de tus 2 números, ya quedó protegido arriba.
                // Si el creador es OTRA persona, SÍ se va en la purga.
                return true
            })

        if (!toKick.length) {
            await react('❌')
            return m.reply('❄️ No hay nadie para sacar pe, solo estamos tú y yo ❄️')
        }

        await conn.sendMessage(m.chat, { 
            text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⛓️ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ KICKALL INICIADO
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PURGA\`\` 🔴 —˙𖦹.꒷
❄️ Sacando a todos, incluido el creador, menos a ti y a PHANTOM pe

── *📊 INFO* ╏ ❄️
🔴 ➛ Total: *${toKick.length}*
👑 ➛ Se quedan: *Tú (2 números) y el bot*
👻 ➛ Creador: *SÍ se elimina si no eres tú*
👻 ➛ El bot: *NO se va*

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`, mentions: [m.sender] }, { quoted: m })

        let sacados = 0
        let fallidos = []
        for (let id of toKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [id], 'remove')
                sacados++
                await new Promise(r => setTimeout(r, 800))
            } catch (e) {
                fallidos.push(id)
            }
        }

        await react('🔥')
        await conn.sendMessage(m.chat, { 
            text: `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡

⛓️ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ COMPLETADO
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`LIMPIO\`\` 🟢 —˙𖦹.꒷
❄️ Listo pe, solo quedamos nosotros

── *📊 RESULTADO* ╏ ❄️
🗑️ ➛ Eliminados: *${sacados}*
⚠️ ➛ Fallidos: *${fallidos.length}*
👑 ➛ Quedan: *Tú y yo (bot)*

━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━` 
        })

    } catch (e) {
        return m.reply(`❌ ${e.message}\n❄️ El bot debe ser admin pe`)
    }
}

handler.help = ['kickall']
handler.tags = ['owner']
handler.command = ['kickall', 'sacartodos', 'kicktodos']
handler.group = true
handler.botAdmin = true

export default handler