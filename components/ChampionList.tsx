import { observer } from "mobx-react"
import React from "react"
import { observable, computed } from "mobx"
import { AewApi } from "../aew_api"
import { View, Image, Text, StyleSheet, FlatList } from "react-native"
import { colors, sharedStyles } from "../styles"
import { formatDate } from "../utils"
import { Championship } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"
import _ from "lodash"
import { navigate } from "../RootNavigation"

@observer
export default class ChampionList extends React.Component {
  @observable
  reigns = []

  @observable
  championships = []

  componentDidMount() {
    this.fetchChampionships()
  }

  fetchChampionships = async () => this.championships = await AewApi.fetchChampionships()

  render() {
    return (
      <FlatList
        data={this.championships}
        renderItem={({item}) => <ChampionRow championship={item} />}
        contentContainerStyle={sharedStyles.listContainer}
      />
    )
  }
}

function ChampionRow({ championship }: { championship: Championship }) {
  const reign = championship.reigns.find(reign => _.isNil(reign.end_date))
  return !_.isNil(reign) && (
    <TouchableOpacity style={styles.championRowContainer} onPress={() => navigate("Championship", { championship })}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Image source={{ uri: reign.competitor.image_url }} style={styles.image} />
        <View style={styles.championInfoContainer}>
          <Text style={sharedStyles.h3}>{reign.competitor.name}</Text>
          <Text style={[sharedStyles.h3, { color: colors.silver }]}>{championship.name}</Text>
          <Text style={sharedStyles.body}>Reign began {formatDate(reign.start_date)} ({reign.length} days)</Text>
        </View>
      </View>
    </TouchableOpacity>
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
