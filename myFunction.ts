function myForEach<T>(item: T[], forEachFunc: (v: T) => void): void {
  item.reduce((a, v) => {
    forEachFunc(v)
    return undefined
  }, undefined)
}

myForEach(["a", "b", "c"], (v) => console.log(`forEach ${v}`))

function myFilter<T>(items: T[], filterFunc: (v: T) => boolean): T[] | [] {
  return items.reduce((a, v) => (filterFunc(v) ? [...a, v] : a), [] as T[])
}

myFilter([1, 2, 3, 4, 5, 6, 7], (v) => v % 2 === 0)

// return items.reduce((a:T[], v) => (filterFunc(v) ? [...a, v] : a), []);
// return items.reduce<T[]>((a, v) => (filterFunc(v) ? [...a, v] : a), []);
// return items.reduce((a, v) => (filterFunc(v) ? [...a, v] : a), [] as T[]);
// return items.reduce((a, v) => (filterFunc(v) ? [...a, v] : a), <T[]>[]);

function myMap<T, K>(items: T[], mapFunc: (v: T) => K): K[] {
  return items.reduce((a, v) => [...a, mapFunc(v)], [] as K[])
}

console.log(myMap([1, 2, 3, 4, 5, 6, 7], (v) => (v * 10).toString()))
