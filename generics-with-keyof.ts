function pluck<DataType, KeyType extends keyof DataType>(
  items: DataType[],
  key: KeyType
): DataType[KeyType][] {
  return items.map((item) => item[key])
}

const dogs = [
  { name: "Dark", age: 2 },
  { name: "Blue", age: 5 },
]

console.log(pluck(dogs, "age"))
console.log(pluck(dogs, "name"))

interface BaseEvent {
  time: number
  user: string
}

interface EventMap {
  addToCart: BaseEvent & { quantity: number; productId: string }
  chekout: BaseEvent
}

function sendEvent<Name extends keyof EventMap>(
  name: Name,
  data: EventMap[Name]
): void {
  console.log([name, data])
}

sendEvent("addToCart", { productId: "K", quantity: 1, time: 10, user: "Max" })
sendEvent("chekout", { user: "Pix", time: 10 })
