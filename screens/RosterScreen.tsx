import React from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { observable, computed } from 'mobx'
import { observer } from "mobx-react"
import { sharedStyles, colors } from "../styles"
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { navigate } from "../RootNavigation"
import { Wrestler, TagTeam } from "../types"
import Picker from "../components/Picker"
import { AewApi } from "../aew_api"
import _ from "lodash"

export interface NavigationProp {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const ROSTER_ROW_HEIGHT = 75

type RosterMember = Wrestler | TagTeam

@observer
export default class RosterScreen extends React.Component<NavigationProp> {
  @observable
  wrestlers: Wrestler[] = []

  @observable
  tagTeams: TagTeam[] = []

  @observable
  selectedPickerIndex = 0

  @computed
  get pickerData(): string[] {
    return [
      "ALL",
      "MEN'S",
      "WOMEN'S",
      "TAG TEAMS",
      //"STABLES"
    ]
  }

  @computed
  get dataArr(): RosterMember[][] {
    return [
      this.wrestlers,
      this.mensDivision,
      this.womensDivision,
      this.tagTeams,
      //[]
    ]
  }

  @computed
  get mensDivision() {
    return this.wrestlers.filter(wrestler => wrestler.division === "mens")
  }

  @computed
  get womensDivision() {
    return this.wrestlers.filter(wrestler => wrestler.division === "womens")
  }

  componentDidMount() {
    this.fetchWrestlers()
    this.fetchTagTeams()
  }

  onPickerSelect = (index: number) => this.selectedPickerIndex = index

  fetchWrestlers = async () => this.wrestlers = await AewApi.fetchWrestlers()
  fetchTagTeams = async () => this.tagTeams = await AewApi.fetchOfficialTagTeams()

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <Picker options={this.pickerData} selectedIndex={this.selectedPickerIndex} onSelect={this.onPickerSelect} />
        <ScrollView style={sharedStyles.scrollViewContainer}>
          <FlatList
            renderItem={({item}) => <RosterRow member={item} />}
            data={this.dataArr[this.selectedPickerIndex]}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          />
        </ScrollView>
      </>
    )
  }
}

function RosterRow({ member }: { member: RosterMember }) {
  return (
    <View style={styles.wrestlerOuterContainer}>
      <Image style={styles.image} source={{ uri: member.image_url }} />
      <TouchableOpacity
        style={styles.wrestlerContainer}
        onPress={() => navigate('Wrestler', { wrestler: member }) }
      >
        <Text style={sharedStyles.h2}>{member.name}</Text>
        { !_.isNil(member.nickname) && <Text style={[sharedStyles.h3, { color: colors.silver }]}>{member.nickname}</Text> }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: ROSTER_ROW_HEIGHT,
    width: ROSTER_ROW_HEIGHT
  },
  wrestlerOuterContainer: {
    flexDirection: 'row',
    height: ROSTER_ROW_HEIGHT,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.graphite
  },
  wrestlerContainer: {
    padding: 5,
    alignItems: 'center',
    flex: 1
  },
  wrestlerText: {
    color: 'white',
    fontSize: 18
  },
  text: {
    color: 'white'
  }
})
