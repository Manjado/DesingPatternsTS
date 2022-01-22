interface Rank<RankItem> {
  item: RankItem
  rank: number
}

function ranker<RankItem>(
  items: RankItem[],
  rank: (v: RankItem) => number
): RankItem[] {
  const ranks: Rank<RankItem>[] = items.map((item) => ({
    item,
    rank: rank(item),
  }))

  ranks.sort((a, b) => a.rank - b.rank)

  return ranks.map((rank) => rank.item)
}

interface Pokemon {
  name: string
  hp: number
}

const pokemon: Pokemon[] = [
  {
    name: "Bulbasur",
    hp: 20,
  },
  {
    name: "Megasaur",
    hp: 5,
  },
]

const ranks = ranker(pokemon, ({ hp }) => hp)
