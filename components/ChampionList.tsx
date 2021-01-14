import React, { useContext } from "react"
import { View, Image, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { colors, sharedStyles } from "../styles"
import { formatDate } from "../utils"
import { Championship } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"
import _ from "lodash"
import { navigate } from "../RootNavigation"
import DataContext from "../DataContext"

const ChampionshipList = () => {
  const { championships } = useContext(DataContext)

  return _.isEmpty(championships)
    ? <ActivityIndicator size="large" color={colors.aewYellow} />
    : (
      <FlatList
        data={championships}
        renderItem={({item}) => <ChampionRow championship={item} />}
        contentContainerStyle={sharedStyles.listContainer}
        keyExtractor={(item, index) => index.toString()}
      />
    )
}

function ChampionRow({ championship }: { championship: Championship }) {
  const reign = championship.reigns.find(reign => _.isNil(reign.end_date))
  return !_.isNil(reign) && (
    <TouchableOpacity style={styles.championRowContainer} onPress={() => navigate("Championship", { championship })}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={{ uri: reign.competitor.image_url }} style={styles.image} resizeMode="stretch" />
        <View style={styles.championInfoContainer}>
          <Text style={sharedStyles.h3}>{reign.competitor.name}</Text>
          <Text style={[sharedStyles.h3, styles.championshipName]}>{championship.name}</Text>
          <Text style={sharedStyles.body}>Reign began {formatDate(reign.start_date)} ({reign.length} days)</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  championRowContainer: {
    backgroundColor: colors.graphite,
    marginBottom: 10,
    minHeight: 85
  },
  image: {
    height: "100%",
    aspectRatio: 1
  },
  championInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: 10,
    paddingVertical: 10
  },
  championshipName: {
    color: colors.silver,
    textAlign: "center"
  }
})

export default ChampionshipList
