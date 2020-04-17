import React from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { observable, computed } from 'mobx'
import { observer } from "mobx-react"
import { sharedStyles } from "../styles"
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { navigate } from "../RootNavigation"
import { Wrestler, TagTeam } from "../types"
import Picker from "../components/Picker"
import { AewApi } from "../aew_api"

export interface NavigationProp {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const WRESTLER_ROW_HEIGHT = 75

@observer
export default class RosterScreen extends React.Component<NavigationProp> {
  @observable
  wrestlers: Wrestler[] = []

  @observable
  tagTeams: TagTeam[] = []

  @observable
  selectedPickerIndex = 0

  componentDidMount() {
    this.fetchWrestlers()
    this.fetchTagTeams()
  }

  onPickerSelect = (index: number) => this.selectedPickerIndex = index

  fetchWrestlers = async () => this.wrestlers = await AewApi.fetchWrestlers()
  fetchTagTeams = async () => this.tagTeams = await AewApi.fetchTagTeams()

  @computed
  get dataArr() {
    return [
      this.wrestlers,
      this.mensDivision,
      this.womensDivision,
      this.tagTeams,
      []
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

  @computed
  get pickerData(): string[] {
    return [
      "ALL",
      "MEN'S",
      "WOMEN'S",
      "TAG TEAMS",
      "STABLES"
    ]
  }

  render() {
    return (
      <>
        <Picker options={this.pickerData} selectedIndex={this.selectedPickerIndex} onSelect={this.onPickerSelect} />
        <ScrollView style={sharedStyles.scrollViewContainer}>
          <FlatList
            contentContainerStyle={styles.flatlistContentContainerStyle}
            renderItem={({item}) => <ItemRow item={item} />}
            data={this.dataArr[this.selectedPickerIndex]}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          />
        </ScrollView>
      </>
    )
  }
}

type ItemRowProps = {
  item: Wrestler | TagTeam
}

@observer
export class ItemRow extends React.Component<ItemRowProps> {
  render () {
    return (
      <View style={styles.wrestlerOuterContainer}>
        <Image style={styles.image} source={{ uri: this.props.item.image_url }} />
        <TouchableOpacity
          style={styles.wrestlerContainer}
          onPress={() => navigate('Wrestler', { wrestler: this.props.item }) }
        >
          <Text style={sharedStyles.h3}>{this.props.item.name}</Text>
          <Text style={sharedStyles.body}>{this.props.item.nickname}</Text>
          <Text style={styles.text}>{this.props.item.wins}-{this.props.item.losses}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export const GRAPHITE = "#454343"
export const AEW_YELLOW = "#A18931"

const styles = StyleSheet.create({
  image: {
    height: WRESTLER_ROW_HEIGHT,
    width: WRESTLER_ROW_HEIGHT
  },
  wrestlerOuterContainer: {
    flexDirection: 'row',
    height: WRESTLER_ROW_HEIGHT,
    alignItems: 'center',
    width: '100%',
    backgroundColor: GRAPHITE
  },
  wrestlerContainer: {
    padding: 5
  },
  flatlistContentContainerStyle: {
    //flexGrow: 1, justifyContent: 'space-between'
  },
  wrestlerText: {
    color: 'white',
    fontSize: 18
  },
  text: {
    color: 'white'
  }
})
