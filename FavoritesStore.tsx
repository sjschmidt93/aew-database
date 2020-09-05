import { observable, action } from "mobx"
import _ from "lodash"
import AsyncStorage from "@react-native-community/async-storage"
import { Wrestler, TagTeam } from "./types"
import React from "react"
import { useLocalStore } from "mobx-react"
import { RosterMember } from "./screens/RosterScreen"
import { isTagTeam } from "./components/MatchList"

const FAV_WRESTLERS_KEY = "@fav_wrestlers_key"
const FAV_TAG_TEAMS_KEY  = "@fav_tag_teams_key"

class FavoritesStore {
  constructor() {
    this.fetchFavoriteWrestlers()
    this.fetchFavoriteTagTeams()
  }

  @observable
  favoriteWrestlers: number[] = []

  @observable
  favoriteTagTeams: number[] = []

  fetchFavoriteWrestlers = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAV_WRESTLERS_KEY)
      this.favoriteWrestlers = !_.isNil(jsonValue) ? JSON.parse(jsonValue) : []
    } catch(e) {
      console.log("There was an error fetching favorite wrestlers.", e)
    }
  }

  fetchFavoriteTagTeams = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAV_TAG_TEAMS_KEY)
      this.favoriteTagTeams = !_.isNil(jsonValue) ? JSON.parse(jsonValue) : []
    } catch(e) {
      console.log("There was an error fetching favorite tag teams.", e)
    }
  }

  modifyMember = (member: RosterMember) => {
    return isTagTeam(member)
      ? this.isTagTeamFavorited(member)
        ? this.removeTagTeam(member)
        : this.addTagTeam(member)
      : this.isWrestlerFavorited(member)
        ? this.removeWrestler(member)
        : this.addWrestler(member)
  }

  @action
  addWrestler = async (wrestler: Wrestler) => {
    if (this.isWrestlerFavorited(wrestler)) {
      console.warn("Attemped to favorite a wrestler that is already in favorites")
      return false
    }
    
    this.favoriteWrestlers.push(wrestler.id)
    await this.saveWrestlers()
    return true
  }

  @action
  removeWrestler = async (wrestler: Wrestler) => {
    const index = this.favoriteWrestlers.indexOf(wrestler.id)
    if (index > -1) {
      this.favoriteWrestlers.splice(index, 1)
      await this.saveWrestlers()
      return true
    }

    console.warn("Attempted to unfavorite a wrestler that is not in favorites")
    return false
  } 

  @action
  addTagTeam = async (tagTeam: TagTeam) => {
    if (this.isTagTeamFavorited(tagTeam)) {
      console.warn("Attemped to favorite a tag team that is already in favorites")
      return false
    }

    this.favoriteTagTeams.push(tagTeam.id)
    await this.saveTagTeams()
    return true
  }

  @action
  removeTagTeam = async (tagTeam: Wrestler) => {
    const index = this.favoriteTagTeams.indexOf(tagTeam.id)
    if (index > -1) {
      this.favoriteTagTeams.splice(index, 1)
      await this.saveTagTeams()
      return true
    }

    console.warn("Attempted to unfavorite a tag team that is not in favorites")
    return false
  }

  saveWrestlers = async () => await AsyncStorage.setItem(FAV_WRESTLERS_KEY, JSON.stringify(this.favoriteWrestlers))
  saveTagTeams = async () => await AsyncStorage.setItem(FAV_TAG_TEAMS_KEY, JSON.stringify(this.favoriteTagTeams))

  isFavorited = (member: RosterMember) => isTagTeam(member) ? this.isTagTeamFavorited(member) : this.isWrestlerFavorited(member)

  isWrestlerFavorited = (wrestler: Wrestler) => this.favoriteWrestlers.includes(wrestler.id)
  isTagTeamFavorited = (tagTeam: TagTeam) => this.favoriteTagTeams.includes(tagTeam.id)
}

export const storeContext = React.createContext<FavoritesStore | null>(null)

export const StoreProvider = ({ children }: any) => {
  const store = useLocalStore(() => new FavoritesStore())
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}
