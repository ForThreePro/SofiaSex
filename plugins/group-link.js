import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    try {
        await react('🍫')
        let link = await conn.groupInviteCode(m.chat)
        let groupMetadata = await conn.groupMetadata(m.chat)

        let texto = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ LINK DEL GRUPO ───
꒰꒱ ${fecha}

꒰🍫꒱ Invitación del grupo pe
꒰꒱
꒰🍨꒱ Grupo: *${groupMetadata.subject}*
꒰🍪꒱ Cupid te pasa el link

꒰💗꒱ Enlace
꒰꒱ https://chat.whatsapp.com/${link}

꒰🍫꒱ Solo admins pueden resetear el link
꒰🍨꒱ No lo compartas con desconocidos

꒰🍨꒱ falto estás cositas
꒰🍫꒱

─── ꒰💗꒱ CONTACTO ───
꒰🍪꒱ Número: +52 862 102 9907`

        await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
    } catch (e) {
        await react('🍫')
        let error = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ ERROR LINK ───
꒰꒱ ${fecha}

꒰🍫꒱ No pude obtener el link pe
꒰꒱
꒰🍨꒱ ¿Soy admin del grupo?
꒰🍪꒱ Cupid dice: hazme admin pe

꒰🍨꒱ falto estás cositas
꒰꒱

─── ꒰💗꒱ CONTACTO ───
꒰🍪꒱ Número: +52 862 102 9907`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'linkgroup', 'grouplink']
handler.group = true
handler.admin = true

export default handler