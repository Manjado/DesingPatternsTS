{
  interface Pokemon {
    id: string
    attack: number
    defense: number
  }

  interface BaseRecord {
    id: string
  }

  interface Database<T extends BaseRecord> {
    set(newVlue: T): void
    get(id: string): T | undefined
  }

  function createDatabase<T extends BaseRecord>() {
    class InMemoryDataBase implements Database<T> {
      private db: Record<string, T> = {}

      public set(newValue: T): void {
        this.db[newValue.id] = newValue
      }

      public get(id: string): T | undefined {
        return this.db[id]
      }
    }

    return InMemoryDataBase
  }

  const PokemonDB = createDatabase<Pokemon>()
  const pokemonDB = new PokemonDB()
  pokemonDB.set({
    id: "Blubasuer",
    attack: 50,
    defense: 10,
  })

  console.log(pokemonDB.get("Blubasuer"))
}
