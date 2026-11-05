import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

    // TUS 2 NÚMEROS PROTEGIDOS - MEXICO
    const owners = ['528621029907', '5218621029907']
    const ownerJids = owners.map(n => n + '@s.whatsapp.net')

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    // Solo tú con cualquiera de tus 2 números puedes usarlo
    const senderNum = m.sender.replace(/[^0-9]/g, '')
    const isOwner = owners.some(n => senderNum.includes(n) || senderNum.endsWith(n.slice(2)))
    if (!isOwner) {
        await react('🍫')
        return conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ SISTEMA ACCESO DENEGADO ───
꒰꒱ ${fecha}

꒰🍫꒱ Solo mi dueño puede usar esto
꒰꒱
꒰🍨꒱ Comando: *.kickall*
꒰🍪꒱ Solo: +52 862 102 9907 / +521 862 102 9907

─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───
꒰🍫꒱ Número: +52 862 102 9907`, mentions: [m.sender] }, { quoted: m })
    }

    if (!m.isGroup) return m.reply('꒰🍫꒱ Solo en grupos')

    try {
        await react('🍫')
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
            await react('🍫')
            return m.reply('꒰🍫꒱ No hay nadie para sacar, solo estamos tú y yo ꒰💗꒱')
        }

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

        await react('🍫')
        await conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ GRUPO COMPLETADO KICKALL ───
꒰꒱ ${fecha}

꒰🍫꒱ Listo, solo quedamos nosotros
꒰🍨꒱ Sacando a todos, incluido el creador, menos a ti y a Cupid

꒰🍪꒱ Eliminados: *${sacados}*
꒰💗꒱ Fallidos: *${fallidos.length}*
꒰꒱ Quedan: *Tú y yo (bot)*
꒰🍫꒱ Total a sacar: *${toKick.length}*
꒰🍨꒱ Creador: *SÍ se elimina si no eres tú*

─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───
꒰🍪꒱ Número: +52 862 102 9907` 
        })

    } catch (e) {
        return m.reply(`꒰🍫꒱ ${e.message}\n꒰🍨꒱ El bot debe ser admin`)
    }
}

handler.help = ['kickall']
handler.tags = ['owner']
handler.command = ['kickall', 'sacartodos', 'kicktodos']
handler.group = true
handler.botAdmin = true

export default handler