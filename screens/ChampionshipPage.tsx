import { RootStackParamList } from "../App"
import { Text, View, Image, FlatList, TouchableOpacity, ScrollView } from "react-native"
import { RouteProp } from "@react-navigation/native"
import React from "react"
import { sharedStyles, colors } from "../styles"
import { formatDate } from "../utils"
import { Reign } from "../types"
import _ from "lodash"

type ChampionshipPageRouteProp = RouteProp<RootStackParamList, "Championship">
type Props = {
  route: ChampionshipPageRouteProp
}

export default function ChampionshipPage({ route }: Props) {
  const championship = route.params.championship
  return (
    <ScrollView style={sharedStyles.scrollViewContainer}>
      <Text style={sharedStyles.h2}>Champion History</Text>
      <FlatList
        //contentContainerStyle={sharedStyles.scrollViewContainer}
        data={championship.reigns}
        renderItem={({item}) => <ReignRow reign={item} />}
      />
      {/* <Text style={sharedStyles.h2}>Match History</Text> */}
    </ScrollView>
  )
}

const reignText = (reign: Reign) => (
  _.isNil(reign.end_date)
    ? `${formatDate(reign.start_date)} - present (${reign.length} days)`
    : `${formatDate(reign.start_date)} - ${formatDate(reign.end_date)} (${reign.length} days)`
)

function ReignRow({ reign }: { reign: Reign }) {
  return (
    <TouchableOpacity style={styles.reignRowContainer} onPress={() => null}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={{ uri: reign.competitor.image_url }} style={styles.image} />
        <View style={styles.reignInfoRowContainer}>
          <Text style={sharedStyles.h3}>{reign.competitor.name}</Text>
          <Text style={sharedStyles.body}>{reignText(reign)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = {
  reignRowContainer: {
    marginBottom: 10,
    backgroundColor: colors.graphite
  },
  reignInfoRowContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  image: {
    height: 85,
    width: 85
  }
}