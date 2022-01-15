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

  PokemonDB.instance.onAfterAdd(({ value }) => {
    console.log("after value: ", value)
  })

  PokemonDB.instance.set({
    id: "Pika",
    attack: 100,
    defense: 120,
  })

  console.log(PokemonDB.instance.get("Blubasuer"))
}
