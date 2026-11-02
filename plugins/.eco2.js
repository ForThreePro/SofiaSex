let cooldowns = { trivia: {}, work: {}, robar: {} }

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // TRIVIA - COOLDOWN 30 SEG
  if (command === 'trivia') {
    if (cooldowns.trivia[m.sender] && Date.now() - cooldowns.trivia[m.sender] < 30000)
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Espera ${Math.ceil((30000 - (Date.now() - cooldowns.trivia[m.sender])) / 1000)}s, Cupid está pensando`)
    const preguntas = [
      { q: '¿Cuántos días tiene una semana?', a: '7' },
      { q: '¿De qué color es el cielo despejado?', a: 'azul' },
      { q: '¿Cuánto es 5 + 5?', a: '10' },
      { q: '¿Qué animal dice miau?', a: 'gato' },
      { q: '¿Cuántas patas tiene un perro?', a: '4' },
      { q: '¿Cuánto es 3 x 3?', a: '9' },
      { q: '¿Qué sale de día y da luz?', a: 'sol' },
      { q: '¿Cuál es la primera letra?', a: 'a' }
    ]
    let trivia = preguntas[Math.floor(Math.random() * preguntas.length)]
    cooldowns.trivia[m.sender] = Date.now()
    await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRIVIA ───\n\n${trivia.q}\n\n🍨 Tienes 15 segundos\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, m)
    global.db.data.trivia = global.db.data.trivia || {}
    global.db.data.trivia[m.sender] = { answer: trivia.a.toLowerCase(), chat: m.chat, timeout: setTimeout(() => delete global.db.data.trivia[m.sender], 15000) }
    return
  }

  // RULETA
  if (['ruleta', 'rlt'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Uso: ${usedPrefix + command} <red/black> <monto>`)
    let color = args[0].toLowerCase()
    let monto = parseInt(args[1])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 No puedes apostar con deuda\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (!['red', 'black', 'rojo', 'negro', 'rosa', 'chocolate'].includes(color)) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Usa: red / black')
    if (isNaN(monto) || monto < 10) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Apuesta mínima: 10 🍪')
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 No tienes suficiente. Saldo: ${user.coin} 🍪`)
    user.coin -= monto
    let resultado = Math.random() < 0.5 ? 'red' : 'black'
    let colorElegido = color === 'rojo' ? 'red' : color === 'negro' ? 'black' : color === 'rosa' ? 'red' : color === 'chocolate' ? 'black' : color
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (resultado === colorElegido) {
      let ganancia = monto * 2
      user.coin += ganancia
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 RULETA ───\n\n🍫 ¡GANASTE!\n🍨 Salió: ${resultado === 'red' ? '🍫 Rojo' : '💗 Negro'}\n🍪 Apostaste: ${monto} 🍪\n💗 Ganaste: ${ganancia} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    } else {
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 RULETA ───\n\n🍫 PERDISTE\n🍨 Salió: ${resultado === 'red' ? '🍫 Rojo' : '💗 Negro'}\n🍪 Perdiste: ${monto} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    }
  }

  // SLOTS
  if (['slots', 'slot'].includes(command)) {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Usa ${usedPrefix}pagardeuda o ${usedPrefix}work\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (isNaN(monto) || monto < 10) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Apuesta mínima: 10 🍪\nUso: ${usedPrefix + command} <monto>`)
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Saldo: ${user.coin} 🍪\n🍨 No alcanza`)
    user.coin -= monto
    const emojis = ['🍫', '🍨', '🍪', '💗']
    let a = emojis[Math.floor(Math.random() * emojis.length)]
    let b = emojis[Math.floor(Math.random() * emojis.length)]
    let c = emojis[Math.floor(Math.random() * emojis.length)]
    let multiplicador = 0
    if (a === b && b === c) {
      if (a === '💗') multiplicador = 10
      else if (a === '🍫') multiplicador = 8
      else if (a === '🍨') multiplicador = 5
      else if (a === '🍪') multiplicador = 3
    } else if (a === b || b === c || a === c) multiplicador = 2
    if (multiplicador > 0) {
      let ganancia = monto * multiplicador
      user.coin += ganancia
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 SLOTS ───\n\n${a} | ${b} | ${c}\n\n🍫 x${multiplicador} - ¡JACKPOT!\n🍨 Ganaste: ${ganancia} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    } else {
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 SLOTS ───\n\n${a} | ${b} | ${c}\n\n🍫 PERDISTE\n🍨 Perdiste: ${monto} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    }
  }

  // WORK
  if (['work', 'trabajar'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000
    if (cooldowns.work[m.sender] && Date.now() - cooldowns.work[m.sender] < tiempoEspera)
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Ya trabajaste, espera ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.work[m.sender])) / 60000)} min`)

    cooldowns.work[m.sender] = Date.now()
    const trabajos = [
      { texto: 'Hiciste galletas y ganaste', min: 80, max: 200 },
      { texto: 'Vendiste helado y ganaste', min: 50, max: 120 },
      { texto: 'Decoraste la dollhouse y ganaste', min: 30, max: 150 },
      { texto: 'Cuidaste a las dolls y ganaste', min: 40, max: 100 },
      { texto: 'Hiciste chocolate y ganaste', min: 60, max: 180 }
    ]
    let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)]
    let ganancia = Math.floor(Math.random() * (trabajo.max - trabajo.min + 1)) + trabajo.min

    if (user.deuda > 0) {
      let pagoDeuda = Math.min(ganancia, user.deuda)
      user.deuda -= pagoDeuda
      let sobrante = ganancia - pagoDeuda
      if (sobrante > 0) {
        user.coin = (Number(user.coin) || 0) + sobrante
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRABAJO ───\n\n🍫 ${trabajo.texto} ${ganancia} 🍪\n\n🍨 Pagaste ${pagoDeuda} 🍪 a tu deuda\n💗 Te quedaron ${sobrante} 🍪\n\nDeuda restante: ${user.deuda} 🍪\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
      } else {
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRABAJO ───\n\n🍫 ${trabajo.texto} ${ganancia} 🍪\n\n🍨 Todo se fue a pagar tu deuda\n\nDeuda restante: ${user.deuda} 🍪\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
      }
    } else {
      user.coin = (Number(user.coin) || 0) + ganancia
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRABAJO ───\n\n🍫 ${trabajo.texto} ${ganancia} 🍪\n\nSaldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    }
  }

  // ROBAR
  if (['robar', 'rob'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 No puedes robar con deuda\n\nUsa ${usedPrefix}pagardeuda o ${usedPrefix}work\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)

    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000
    if (cooldowns.robar[m.sender] && Date.now() - cooldowns.robar[m.sender] < tiempoEspera)
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Espera ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.robar[m.sender])) / 60000)} min para robar`)

    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    if (!who) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Menciona a quien quieres robar`)
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 No te robes a ti misma')

    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    let target = global.db.data.users[who]
    target.coin = Number(target.coin) || 0
    if (target.coin < 1) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 @${who.split('@')[0]} no tiene nada`, null, { mentions: [who] })

    cooldowns.robar[m.sender] = Date.now()
    let exito = Math.random() < 0.6

    if (exito) {
      let robado = target.coin <= 5 ? target.coin : Math.min(Math.floor(Math.random() * target.coin * 0.5) + 1, target.coin)
      target.coin -= robado
      user.coin = (Number(user.coin) || 0) + robado
      try {
        await conn.reply(who, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TE ROBARON ───\n\n🍫 @${m.sender.split('@')[0]} te robó ${robado} 🍪\n\nTu saldo: ${target.coin} 🍪`, null, { mentions: [m.sender] })
      } catch {}
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 ROBO EXITOSO ───\n\n🍫 Le robaste ${robado} 🍪 a @${who.split('@')[0]}\n\nTu saldo: ${user.coin} 🍪`, null, { mentions: [who, m.sender] })
    } else {
      let multa = Math.floor(Math.random() * 50) + 20
      user.coin = Number(user.coin) || 0
      if (user.coin < multa) {
        let deudaNueva = multa - user.coin
        user.deuda = (Number(user.deuda) || 0) + deudaNueva
        user.coin = 0
        try {
          await conn.reply(who, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 INTENTO DE ROBO ───\n\n🍫 @${m.sender.split('@')[0]} intentó robarte pero la atraparon y ahora debe ${deudaNueva} 🍪`, null, { mentions: [m.sender] })
        } catch {}
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TE ATRAPARON ───\n\n🍫 Multa: ${multa} 🍪\n🍨 Deuda: ${user.deuda} 🍪\n\nUsa ${usedPrefix}pagardeuda o ${usedPrefix}work\n\nSaldo: 0 🍪`)
      } else {
        user.coin -= multa
        try {
          await conn.reply(who, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 INTENTO DE ROBO ───\n\n🍫 @${m.sender.split('@')[0]} intentó robarte pero falló y pagó ${multa} 🍪`, null, { mentions: [m.sender] })
        } catch {}
        return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TE ATRAPARON ───\n\n🍫 Multa: ${multa} 🍪\n\nTu saldo: ${user.coin} 🍪`)
      }
    }
  }

  // PAGAR DEUDA
  if (['pagardeuda', 'deuda'].includes(command)) {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n💗 No tienes deudas')

    let monto = parseInt(text)
    if (isNaN(monto) || monto < 1) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 DEUDA ───\n\n🍫 Deuda: ${user.deuda} 🍪\n🍨 Uso: ${usedPrefix}pagardeuda <monto>\n💗 O usa ${usedPrefix}work para pagar`)
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Saldo: ${user.coin} 🍪\n🍨 Deuda: ${user.deuda} 🍪\n\n💗 Usa ${usedPrefix}work para ganar`)

    let aPagar = Math.min(monto, user.deuda)
    user.coin -= aPagar
    user.deuda -= aPagar

    if (user.deuda === 0) {
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 DEUDA PAGADA ───\n\n🍫 Pagaste ${aPagar} 🍪\n💗 Ya no tienes deuda\n\nTu saldo: ${user.coin} 🍪`)
    } else {
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 DEUDA ───\n\n🍫 Pagaste ${aPagar} 🍪\n\n🍨 Restante: ${user.deuda} 🍪\nSaldo: ${user.coin} 🍪`)
    }
  }
}

handler.before = async (m, { conn }) => {
  if (!global.db.data.trivia || !global.db.data.trivia[m.sender]) return
  let triviaData = global.db.data.trivia[m.sender]
  if (m.chat !== triviaData.chat) return
  if (m.text.toLowerCase().trim() === triviaData.answer) {
    clearTimeout(triviaData.timeout)
    let ganancia = Math.floor(Math.random() * 50) + 20
    if (!global.db.data.users[m.sender].deuda || global.db.data.users[m.sender].deuda === 0) {
      global.db.data.users[m.sender].coin = (Number(global.db.data.users[m.sender].coin) || 0) + ganancia
      await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRIVIA ───\n\n🍫 ¡Correcto! Ganaste ${ganancia} 🍪\n\nSaldo: ${global.db.data.users[m.sender].coin} 🍪`, m)
    } else {
      await conn.reply(m.chat, `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 ¡Correcto! Pero debes ${global.db.data.users[m.sender].deuda} 🍪\n🍨 Usa .work para pagar`, m)
    }
    delete global.db.data.trivia[m.sender]
  }
}

handler.help = ['trivia', 'ruleta', 'slots', 'work', 'robar', 'pagardeuda']
handler.tags = ['economy']
handler.command = ['trivia', 'ruleta', 'rlt', 'slots', 'slot', 'work', 'trabajar', 'robar', 'rob', 'pagardeuda', 'deuda']
handler.group = true
export default handler