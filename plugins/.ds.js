import { existsSync, promises as fs } from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

var handler = async (m, { conn }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, '🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\nUsa esto en el número principal', m)
    }

    let rutas = [`./Sesiones/Principal/`, `./sesiones/Principal/`, `./sessions/Principal/`]
    let sessionPath = rutas.find(r => existsSync(r))

    if (!sessionPath) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\nNo encontré la carpeta de sesión')

    await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })

    let files = await fs.readdir(sessionPath)
    let filesDeleted = 0

    for (const file of files) {
        if (
            file.startsWith('pre-key-') ||
            file.startsWith('sender-key') ||
            file.startsWith('session-')
        ) {
            if (!file.startsWith('creds') && !file.startsWith('app-state')) {
                await fs.unlink(path.join(sessionPath, file))
                filesDeleted++;
            }
        }
    }

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = global.owner?.[0]?.[0] || '528621029907'

    let menu = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 SISTEMA ───
Fecha: ${fecha}
Comando: .dsowner

─── 🍫 FIX DE SESIÓN [${filesDeleted}] ───

Descripción:
🍫 Elimina archivos de caché basura
🍨 No borra creds ni app-state para que no se desconecte

Uso:
🍪 Solo en el número principal del bot
💗 El bot sigue conectado, no necesita reinicio

Resultado:
🍫 Archivos eliminados: ${filesDeleted}
🍨 Estado: ${filesDeleted === 0 ? 'Todo limpio' : 'Limpieza completada'}

─── 💗 CONTACTO ───
Dueña: @${ownerNum}
Número: +52 862 102 9907`

    await conn.sendMessage(m.chat, {
        text: menu,
        mentions: [m.sender, ownerNum + '@s.whatsapp.net']
    }, { quoted: m })
}
handler.help = ['dsowner']
handler.tags = ['fix', 'owner']
handler.command = ['dsowner','delai','clearcache']
handler.rowner = true
export default handler