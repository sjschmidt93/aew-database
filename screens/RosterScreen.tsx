import React from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { observable, computed } from 'mobx'
import { observer } from "mobx-react"
import { sharedStyles } from "../styles"
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { navigate } from "../RootNavigation"
import { Wrestler, TagTeam } from "../types"
import Picker from "../components/Picker"
import * as ImageManipulator from "expo-image-manipulator"

export const API_URL = 'http://0033a334.ngrok.io'

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

  fetchWrestlers = () => {
    const url = `${API_URL}/wrestlers`
    fetch(url)
      .then(res => res.json())
      .then(data => this.wrestlers = data)
      .catch(e => console.warn('Error fetching wrestlers', e))
  }

  fetchTagTeams = () => {
    const url = `${API_URL}/tag_teams`
    fetch(url)
      .then(res => res.json())
      .then(data => this.tagTeams = data)
      .catch(e => console.warn('Error fetching tag teams', e))
  }

  @computed
  get dataArr() {
    return [
      this.wrestlers,
      this.mensDivision,
      this.womensDivision,
      this.tagTeams
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
      "WOMEN's",
      "TAG TEAMS"
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

type WrestlerRowProps = {
  item: Wrestler | TagTeam
}

@observer
export class ItemRow extends React.Component<WrestlerRowProps> {
  @observable
  croppedImageUrl = ""

  componentDidMount() {
    ImageManipulator.manipulateAsync(
      this.props.item.image_url,
      [
        {
          crop: {
            originX: 0,
            originY: 50,
            height: 260,
            width: 320
          }
        }
      ]
    ).then(result => this.croppedImageUrl = result.uri)
     .catch(e => console.warn('Error cropping image', e))
  }

  render () {
    return (
      <View style={styles.wrestlerOuterContainer}>
        <Image style={styles.image} source={{ uri: this.croppedImageUrl }} />
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
