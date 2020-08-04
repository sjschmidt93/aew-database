import React, { useState } from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView, StatusBar, TextInput } from "react-native"
import { observable, computed } from 'mobx'
import { observer } from "mobx-react"
import { sharedStyles, colors } from "../styles"
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { navigate } from "../RootNavigation"  
import { Wrestler, TagTeam, NAMING_CONVENTION } from "../types"
import Picker from "../components/Picker"
import { AewApi } from "../aew_api"
import _ from "lodash"
import { AntDesign } from "@expo/vector-icons"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../App"
import { isTagTeam } from "../components/MatchList"

type RosterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Roster"
>;

const ROSTER_ROW_HEIGHT = 75

type RosterMember = Wrestler | TagTeam

const tagTeamWrestlersJoined = (tagTeam: TagTeam) => tagTeam.wrestlers.map(wrestler => wrestler.name).join(" & ")

const primaryName = (rosterMember: RosterMember) => {
  if (isTagTeam(rosterMember)) {

  }
  return isTagTeam(rosterMember)
    ? rosterMember.naming_convention === "wrestlers"
      ? tagTeamWrestlersJoined(rosterMember)
      : rosterMember.name
    : rosterMember.name
}

const secondaryName = (rosterMember: RosterMember) => {
  return isTagTeam(rosterMember)
    ? rosterMember.naming_convention === "both"
      ? tagTeamWrestlersJoined(rosterMember)
      : null
    : rosterMember.nickname
}

@observer
export default class RosterScreen extends React.Component<RosterPageProps> {
  @observable
  wrestlers: Wrestler[] = []

  @observable
  tagTeams: TagTeam[] = []

  @observable
  selectedPickerIndex = 0

  @observable
  searchInput = ""

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
  get filteredData(): RosterMember[] {
    return this.dataArr[this.selectedPickerIndex].filter(member => primaryName(member).startsWith(this.searchInput))
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

  fetchWrestlers = async () => this.wrestlers = await AewApi.fetchWrestlers()
  fetchTagTeams = async () => this.tagTeams = await AewApi.fetchOfficialTagTeams()

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.black }}>
        <StatusBar barStyle="light-content" />
        <Picker
          options={this.pickerData}
          selectedIndex={this.selectedPickerIndex}
          onSelect={index => this.selectedPickerIndex = index}
        />
        <View style={styles.textInputContainer}>
          <TextInput
            value={this.searchInput}
            style={[sharedStyles.h3, { flex: 1 }]}
            placeholder="Search"
            onChangeText={text => this.searchInput = text}
          />
          {this.searchInput === ""
            ? <AntDesign name="search1" size={20} color={colors.white} />
            : (
              <TouchableOpacity onPress={() => this.searchInput = ""}>
                <AntDesign name="close" size={20} color={colors.white} />
              </TouchableOpacity>
            )
          }
        </View>
        <ScrollView style={sharedStyles.scrollViewContainer}>
          <RosterMemberList members={this.filteredData} />
        </ScrollView>
      </View>
    )
  }
}

export function RosterMemberList({ members }: { members: RosterMember[] }) {
  return (
    <FlatList
      renderItem={({item}) => <RosterRow member={item} />}
      data={members}
      ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
      contentContainerStyle={{ marginBottom: 10 }}
    />
  )
}

export function navigateToRosterMember(member: RosterMember) {
  if (_.isNil(member)) {
    return () => null
  }
  return isTagTeam(member)
    ? () => navigate("TagTeam", { tagTeam: member })
    : () => navigate("Wrestler", { wrestler: member })
}

function RosterRow({ member }: { member: RosterMember }) {
  const _secondaryName = secondaryName(member)
  return (
    <View style={styles.wrestlerOuterContainer}>
      <Image style={styles.image} source={{ uri: member.image_url }} />
      <TouchableOpacity
        style={styles.wrestlerContainer}
        onPress={navigateToRosterMember(member)}
      >
        <Text style={sharedStyles.h2}>{primaryName(member)}</Text>
        { !_.isNil(_secondaryName) && <Text style={[sharedStyles.h3, { color: colors.silver }]}>{_secondaryName}</Text> }
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
  },
  textInputContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    borderBottomColor: colors.graphite,
    borderBottomWidth: 1,
    backgroundColor: colors.black,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textInput: {
    
  }
})
