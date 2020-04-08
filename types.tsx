export type Wrestler = {
  id: number
  name: string
  nickname: string
  image_url: string
  wins: number
  losses: number
}

export type Match = {
  id: number
  winner: string | null
  winning_team: string[] | null
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

export type TagTeam = {
  name: string
  wrestlers: Wrestler[]
}

export enum MATCH_TYPE {
  Tag = "tag"
}