import axios from 'axios'
import { Message, MessageEmbed } from 'discord.js'

export class MonsterHunter {
  static async Monsters (msg:Message) {
    const monsters = await (await axios.get('https://mhw-db.com/monsters')).data
    const array = []

    for (const monster of monsters) {
      const mons = { name: '\u200B', value: `${monster.id}: ${monster.name}`, inline: true }
      array.push(mons)
    }

    const embed = new MessageEmbed()
      .setTitle('Monster Index')
      .setColor(msg.member.displayColor)
      .addFields(array)

    return embed
  }
}

export default MonsterHunter
