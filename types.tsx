import WrestlerScreen from "./screens/WrestlerScreen"

export type Wrestler = {
  id: number
  name: string
  height: number
  weight: number
  nickname: string
  hometown: string
  image_url: string
  num_wins: number
  num_losses: number
  division: DIVISION
  reigns: Reign[]
}

export enum Division {
  MENS = "mens",
  WOMENS = "womens"
}

export type TagTeam = {
  id: number
  name: string
  nickname: string
  image_url: string
  wins: number
  losses: number
  wrestlers: Wrestler[]
  is_official: boolean
  sub_teams: TagTeam[]
}

export type Match = {
  wrestlers: Wrestler[]
  tag_teams: TagTeam[]
  event: Event
  winner: string
  type: MatchType
}

export enum MatchType {
  SINGLES = "singles",
  TAG = "tag"
}

export type Event = {
  id: number
  name: string
  date: string
  city: string
  venue: string
  image_url: string
  program: "dynamite" | "ppv" | "dark"
}

export type Reign = {
  start_date: string
  end_date: string
  length: number
  championship: Championship
  competitor_type: "Wrestler" | "TagTeam"
  competitor: Competitor
}

type Competitor = {
  id: number
  name: string
  image_url: string
}

export type Championship = {
  name: string
  image_url: string
  reigns: Reign[]
  matches: Match[]
}
