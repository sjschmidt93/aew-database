export type Wrestler = {
  id: number
  name: string
  height: number
  weight: number
  nickname: string
  image_url: string
  num_wins: number
  num_losses: number
  division: string
  reigns: Reign[]
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
  type: MATCH_TYPE
}

export enum MATCH_TYPE {
  SINGLES = "singles",
  TAG = "tag"
}

export type Event = {
  id: number
  name: string
  date: Date
  city: string
  venue: string
  image_url: string
  program: "dynamite" | "ppv" | "dark"
}

export type Reign = {
  start_date: Date
  end_date: Date
  length: number
  championship: Championship
}

export type Championship = {
  name: string
  image_url: string
}
