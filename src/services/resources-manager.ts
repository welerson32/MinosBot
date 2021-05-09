import fs from 'fs'
import axios from 'axios'

export class ResourcesManager {
  constructor () {
    this.buildFolder()
  }

  async createChampions (): Promise<void> {
    const champs: any = await (await axios.get('http://ddragon.leagueoflegends.com/cdn/10.23.1/data/pt_BR/champion.json')).data
    fs.writeFileSync('./src/Resources/Champions.json', `${JSON.stringify(champs.data)}`)
  }

  async createItems (): Promise<void> {
    const items: any = await (await axios.get('http://ddragon.leagueoflegends.com/cdn/10.23.1/data/pt_BR/item.json')).data
    fs.writeFileSync('./src/Resources/Items.json', `${JSON.stringify(items.data)}`)
  }

  async createSummonersSpell (): Promise<void> {
    const spells: any = await (await axios.get('http://ddragon.leagueoflegends.com/cdn/10.23.1/data/pt_BR/summoner.json')).data
    fs.writeFileSync('./src/Resources/SummonersSpell.json', `${JSON.stringify(spells.data)}`)
  }

  async createRunes (): Promise<void> {
    const runes: any = await (await axios.get('http://ddragon.leagueoflegends.com/cdn/10.23.1/data/pt_BR/runesReforged.json')).data
    fs.writeFileSync('./src/Resources/Runes.json', `${JSON.stringify(runes)}`)
  }

  async createMaps (): Promise<void> {
    const maps: any = await (await axios.get('http://ddragon.leagueoflegends.com/cdn/10.23.1/data/pt_BR/map.json')).data
    fs.writeFileSync('./src/Resources/Maps.json', `${JSON.stringify(maps.data)}`)
  }

  async createGameMode (): Promise<void> {
    const gmode: any = await (await axios.get('http://static.developer.riotgames.com/docs/lol/gameModes.json')).data
    fs.writeFileSync('./src/Resources/GameMode.json', `${JSON.stringify(gmode)}`)
  }

  async createGameType (): Promise<void> {
    const gtype: any = await (await axios.get('http://static.developer.riotgames.com/docs/lol/gameTypes.json')).data
    fs.writeFileSync('./src/Resources/GameType.json', `${JSON.stringify(gtype)}`)
  }

  async createQueue (): Promise<void> {
    const queue: any = await (await axios.get('http://static.developer.riotgames.com/docs/lol/queues.json')).data
    fs.writeFileSync('./src/Resources/Queue.json', `${JSON.stringify(queue)}`)
  }

  buildFolder (): void {
    if (!fs.existsSync('./src/Resources')) {
      fs.mkdirSync('./src/Resources')
    }
  }

  buildArchieves (): void {
    this.createChampions()
    this.createItems()
    this.createMaps()
    this.createRunes()
    this.createSummonersSpell()
    this.createGameMode()
    this.createGameType()
    this.createQueue()
  }
}

export default ResourcesManager
