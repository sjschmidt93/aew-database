import { observable, action } from "mobx"
import _ from "lodash"
import AsyncStorage from "@react-native-community/async-storage"
import { Wrestler, TagTeam } from "./types"
import React from "react"
import { useLocalStore } from "mobx-react"

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

  @action
  addWrestler = async (wrestler: Wrestler) => {
    if (this.favoriteWrestlers.indexOf(wrestler.id) > -1) {
      console.warn("Attemped to favorite a wrestler that is already in favorites")
      return false
    }
    this.favoriteWrestlers.push(wrestler.id)
    await AsyncStorage.setItem(FAV_WRESTLERS_KEY, JSON.stringify(this.favoriteWrestlers))
    return true
  }

  addTagTeam = async(tagTeam: TagTeam) => {

  }

  @action
  removeWrestler = async (wrestler: Wrestler) => {
    const index = this.favoriteWrestlers.indexOf(wrestler.id)
    if (index > -1) {
      this.favoriteWrestlers.splice(index, 1)
    } else {
      console.warn("Attempted to unfavorite a wrestler that is not in favorites")
      return false
    }
    return true
  } 

  isFavorited = (wrestler: Wrestler) => this.favoriteWrestlers.includes(wrestler.id)
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