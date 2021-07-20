const { MessageType } = require("@adiwajshing/baileys")

async function handler(m, { command }) {
    command = command.toLowerCase()
    this.anonymous = this.anonymous ? this.anonymous : {}
    switch (command) {
        case 'next':
        case 'leave': {
            let room = Object.values(this.anonymous).find(room => room.check(m.sender))
            if (!room) throw 'നിങ്ങൾ അജ്ഞാത ചാറ്റിലല്ല'
            m.reply('Ok')
            let other = room.other(m.sender)
            if (other) this.sendMessage(other, 'പങ്കാളികൾ ചാറ്റ് ഉപേക്ഷിക്കുന്നു', MessageType.text)
            delete this.anonymous[room.id]
            if (command === 'leave') break
        }
        case 'start': {
            if (Object.values(this.anonymous).find(room => room.check(m.sender))) throw 'നിങ്ങൾ ഇപ്പോഴും അജ്ഞാത ചാറ്റിലാണ്'
            let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
            if (room) {
                this.sendMessage(room.a, 'ഒരു പങ്കാളിയെ കണ്ടെത്തുക!', MessageType.text)
                room.b = m.sender
                room.state = 'CHATTING'
                m.reply('ഒരു പങ്കാളിയെ കണ്ടെത്തുക!')
            } else {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: m.sender,
                    b: '',
                    state: 'WAITING',
                    check: function (who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function (who = '') {
                        return who === this.a ? this.b : who === this.b ? this.a : ''
                    },
                }
                m.reply('പങ്കാളിക്കായി കാത്തിരിക്കുന്നു...')
            }
            break
        }
    }
}
handler.help = ['start', 'leave', 'next']
handler.tags = 'anonymous'

handler.command = ['start', 'leave', 'next']
handler.private = true

module.exports = handler
