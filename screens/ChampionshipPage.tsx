import { RootStackParamList } from "../App"
import { Text, View, Image, FlatList, TouchableOpacity, ScrollView } from "react-native"
import { RouteProp } from "@react-navigation/native"
import React from "react"
import { sharedStyles, colors } from "../styles"
import { formatDate } from "../utils"
import { Reign } from "../types"
import _ from "lodash"
import MatchList from "../components/MatchList"
import { navigateToRosterMember } from "./RosterScreen"
import { computed, observable } from "mobx"
import { AewApi } from "../aew_api"
import { observer } from "mobx-react"

type ChampionshipPageRouteProp = RouteProp<RootStackParamList, "Championship">
type Props = {
  route: ChampionshipPageRouteProp
}

export default function ChampionshipPage({ route }: Props) {
  const championship = route.params.championship
  return (
    <ScrollView style={sharedStyles.scrollViewContainer}>
      <Text style={[sharedStyles.h2, styles.header]}>Title History</Text>
      <FlatList
        data={championship.reigns}
        renderItem={({item}) => <ReignRow reign={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={sharedStyles.h2}>Match History</Text>
      <MatchList matches={championship.matches} />
    </ScrollView>
  )
}

const reignText = (reign: Reign) => (
  _.isNil(reign.end_date)
    ? `${formatDate(reign.start_date)} - present (${reign.length} days)`
    : `${formatDate(reign.start_date)} - ${formatDate(reign.end_date)} (${reign.length} days)`
)

interface ReignRowProps {
  reign: Reign
}

@observer
class ReignRow extends React.Component<ReignRowProps> {
  @computed
  get reign() {
    return this.props.reign
  }

  @observable
  fetchedCompetitor = null

  componentDidMount() {
    this.fetchCompetitor()
  }

  fetchCompetitor = async () => (
    this.fetchedCompetitor = this.reign.competitor_type === "Wrestler"
      ? await AewApi.fetchWrestler(this.reign.competitor.id)
      : await AewApi.fetchTagTeam(this.reign.competitor.id)
  )

  // TODO: cleanup use of TagTeam | Wrestler

  render() {
    return (
      <TouchableOpacity style={styles.reignRowContainer} onPress={navigateToRosterMember(this.fetchedCompetitor)}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Image source={{ uri: this.reign.competitor.image_url }} style={styles.image} />
          <View style={styles.reignInfoRowContainer}>
            <Text style={sharedStyles.h3}>{this.reign.competitor.name}</Text>
            <Text style={sharedStyles.body}>{reignText(this.reign)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
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
  },
  header: {
    paddingBottom: 10
  }
}