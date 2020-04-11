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
  match_type: MATCH_TYPE
}

export type Event = {
  name: string
  date: Date
  city: string
  venue: string
}


export enum MATCH_TYPE {
  Tag = "tag"
}