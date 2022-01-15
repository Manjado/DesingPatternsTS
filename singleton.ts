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

      static instance: InMemoryDataBase = new InMemoryDataBase()

      public set(newValue: T): void {
        this.db[newValue.id] = newValue
      }

      public get(id: string): T | undefined {
        return this.db[id]
      }
    }

    // const db = new InMemoryDataBase()
    // return db
    return InMemoryDataBase
  }

  const PokemonDB = createDatabase<Pokemon>()
  PokemonDB.instance.set({
    id: "Blubasuer",
    attack: 50,
    defense: 10,
  })

  console.log(PokemonDB.instance.get("Blubasuer"))
}
