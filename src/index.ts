import Discord, { MessageEmbed } from 'discord.js'
import express from 'express'
import config from '../config.json'
import RiotController from './controllers/riot-controller'
import MonsterHunter from './controllers/mhw-controller'
import ResourcesManager from './services/resources-manager'

const server = express()
const client = new Discord.Client()
const resources = new ResourcesManager()

server.listen(config.PORT, () => {
  resources.buildArchieves()
  console.log(`Minos bot listening at port:${config.PORT}`)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('Gado em escala 24/7')
})

client.on('guildMemberAdd', member => {
  member.guild.systemChannel.send(`Bem vindo ${member.displayName}. Garçom, mais um gado na mesa ${member.guild.owner}`)
})

client.on('guildMemberRemove', member => {
  member.guild.systemChannel.send(`${member.displayName} pediu a conta e foi pra casa.`)
})

client.on('message', async msg => {
  const command = msg.content.split(' ')[0]
  let content = msg.content.replace(`${command} `, '')

  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }

  // Meme Toxic
  if (command === `${config.PREFIX}toxic`) {
    msg.reply(`${content} é teu pai seu arrombado...`)
  }

  // Discord Profile
  if (command === `${config.PREFIX}profile`) {
    const embed = new MessageEmbed()
      .setTitle(`Perfil de ${msg.member.nickname ? msg.member.nickname : msg.member.displayName}`)
      .setDescription(`Cargo: ${msg.member.roles.highest.toString()} \nAtualmente em: ${msg.member.presence.activities ? msg.member.presence.activities : 'nada'}`)
      .setThumbnail(msg.author.avatarURL())
      .setColor(msg.member.displayColor)
      .addField('Status:', msg.author.presence.status.toLocaleUpperCase())
      .setFooter(`Gado since ${msg.member.joinedAt.toLocaleDateString()}`)
    msg.channel.send(embed)
  }

  // Search a League of Legends Champ
  if (command === `${config.PREFIX}champ`) {
    content = content.charAt(0).toUpperCase() + content.slice(1)
    try {
      const embed: MessageEmbed = await RiotController.getChampion(content, msg)
      msg.channel.send(embed)
      console.log(`Message_Champ[${msg.author.username}]: Recuperado com sucesso!`)
    } catch (error) {
      console.error(error)
      msg.reply(`Erro ao procurar por ${content}`)
    }
  }

  // Search a League of Legends Match
  if (command === `${config.PREFIX}match`) {
    try {
      msg.channel.send('Buscando partida...')
      msg.channel.send('https://developer.riotgames.com/static/img/katarina.55a01cf0560a.gif')
      const embed: MessageEmbed = await RiotController.getMatch(content, msg)
      msg.channel.send(embed)
      console.log(`Message_Match[${msg.author.username}]: Recuperado com sucesso!`)
    } catch (error) {
      console.error(error)
      msg.reply(`Erro ao procurar partida de ${content}`)
    }
  }

  // Get all Monster Hunter creatures
  if (command === `${config.PREFIX}monsters`) {
    try {
      msg.channel.send('Montando Lista...')
      const embed: MessageEmbed = await MonsterHunter.Monsters(msg)
      msg.channel.send(embed)
      console.log(`Message_Monsters[${msg.author.username}]: Lista recuperada com sucesso!`)
    } catch (error) {
      console.error(error)
      msg.reply('Erro ao recuperar lista de monstros')
    }
  }
})

client.login(config.TOKEN)
