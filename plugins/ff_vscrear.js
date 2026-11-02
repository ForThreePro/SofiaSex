import moment from 'moment-timezone'
moment.locale('es')

let vs = global.vsData = global.vsData || {}

const crear = async (m, { conn, args, usedPrefix, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    if (args.length < 2) {
      let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR VS ───
Fecha: ${fecha}

🍫 Uso:
🍨 ${usedPrefix + command} 14 PE APOS
🍪 Cupid dice: pon hora y país pe

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      return conn.reply(m.chat, error, m);
    }

    let horaRaw = args[0];
    let hora, minutos;
    if (horaRaw.includes(':')) { [hora, minutos] = horaRaw.split(':').map(Number) } else { hora = Number(horaRaw); minutos = 0 }

    const pais = args[1].toUpperCase();
    const diferenciasHorarias = { CL: 2, AR: 2, PE: 0, BO: 2 };
    if (!(pais in diferenciasHorarias)) {
      let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR PAIS ───
Fecha: ${fecha}

🍫 Usa PE, CL, AR o BO
🍨 Cupid solo conoce esos países

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      return conn.reply(m.chat, error, m);
    }

    const diferenciaHoraria = diferenciasHorarias[pais];
    const formatTime = (date) => date.toLocaleTimeString('es', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const horasEnPais = { PE: '', CL: '', AR: '', BO: '' };
    for (const key in diferenciasHorarias) {
        const horaActual = new Date(); horaActual.setHours(hora, minutos, 0, 0);
        const horaEnPais = new Date(horaActual.getTime() + (3600000 * (diferenciasHorarias[key] - diferenciaHoraria)));
        horasEnPais[key] = formatTime(horaEnPais);
    }

    const modalidad = args.slice(2).join(' ') || 'APOS';
    let groupName = 'VS TEAM'
    if (m.isGroup) {
        let groupMeta = await conn.groupMetadata(m.chat)
        groupName = groupMeta.subject.toUpperCase()
    }

    let cantidad = command.includes('6') ? 6 : 4
    let tipo = command.includes('fem') ? 'FEM' : command.includes('masc') ? 'MASC' : 'MIXTO'

    let diseño = {}
    if (tipo === 'FEM') {
        diseño = { header: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n💗 ${groupName} 💗`, icon: '💗', suplente: '🍪' }
    }
    if (tipo === 'MASC') {
        diseño = { header: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 ${groupName} 🍫`, icon: '🍫', suplente: '🍨' }
    }
    if (tipo === 'MIXTO') {
        diseño = { header: `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍪 ${groupName} 🍪`, icon: '🍪', suplente: '💗' }
    }

    vs[m.chat] = vs[m.chat] || { salas: [], tipo, diseño, groupName }
    if (vs[m.chat].tipo !== tipo) vs[m.chat] = { salas: [], tipo, diseño, groupName }

    vs[m.chat].salas.push({
        jugadores: [],
        suplentes: [],
        modalidad,
        horasEnPais,
        cantidad,
        icons1: Array(cantidad).fill(diseño.icon),
        icons2: [diseño.suplente, diseño.suplente]
    })

    await actualizarLista(m.chat, conn, usedPrefix)
    m.react(diseño.icon)
}

const anotar = async (m, { conn, args, usedPrefix, command }) => {
    if (!vs[m.chat] || !vs[m.chat].salas.length) {
      return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 No hay VS activa\n🍨 Cupid dice: crea una primero\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
    }
    let salaNum = parseInt(args[0]) - 1
    if (isNaN(salaNum)) salaNum = 0

    let sala = vs[m.chat].salas[salaNum]
    if (!sala) return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Sala ${args[0]} no existe\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)

    let users = m.mentionedJid || []
    if (users.length === 0) {
      return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Menciona a alguien\n🍨 Ej: .anotar 1 @pepito @juana\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
    }

    for (let user of users) {
        sala.jugadores = sala.jugadores.filter(v => v !== user)
        sala.suplentes = sala.suplentes.filter(v => v !== user)

        if (command === 'anotar') {
            if (sala.jugadores.length >= sala.cantidad) return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Sala ${salaNum + 1} llena\n🍨 Cupid: ya no entra nadie más`, m)
            sala.jugadores.push(user)
        }
        if (command === 'suplente') {
            if (sala.suplentes.length >= 2) return conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Suplentes sala ${salaNum + 1} llenos`, m)
            sala.suplentes.push(user)
        }
        if (command === 'salir') {
            // Sin mensaje extra, solo actualiza la lista 1 vez abajo
        }
    }
    await actualizarLista(m.chat, conn, usedPrefix)
}

const actualizarLista = async (chat, conn, usedPrefix) => {
    let data = vs[chat]
    let d = data.diseño
    const fecha = moment.tz('America/Lima').format('DD/MM HH:mm')
    let todasSalas = ''

    data.salas.forEach((sala) => {
        let listaJug = sala.jugadores.map((v) => `🍫 @${v.split('@')[0]}`).join('\n')
        let listaSup = sala.suplentes.map((v) => `🍪 @${v.split('@')[0]}`).join('\n')

        for (let j = sala.jugadores.length; j < sala.cantidad; j++) { listaJug += `\n🍫 ` }
        for (let j = sala.suplentes.length; j < 2; j++) { listaSup += `\n🍪 ` }

        todasSalas += `🍫 MODO : ${sala.modalidad} 🍫\n`
        todasSalas += `🍫 ${sala.horasEnPais.PE} PE | ${sala.horasEnPais.CL} CL | ${sala.horasEnPais.AR} AR | ${sala.horasEnPais.BO} BO\n`
        todasSalas += `🍪 JUGADORES:\n${listaJug}\n`
        todasSalas += `💗 SUPLENTES:\n${listaSup}\n`
        todasSalas += `────────────────\n\n`
    })

    const message = `${d.header}
Fecha: ${fecha}

${todasSalas}
─── 🍪 COMO ANOTARSE ───
🍫 Admin: ${usedPrefix}anotar 1 @user1 @user2
🍨 Admin: ${usedPrefix}suplente 2 @user
🍪 Admin: ${usedPrefix}salir 1 @user

🍫 React:
💗 ${d.icon} = Quiero JUGAR
🍪 ${d.suplente} = Quiero SUPLENTE

─── 💗 CONTACTO ───
Número: +52 862 102 9907`;

    let mentions = []
    data.salas.forEach(s => mentions.push(...s.jugadores, ...s.suplentes))
    await conn.sendMessage(chat, { text: message, mentions })
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (/^v[46](fem|masc|mixto)$/i.test(command)) return crear(m, { conn, args, usedPrefix, command })
    if (['anotar', 'suplente', 'salir'].includes(command)) return anotar(m, { conn, args, usedPrefix, command })
}

handler.help = [
    'v4fem <hora> <pais> <modalidad>',
    'v4masc <hora> <pais> <modalidad>',
    'v4mixto <hora> <pais> <modalidad>',
    'v6fem <hora> <pais> <modalidad>',
    'v6masc <hora> <pais> <modalidad>',
    'v6mixto <hora> <pais> <modalidad>',
    'anotar <numSala> @user1 @user2',
    'suplente <numSala> @user',
    'salir <numSala> @user'
]
handler.tags = ['freefire']
handler.command = /^(v[46](fem|masc|mixto)|anotar|suplente|salir)$/i
handler.group = true
handler.admin = true

export default handler