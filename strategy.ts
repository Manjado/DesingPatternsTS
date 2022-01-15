{
  type Lisener<EventType> = (ev: EventType) => void

  function createObserver<EventType>(): {
    subscribe: (listener: Lisener<EventType>) => () => void
    publish: (event: EventType) => void
  } {
    let listeners: Lisener<EventType>[] = []
    return {
      subscribe: (listener: Lisener<EventType>): (() => void) => {
        listeners.push(listener)
        return () => {
          listeners = listeners.filter((l) => l !== listener)
        }
      },
      publish: (event: EventType) => {
        listeners.forEach((l) => l(event))
      },
    }
  }

  interface BeforeSetEvent<T> {
    value: T
    newValue: T
  }

  interface AfterSetEvent<T> {
    value: T
  }

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
    onBeforeAdd(listener: Lisener<BeforeSetEvent<T>>): () => void
    onAfterAdd(listener: Lisener<AfterSetEvent<T>>): () => void

    visit(visitor: (item: T) => void): void
    selectBest(scoreStrategy: (item: T) => number): T | undefined
  }

  function createDatabase<T extends BaseRecord>() {
    class InMemoryDataBase implements Database<T> {
      private db: Record<string, T> = {}

      static instance: InMemoryDataBase = new InMemoryDataBase()

      private beforeAddListeners = createObserver<BeforeSetEvent<T>>()
      private afterAddListeners = createObserver<AfterSetEvent<T>>()

      public set(newValue: T): void {
        this.beforeAddListeners.publish({
          newValue,
          value: this.db[newValue.id],
        })
        this.db[newValue.id] = newValue

        this.afterAddListeners.publish({
          value: newValue,
        })
      }

      public get(id: string): T | undefined {
        return this.db[id]
      }

      onBeforeAdd(listener: Lisener<BeforeSetEvent<T>>): () => void {
        return this.beforeAddListeners.subscribe(listener)
      }
      onAfterAdd(listener: Lisener<AfterSetEvent<T>>): () => void {
        return this.afterAddListeners.subscribe(listener)
      }

      visit(visitor: (item: T) => void): void {
        Object.values(this.db).forEach(visitor)
      }

      //Strategy
      selectBest(scoreStrategy: (item: T) => number): T | undefined {
        const found: {
          max: number
          item: T | undefined
        } = {
          max: 0,
          item: undefined,
        }

        Object.values(this.db).reduce((f, item) => {
          const score = scoreStrategy(item)

          if (score > f.max) {
            f.max = score
            f.item = item
          }
          return f
        }, found)

        return found.item
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
    defense: 50,
  })

  PokemonDB.instance.onAfterAdd(({ value }) => {
    console.log("after value: ", value)
  })

  PokemonDB.instance.set({
    id: "Pika",
    attack: 100,
    defense: 20,
  })

  console.log(PokemonDB.instance.get("Blubasuer"))

  PokemonDB.instance.visit((item) => console.log(item.id))

  //strategy

  const bestDefensive = PokemonDB.instance.selectBest(({ defense }) => defense)
  const bestAttack = PokemonDB.instance.selectBest(({ attack }) => attack)

  console.log("Best attack:", bestAttack)
  console.log("Best bestDefensive:", bestDefensive)
}
