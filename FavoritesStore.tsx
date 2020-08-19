import { observable } from "mobx"
import _ from "lodash"
import AsyncStorage from "@react-native-community/async-storage"
import { Wrestler, TagTeam } from "./types"

const FAV_WRESTLERS_KEY = "@fav_wrestlers_key"
const FAV_TAG_TEAMS_KEY  = "@fav_tag_teams_key"

export class FavoritesStore {

  constructor() {
    this.fetchFavoriteWrestlers()
    this.fetchFavoriteTagTeams()
  }

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

  addWrestler = async (wrestler: Wrestler) => {

  }

  addTagTeam = async(tagTeam: TagTeam) => {

  }

  @observable
  favoriteWrestlers = []

  @observable
  favoriteTagTeams = []

  
  // fetchFavorites = async () => {

  // }

}

const favoritesStores = new FavoritesStore()
export default favoritesStores