import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

const DB_FOLDER = './src/database/listas'

if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER, { recursive: true })

let handler = async (m, { conn, text }) => {
    const chatId = m.chat
    const db = path.join(DB_FOLDER, `${chatId}.json`)
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = '528621029907'

    if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify([]))

    let data = JSON.parse(fs.readFileSync(db))

    let now = moment.tz('America/Lima')
    let fechaFormato = now.format('dddd, DD/MM/YYYY')
    let diaSemana = now.format('dddd').toLowerCase()

    let diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (m.message?.extendedTextMessage?.text?.includes('verlista') || m.text?.includes('verlista')) {
        await react('🍫')
        let tabla = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 LISTA SEMANAL ───
Fecha: ${fechaFormato}

🍫 Periodo: Lunes a Sábado
🍨 Actualizado: ${fechaFormato}
🍪 Cupid controlando la lista

─── 💗 REGISTROS ───
`

        diasSemana.forEach(dia => {
            let anotadosDelDia = data.filter(v => v.dia.toLowerCase().includes(dia))
            tabla += `─── ${dia.toUpperCase()} ───\n`

            if (anotadosDelDia.length === 0) {
                tabla += `🍫 Sin anotados - Cupid en espera\n\n`
            } else {
                anotadosDelDia.forEach((v, i) => {
                    tabla += `${i+1}️⃣ 🍫 *${v.nombre}* [${v.rol}]\n`
                    tabla += `   🍨 Número: ${v.numero}\n`
                    tabla += `   🍪 Día: ${v.dia}\n\n`
                })
            }
        })
        tabla += `─── 💗 TOTAL ───
🍫 Total: *${data.length}* registro${data.length !== 1 ? 's' : ''}
🍨 Lista supervisada por Cupid

─── 💗 CONTACTO ───
Número: +52 862 102 9907
Owner: @${ownerNum}`
        return conn.sendMessage(m.chat, { text: tabla.trim(), mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    if (m.message?.extendedTextMessage?.text?.includes('lista') || m.text?.includes('lista')) {
        if (!diasSemana.includes(diaSemana)) {
            await react('🍫')
            let fueraHorario = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 FUERA DE HORARIO ───
Fecha: ${fechaFormato}

🍫 Solo se puede anotar de
🍨 *Lunes a Sábado*
🍪 Domingo Cupid descansa

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: fueraHorario }, { quoted: m })
        }

        if (!text) {
            await react('🍫')
            let formato = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 FORMATO LISTA ───
Fecha: ${fechaFormato}

🍫 Envía: .lista Nombre/Numero/Premio

🍨 Ejemplo:
🍪 .lista Cupid/+52 862 102 9907/Bot
💗 Premio: sistema Cupid

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: formato }, { quoted: m })
        }

        let [nombre, numero, rol] = text.split('/').map(v => v.trim())
        if (!nombre ||!numero ||!rol) {
            await react('🍫')
            let faltan = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 FALTAN DATOS ───
Fecha: ${fechaFormato}

🍫 Formato: Nombre/Numero/Rol
🍨 Cupid: "Faltan datos"

🍪 Ejemplo:
💗 fetsy/618282/bot

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: faltan }, { quoted: m })
        }

        let yaAnotado = data.find(v => v.numero === numero && v.dia === fechaFormato)
        if (yaAnotado) {
            await react('🍫')
            let duplicado = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 YA ANOTADO ───
Fecha: ${fechaFormato}

🍫 ${nombre} ya fue anotado hoy
🍨 Día: *${fechaFormato}*
🍪 Cupid dice: ya está en la lista

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: duplicado }, { quoted: m })
        }

        data.push({ nombre, numero, rol, dia: fechaFormato })
        fs.writeFileSync(db, JSON.stringify(data, null, 2))
        await react('🍫')

        let ok = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ANOTADO ───
Fecha: ${fechaFormato}

🍫 Nombre: *${nombre}*
🍨 Número: *${numero}*
🍪 Rol: *${rol}*
💗 Día: *${fechaFormato}*
🍫 Aprobado por Cupid

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: ok }, { quoted: m })
    }
}

handler.help = ['lista nombre/numero/premio', 'verlista']
handler.tags = ['sorteos']
handler.command = /^(lista|verlista)$/i
handler.group = true
export default handler