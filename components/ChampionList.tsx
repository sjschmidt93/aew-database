import { observer } from "mobx-react"
import React from "react"
import { observable } from "mobx"
import { AewApi } from "../aew_api"
import { View, Image, Text, StyleSheet, FlatList } from "react-native"
import { colors, sharedStyles } from "../styles"
import { formatDate } from "../utils"
import { Reign } from "../types"

@observer
export default class ChampionList extends React.Component {
  @observable
  reigns = []

  componentDidMount() {
    this.fetchActiveReigns()
  }

  fetchActiveReigns = async () => this.reigns = await AewApi.fetchActiveReigns()

  render() {
    return (
      <FlatList
        data={this.reigns}
        renderItem={({item}) => <ChampionRow reign={item} />}
        contentContainerStyle={sharedStyles.listContainer}
      />
    )
  }
}

function ChampionRow({ reign }: { reign: Reign }) {
  return (
    <View style={styles.championRowContainer}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={{ uri: reign.competitor.image_url }} style={styles.image} />
        <View style={styles.championInfoContainer}>
          <Text style={sharedStyles.h3}>{reign.competitor.name}</Text>
          <Text style={[sharedStyles.h3, { color: colors.silver }]}>{reign.championship.name}</Text>
          <Text style={sharedStyles.body}>Reign began {formatDate(reign.start_date)} ({reign.length} days)</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  championRowContainer: {
    backgroundColor: colors.graphite,
    marginBottom: 10
  },
  image: {
    height: 85,
    width: 85
  },
  championInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
})
