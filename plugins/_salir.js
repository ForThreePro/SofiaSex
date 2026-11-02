import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = m.sender
    let nombre = conn.getName(user)
    let groupName = await conn.getName(m.chat)

    if (!m.isGroup) {
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR SALIR ───
Fecha: ${fecha}

🍫 Este comando solo funciona en grupos
🍨 Cupid solo sale de grupos

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    // 2 VERSIONES DEL DUEÑO: +52 y +52 1
    let owners = [
        '528621029907@s.whatsapp.net',
        '5218621029907@s.whatsapp.net'
    ]

    if (!owners.includes(user)) {
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ACCESO DENEGADO ───
Fecha: ${fecha}

🍫 Este comando es exclusivo del dueño
🍨 Solo Cupid mayor puede irse

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let pp
    try {
        pp = await conn.profilePictureUrl(user, 'image')
    } catch {
        pp = 'https://files.evogb.win/YhR5LZ.jpg'
    }

    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESPEDIDA ───
Fecha: ${fecha}

🍫 *${nombre}* se despide de: *${groupName}*
🍨 Cupid se va por nuevos grupos

─── 💗 MENSAJE ───
🍫 Gracias por la confianza depositada
🍨 Cada momento compartido en este grupo
🍪 Por elegirnos como su Bot #1 de WhatsApp 2026
💗 Me llevo los mejores recuerdos
🍫 Si necesitan volver a contar conmigo, aquí estaré
🍨 Cupid siempre vuelve

─── 💗 SOPORTE ───
Número: +52 862 102 9907
🍪 Soporte Cupid incluido`

    // 1 SOLO MENSAJE - despedida y salir
    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: texto,
        mentions: [user]
    })

    await new Promise(r => setTimeout(r, 1000))

    await conn.groupParticipantsUpdate(m.chat, [user], "remove")
}

handler.help = ['salir']
handler.tags = ['owner']
handler.command = /^salir$/i
handler.group = true
handler.botAdmin = true
export default handler