// https://github.com/Nobuyaki
// Jangan Hapus link githubnya bang :)

const fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `Reply photo/ഇതിനൊപ്പം ഫോട്ടോ അയയ്‌ക്കുക Caption ${usedPrefix}wait`
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`
  let img = await q.download()
  await m.reply('Searching Anime Titles...')
  let anime = `data:${mime};base64,${img.toString('base64')}`
  let response = await fetch('https://trace.moe/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: anime }),
  })
  if (!response.ok) throw 'ചിത്രം കണ്ടെത്തിയില്ല!'
  let result = await response.json()
  let { is_adult, title, title_chinese, title_romaji, episode, season, similarity, filename, at, tokenthumb, anilist_id } = result.docs[0]
  let link = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
  let nobuyaki = `
${similarity < 0.89 ? 'എനിക്ക് ഇതിനെക്കുറിച്ച് ആത്മവിശ്വാസം കുറവാണ്' : ''}

❏ ജാപ്പനീസ് ശീർഷകം : *${title}*
❏ അക്ഷരവിന്യാസം : *${title_romaji}*
❏ സമാനത : *${(similarity * 100).toFixed(1)}%*
❏ എപ്പിസോഡ് : *${episode.toString()}*
❏ ഇച്ചി : *${is_adult ? 'Yes' : 'No'}*
`.trim()
  conn.sendFile(m.chat, link, 'srcanime.mp4', `${nobuyaki}`, m)
}
handler.help = ['wait (caption|reply image)']
handler.tags = ['tools']
handler.command = /^(wait)$/i

module.exports = handler
