let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0, prestamo: 0, interes: 0, ultimoCrimen: 0 }

  user.prestamo = Number(user.prestamo) || 0
  user.interes = Number(user.interes) || 0
  user.ultimoCrimen = Number(user.ultimoCrimen) || 0
  user.coin = Number(user.coin) || 0
  user.bank = Number(user.bank) || 0
  user.deuda = Number(user.deuda) || 0

  //.PRESTAMO - INTERÉS FIJO 25% UNA SOLA VEZ
  if (command === 'prestamo') {
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Paga primero, no prestamos con deuda\n\n${usedPrefix}work o ${usedPrefix}pagardeuda\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (user.prestamo > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO ACTIVO ───\n\n🍫 Capital: ${user.prestamo - user.interes} 🍪\n🍨 Interés: ${user.interes} 🍪\n🍪 Total: ${user.prestamo} 🍪\n\nUsa ${usedPrefix}pagarprestamo <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)

    let monto = parseInt(text)
    if (isNaN(monto) || monto < 100) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO ───\n\n🍫 Mínimo: 100 🍪\n🍨 Máximo: 10,000 🍪\n🍪 Interés: 25% fijo\n\nEj:\n100 → Pagas 125\n200 → Pagas 250\n500 → Pagas 625\n1000 → Pagas 1250\n\nUso: ${usedPrefix}prestamo <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (monto > 10000) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Máximo 10,000 🍪')

    let totalRiqueza = user.coin + user.bank
    let limitePrestamo = Math.max(100, totalRiqueza * 2)
    if (monto > limitePrestamo) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Solo te presto hasta ${limitePrestamo} 🍪 según tu riqueza\n🍨 Total: ${totalRiqueza} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)

    let interesFijo = Math.floor(monto * 0.25)
    let totalPagar = monto + interesFijo
    user.prestamo = totalPagar
    user.interes = interesFijo
    user.bank += monto

    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO APROBADO ───\n\n🍫 Recibiste: ${monto} 🍪 en tu banco\n🍨 Interés: ${interesFijo} 🍪 (25%)\n🍪 Total a pagar: ${totalPagar} 🍪\n\n💗 Paga con ${usedPrefix}pagarprestamo <monto>\n\nBanco: ${user.bank} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  //.PAGARPRESTAMO
  if (['pagarprestamo', 'pp'].includes(command)) {
    if (user.prestamo === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n💗 Sin préstamos')
    let monto = parseInt(text)
    if (isNaN(monto) || monto < 1) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TU PRÉSTAMO ───\n\n🍫 Capital: ${user.prestamo - user.interes} 🍪\n🍨 Interés: ${user.interes} 🍪\n🍪 Total: ${user.prestamo} 🍪\n\nUso: ${usedPrefix}pagarprestamo <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Billetera: ${user.coin} 🍪\n🍨 Deuda: ${user.prestamo} 🍪\n💗 No alcanza`)
    let aPagar = Math.min(monto, user.prestamo)
    user.coin -= aPagar
    user.prestamo -= aPagar
    if (user.prestamo === 0) {
      user.interes = 0
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO PAGADO ───\n\n🍫 Pagaste ${aPagar} 🍪\n💗 Ya no debes nada\n\nSaldo: ${user.coin} 🍪`)
    } else {
      let capitalOriginal = user.prestamo + aPagar - user.interes
      let interesOriginal = user.interes
      let porcentajePagado = aPagar / (capitalOriginal + interesOriginal)
      user.interes = Math.max(0, Math.floor(interesOriginal * (1 - porcentajePagado)))
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PAGO ───\n\n🍫 Pagaste ${aPagar} 🍪\n\n🍨 Capital: ${user.prestamo - user.interes} 🍪\n🍪 Interés: ${user.interes} 🍪\n💗 Total: ${user.prestamo} 🍪\n\nSaldo: ${user.coin} 🍪`)
    }
  }

  //.VER PRESTAMO
  if (['verprestamo', 'miprestamo'].includes(command)) {
    if (user.prestamo === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n💗 Sin préstamos\n🍨 Usa ' + usedPrefix + 'prestamo <monto> para pedir')
    let capital = user.prestamo - user.interes
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TU PRÉSTAMO ───\n\n🍫 Capital: ${capital} 🍪\n🍨 Interés: ${user.interes} 🍪 (25%)\n🍪 TOTAL: ${user.prestamo} 🍪\n\nUsa ${usedPrefix}pagarprestamo <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  //.INTERES
  if (command === 'interes') {
    let ahora = Date.now()
    let ultimoInteres = user.ultimoInteres || 0
    let tiempoEspera = 86400000
    if (ahora - ultimoInteres < tiempoEspera) {
      let falta = tiempoEspera - (ahora - ultimoInteres)
      let horas = Math.floor(falta / 3600000)
      let minutos = Math.floor((falta % 3600000) / 60000)
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Ya cobraste hoy\n🍨 Vuelve en: ${horas}h ${minutos}m\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    }
    if (user.bank === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Sin galletas en el banco\n💗 Usa ' + usedPrefix + 'dall para depositar')
    let interesGanado = Math.floor(user.bank * 0.02)
    if (interesGanado < 1) interesGanado = 1
    user.bank += interesGanado
    user.ultimoInteres = ahora
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 INTERÉS ───\n\n🍫 Ganaste: ${interesGanado} 🍪 (2%)\n🍨 Tu banco genera solo\n\nBanco: ${user.bank} 🍪\n\n💗 Vuelve mañana\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  //.CRIMEN
  if (command === 'crimen') {
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Paga primero, no puedes hacer crimen con deuda\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    let ahora = Date.now()
    let tiempoEspera = 600000
    if (ahora - user.ultimoCrimen < tiempoEspera) {
      let falta = tiempoEspera - (ahora - user.ultimoCrimen)
      let minutos = Math.ceil(falta / 60000)
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Te están vigilando\n🍨 Espera ${minutos} min para otro crimen`)
    }
    user.ultimoCrimen = ahora
    let exito = Math.random() < 0.35
    if (exito) {
      let robado = Math.floor(Math.random() * 500) + 100
      user.coin += robado
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 CRIMEN EXITOSO ───\n\n🍫 Robaste ${robado} 🍪 del banco central\n🍨 Nadie vio nada\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    } else {
      let multa = Math.floor(Math.random() * 200) + 100
      if (user.coin < multa) {
        let deudaNueva = multa - user.coin
        user.deuda += deudaNueva
        user.coin = 0
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TE ATRAPARON ───\n\n🍫 Intentaste robar el banco pero fallaste\n\n🍨 Multa: ${multa} 🍪\n🍪 Deuda: ${user.deuda} 🍪\n\nUsa ${usedPrefix}work para pagar\n\nSaldo: 0 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
      } else {
        user.coin -= multa
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TE ATRAPARON ───\n\n🍫 La alarma sonó\n\n🍨 Multa: ${multa} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
      }
    }
  }

  //.BANCO
  if (command === 'banco') {
    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 BANCO CENTRAL ───\n\n`
    texto += `🍫 Banco: ${user.bank} 🍪\n`
    texto += `🍨 Billetera: ${user.coin} 🍪\n`
    texto += `🍪 Deuda: ${user.deuda} 🍪\n\n`
    if (user.prestamo > 0) {
      let capital = user.prestamo - user.interes
      texto += `─── 💗 TU PRÉSTAMO ───\n🍫 Capital: ${capital} 🍪\n🍨 Interés: ${user.interes} 🍪\n🍪 Total: ${user.prestamo} 🍪\n\n`
    } else {
      texto += `💗 Sin préstamos\n\n`
    }
    texto += `─── 🍫 SERVICIOS ───\n`
    texto += `🍫 ${usedPrefix}interes - Cobra 2% diario\n`
    texto += `🍨 ${usedPrefix}prestamo <monto> - Préstamo 25%\n`
    texto += `🍪 ${usedPrefix}pagarprestamo <monto> - Paga deuda\n`
    texto += `💗 ${usedPrefix}crimen - Roba el banco (35%)\n\n`
    texto += `💗 Tip: ${usedPrefix}dall para ganar interés\n\n`
    texto += `─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`
    return m.reply(texto)
  }

  //.PERDONARPRESTAMO
  if (command === 'perdonarprestamo') {
    let isOwner = global.owner.map(v => v[0] + '@s.whatsapp.net').includes(m.sender)
    let isAdmin = false
    try {
      let groupMetadata = await conn.groupMetadata(m.chat)
      isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin
    } catch {}
    if (!isOwner && !isAdmin) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Solo admins pueden perdonar')
    let who = m.mentionedJid[0]
    if (!who) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Uso: ${usedPrefix}perdonarprestamo @user`)
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0, prestamo: 0, interes: 0 }
    let userTarget = global.db.data.users[who]
    userTarget.prestamo = Number(userTarget.prestamo) || 0
    if (userTarget.prestamo === 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 @${who.split('@')[0]} no tiene préstamos`, null, { mentions: [who] })
    let deudaPerdonada = userTarget.prestamo
    userTarget.prestamo = 0
    userTarget.interes = 0
    try {
      await conn.reply(who, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO PERDONADO ───\n\n🍫 Un admin te perdonó ${deudaPerdonada} 🍪\n💗 Ya no debes nada`, null, { mentions: [m.sender] })
    } catch {}
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 PRÉSTAMO PERDONADO ───\n\n🍫 Le perdonaste ${deudaPerdonada} 🍪 a @${who.split('@')[0]}\n\n💗 Ya no tiene deuda`, null, { mentions: [who] })
  }
}

handler.help = ['prestamo', 'pagarprestamo', 'verprestamo', 'interes', 'crimen', 'banco', 'perdonarprestamo']
handler.tags = ['economy']
handler.command = ['prestamo', 'pagarprestamo', 'pp', 'verprestamo', 'miprestamo', 'interes', 'crimen', 'banco', 'perdonarprestamo']
handler.group = true
export default handler