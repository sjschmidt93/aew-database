import { observable, action } from "mobx"
import _ from "lodash"
import AsyncStorage from "@react-native-community/async-storage"
import { Wrestler, TagTeam } from "./types"
import React from "react"

const FAV_WRESTLERS_KEY = "@fav_wrestlers_key"
const FAV_TAG_TEAMS_KEY  = "@fav_tag_teams_key"

class FavoritesStore {
  constructor() {
    this.fetchFavoriteWrestlers()
    this.fetchFavoriteTagTeams()
  }

  favoriteWrestlers: number[] = observable([])
  
  observe

  @observable
  rerenderHack = false

  @observable
  favoriteTagTeams = []

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
    this.favoriteWrestlers = [...this.favoriteWrestlers, wrestler.id]
    await AsyncStorage.setItem(FAV_WRESTLERS_KEY, JSON.stringify(this.favoriteWrestlers))
    console.log(this.favoriteWrestlers)
    this.rerenderHack = !this.rerenderHack
  }

  addTagTeam = async(tagTeam: TagTeam) => {

  }

  @action
  removeWrestler = async (wrestler: Wrestler) => {
    const index = this.favoriteWrestlers.indexOf(wrestler.id)
    if (index > -1) {
      this.favoriteWrestlers.splice(index, 1)
    }
    console.log(this.favoriteWrestlers)
    this.rerenderHack = !this.rerenderHack
  } 

  isFavorited = (wrestler: Wrestler) => this.favoriteWrestlers.includes(wrestler.id)
}

const storeContext = React.createContext(new FavoritesStore())
export const useStore = () => React.useContext(storeContext)