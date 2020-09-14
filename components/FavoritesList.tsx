import { useStore } from "../FavoritesStore"
import { sharedStyles } from "../styles"
import { Text, StyleSheet, View } from "react-native"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"
import { RosterMemberList } from "../screens/RosterScreen"
import { observer } from "mobx-react"

export const FavoritesList = observer(() => {
  const store = useStore()
  
  if (!store.hasFavorites) {
    return (
      <View style={sharedStyles.scrollViewContainer}>
        <Text style={sharedStyles.h2}>You do not have any favorites.</Text>
      </View>
    )
  }

  return (
    <>
      <Text style={sharedStyles.h2}>MEN</Text>
      <RosterMemberList members={store.favoriteMen} />
      <Text style={sharedStyles.h2}>WOMEN</Text>
      <RosterMemberList members={store.favoriteWomen} />
      <Text style={sharedStyles.h2}>TAG TEAMS</Text>
      <RosterMemberList members={store.favoriteTagTeams} />
    </>
  )
})

const styles = StyleSheet.create({
  container: {

  },
  scrollView: {

  }
})