import moment from 'moment-timezone'
moment.locale('es')

let detectEventsRegistered = false

export async function before(m, { conn }) {
  if (!detectEventsRegistered) {
    detectEventsRegistered = true

    conn.ev.on('group-participants.update', async (update) => {
      try {
        let chat = global.db.data.chats[update.id]
        if (!chat?.detect) return

        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let author = update.author || update.participants[0]
        let catalogoImg = { url: 'https://files.evogb.win/XQuHBW.jpg' }

        for (let user of update.participants) {
          if (update.action === 'promote') {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ADMIN ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Nuevo admin: @${user.split('@')[0]}
🍪 Cupid: Que cuide el grupo

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author, user]
            })
          }

          if (update.action === 'demote') {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ADMIN ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Ex-admin: @${user.split('@')[0]}
🍪 Se quedó sin acceso

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author, user]
            })
          }
        }
      } catch (e) {
        console.log('Error detect admin:', e)
      }
    })

    conn.ev.on('groups.update', async (updates) => {
      try {
        for (let update of updates) {
          let chat = global.db.data.chats[update.id]
          if (!chat?.detect) continue

          const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
          let author = update.author || 'Desconocido'
          let catalogoImg = { url: 'https://files.evogb.win/XQuHBW.jpg' }

          if (update.subject) {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 NOMBRE CAMBIADO ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Nuevo: ${update.subject}
🍪 Cupid detectó el cambio

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.desc) {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESCRIPCIÓN CAMBIADA ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Nueva: ${update.desc.slice(0, 300) || 'Vacía'}
🍪 Descripción actualizada

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.icon || update.picture) {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 FOTO CAMBIADA ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Foto cambiada
🍪 Cupid revisando nueva foto

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }

          if (update.inviteCode) {
            let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 LINK RESETEADO ───
Fecha: ${fecha}

🍫 Por: @${author.split('@')[0]}
🍨 Nuevo: https://chat.whatsapp.com/${update.inviteCode}
🍪 Link nuevo generado

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            await conn.sendMessage(update.id, {
              image: catalogoImg,
              caption: txt,
              mentions: [author].filter(a => a.includes('@'))
            })
          }
        }
      } catch (e) {
        console.log('Error detect groups:', e)
      }
    })
  }
  return true
}