import { useStore } from "../FavoritesStore"
import { sharedStyles } from "../styles"
import { Text, StyleSheet, View } from "react-native"
import React from "react"
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
      {store.hasFavoriteMen && (
        <>
          <Text style={styles.text}>MEN</Text>
          <RosterMemberList members={store.favoriteMen} />
        </>
      )}
      {store.hasFavoriteWomen && (
        <>
          <Text style={styles.text}>WOMEN</Text>
          <RosterMemberList members={store.favoriteWomen} />
        </>
      )}
      {store.hasFavoriteTagTeams && (
        <>
          <Text style={styles.text}>TAG TEAMS</Text>
          <RosterMemberList members={store.favoriteTagTeams} />
        </>
      )}
    </>
  )
})

const styles = StyleSheet.create({
  text: {
    ...sharedStyles.h2,
    paddingBottom: 10
  }
})
