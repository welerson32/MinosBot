import { Message, MessageEmbed } from 'discord.js'
import axios, { AxiosRequestConfig } from 'axios'
import maps from '../Resources/Maps.json'
import champs from '../Resources/Champions.json'
import items from '../Resources/Items.json'
import runes from '../Resources/Runes.json'
import spells from '../Resources/SummonersSpell.json'
import gmodes from '../Resources/GameMode.json'
import gtypes from '../Resources/GameType.json'
import queues from '../Resources/Queue.json'
import { parse } from 'path'

export class RiotController {
  static getOptions (): AxiosRequestConfig {
    return {
      headers: {
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': 'RGAPI-b2141635-ec69-4ace-927c-4f5b0743cc6d'
      }
    }
  }

  static async getChampion (champ: string, msg: Message) {
    const body: any = await (await axios.get(`https://ddragon.leagueoflegends.com/cdn/10.22.1/data/pt_BR/champion/${champ}.json`)).data

    const skins = body.data[`${champ}`].skins
    const arraySkins = []
    const arraySkins2 = []
    const arraySkins3 = []
    const arraySkins4 = []
    const skinFields = []
    for (const skin of skins) {
      if (skin.name !== 'default') {
        if (arraySkins.length !== 5) {
          arraySkins.push(`\n[${skin.name}](http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${skin.num}.jpg)`)
        } else if (arraySkins.length === 5 && arraySkins2.length !== 5) {
          arraySkins2.push(`\n[${skin.name}](http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${skin.num}.jpg)`)
        } else if (arraySkins2.length === 5 && arraySkins3.length !== 5) {
          arraySkins3.push(`\n[${skin.name}](http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${skin.num}.jpg)`)
        } else if (arraySkins3.length === 5 && arraySkins4.length !== 5) {
          arraySkins4.push(`\n[${skin.name}](http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${skin.num}.jpg)`)
        }
      }
    }
    if (arraySkins.length !== 0) {
      skinFields.push({ name: 'Skins', value: `${arraySkins}`, inline: true })
    }
    if (arraySkins2.length !== 0) {
      skinFields.push({ name: '\u200B', value: `${arraySkins2}`, inline: true })
    }
    if (arraySkins3.length !== 0) {
      skinFields.push({ name: '\u200B', value: `${arraySkins3}`, inline: true })
    }
    if (arraySkins4.length !== 0) {
      skinFields.push({ name: '\u200B', value: `${arraySkins4}`, inline: true })
    }

    const arrayTags = []
    for (const tag of body.data[`${champ}`].tags) {
      arrayTags.push(` ${tag}`)
    }

    const embed: MessageEmbed = new MessageEmbed()
      .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.23.1/img/champion/${champ}.png`)
      .setColor(msg.member.displayColor)
      .setTitle(`${body.data[`${champ}`].name}`)
      .setDescription(`${body.data[`${champ}`].title.charAt(0).toUpperCase() + body.data[`${champ}`].title.slice(1)}`)
      .addField('Status', `Ataque: ${body.data[`${champ}`].info.attack} | Defesa: ${body.data[`${champ}`].info.defense} | Magia: ${body.data[`${champ}`].info.magic} | Dficuldade: ${body.data[`${champ}`].info.difficulty}`)
      .addField('\u200B', '\u200B')
      .addFields(skinFields)
      .setURL(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_0.jpg`)
      .setFooter(`Tags: ${arrayTags}`)
    return embed
  }

  static async getMatch (summon: string, msg: Message) {
    const summonData: any = await (await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summon}`, this.getOptions())).data

    const matchData: any = await (await axios.get(`https://br1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonData.id}`, this.getOptions())).data

    console.log(matchData)

    const summoner = matchData.participants.filter(r => r.summonerName === `${summon}`)
    const queue = queues.filter(r => r.queueId === matchData.gameQueueConfigId)
    const players100 = matchData.participants.filter(r => r.teamId === 100)
    const players200 = matchData.participants.filter(r => r.teamId === 200)
    let team100 = ''
    let team200 = ''

    const champsValues = Object.values(champs)
    const spellsValues = Object.values(spells)

    for (const player of players100) {
      const rank: any = await (await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.summonerId}`, this.getOptions())).data
      const champ = champsValues.filter(r => r.key === player.championId.toString())
      const spell1 = spellsValues.filter(r => r.key === player.spell1Id.toString())
      const spell2 = spellsValues.filter(r => r.key === player.spell2Id.toString())
      const rune = runes.filter(r => r.id === player.perks.perkStyle)
      team100 = team100 + player.summonerName + ': \n**Champ:** ' + champ[0].name + '\n**Rune:** ' + rune[0].name + '\n**Spells:** ' + spell1[0].name + ', ' + spell2[0].name + '\n**Flex:** ' + rank[0]?.tier + ' ' + rank[0]?.rank + '\n**Solo:** ' + rank[1]?.tier + ' ' + rank[1]?.rank + '\n\n'
    }

    for (const player of players200) {
      const rank: any = await (await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.summonerId}`, this.getOptions())).data
      const champ = champsValues.filter(r => r.key === player.championId.toString())
      const spell1 = spellsValues.filter(r => r.key === player.spell1Id.toString())
      const spell2 = spellsValues.filter(r => r.key === player.spell2Id.toString())
      const rune = runes.filter(r => r.id === player.perks.perkStyle)
      team200 = team200 + player.summonerName + ': \n**Champ:** ' + champ[0].name + '\n**Rune:** ' + rune[0].name + '\n**Spells:** ' + spell1[0].name + ', ' + spell2[0].name + '\n**Flex:** ' + rank[0]?.tier + ' ' + rank[0]?.rank + '\n**Solo:** ' + rank[1]?.tier + ' ' + rank[1]?.rank + '\n\n'
    }

    const embed: MessageEmbed = new MessageEmbed()
      .setColor(msg.member.displayColor)
      .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.23.1/img/profileicon/${summoner[0].profileIconId}.png`)
      .setTitle(`Partida de ${summon}`)
      .setDescription(`Jogando ${queue[0].description} em ${maps[`${matchData.mapId}`].MapName}`)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Red', value: `${team100}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Blue', value: `${team200}`, inline: true }
      )

    return embed
  }
}

export default RiotController
