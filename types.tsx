export type Wrestler = {
  id: number
  name: string
  nickname: string
  image_url: string
  wins: number
  losses: number
  division: string
}

export type TagTeam = {
  name: string
  nickname: string
  image_url: string
  wins: number
  losses: number
  wrestlers: Wrestler[]
}


export type Match = {
  wrestlers: Wrestler[]
  tag_teams: TagTeam[]
  event: Event
  winner: string
  type: "singles" | "tag"
}

export type Event = {
  name: string
  date: Date
  city: string
  venue: string
}
