import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, ScrollView, StatusBar, TextInput } from "react-native"
import { observer } from "mobx-react"
import { sharedStyles, colors } from "../styles"
import { push } from "../RootNavigation"  
import { Wrestler, TagTeam, Division } from "../types"
import Picker from "../components/Picker"
import { AewApi } from "../aew_api"
import _ from "lodash"
import { AntDesign } from "@expo/vector-icons"
import { isTagTeam } from "../components/MatchList"
import { storeContext } from "../FavoritesStore"
import { FavoritesList } from "../components/FavoritesList"
import DataContext from "../DataContext"
import LoadingIndicator from "../components/LoadingIndicator"

const ROSTER_ROW_HEIGHT = 90
const FAVORITES_STR = "FAVORITES"
const PICKER_DATA = [
  "ALL",
  "MEN",
  "WOMEN",
  "TAG TEAMS",
  FAVORITES_STR
  //"STABLES"
]

export type RosterMember = Wrestler | TagTeam

export const isMan = (wrestler: Wrestler) => wrestler.division === Division.MENS
export const isWoman = (wrestler: Wrestler) => wrestler.division === Division.WOMENS

export const RosterScreen = () => {
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([])

  useEffect(() => {
    AewApi.fetchOfficialTagTeams()
      .then(teams => setTagTeams(teams || []))
      .catch(console.error)
  })

  const { wrestlers } = useContext(DataContext)

  const men = wrestlers.filter(isMan)
  const women = wrestlers.filter(isWoman)

  const dataArr = [
    wrestlers,
    men,
    women,
    tagTeams,
    []
  ]

  const clearInput = () => setSearchInput("")
  const onChangeText = (text: string) => setSearchInput(text)
  const onSelectPickerIndex = (index: number) => setSelectedPickerIndex(index)

  const isFavoritesSelected = PICKER_DATA.indexOf(FAVORITES_STR) === selectedPickerIndex

  const filteredData = dataArr[selectedPickerIndex].filter(member => member.name.startsWith(searchInput))
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <StatusBar barStyle="light-content" />
      <Picker
        options={PICKER_DATA}
        selectedIndex={selectedPickerIndex}
        onSelect={onSelectPickerIndex}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          value={searchInput}
          style={[sharedStyles.h3, { flex: 1 }]}
          placeholder="Search"
          onChangeText={onChangeText}
        />
        {searchInput === ""
          ? <AntDesign name="search1" size={20} color={colors.white} />
          : (
            <TouchableOpacity onPress={clearInput}>
              <AntDesign name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          )
        }
      </View>
      {_.isEmpty(dataArr[selectedPickerIndex]) && !isFavoritesSelected
        ? <LoadingIndicator />
        : (
          <ScrollView style={sharedStyles.scrollViewContainer}>
            { isFavoritesSelected
              ? <FavoritesList />
              : <RosterMemberList members={filteredData} />
            }
          </ScrollView>
        )
      }
    </View>
  )
}

export function RosterMemberList({ members }: { members: RosterMember[] }) {
  return (
    <FlatList
      renderItem={({item}) => <RosterRow member={item} />}
      data={members}
      ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
      contentContainerStyle={{ marginBottom: 10 }}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

export function navigateToRosterMember(member: RosterMember) {
  if (_.isNil(member)) {
    return () => null
  }
  return isTagTeam(member)
    ? () => push("TagTeam", { tagTeam: member })
    : () => push("Wrestler", { wrestler: member })
}

const isTagTeamWithStable = (tagTeam: TagTeam) => isTagTeam(tagTeam) && tagTeam.name.includes("(")
const stableName = (tagTeam: TagTeam) => tagTeam.name.split(" (")[0]
const tagTeamMembers = (tagTeam: TagTeam) => tagTeam.name.split(" (")[1].replace(")","")

function RosterRow({ member }: { member: RosterMember }) {
  const primaryName = isTagTeam(member)
    ? isTagTeamWithStable(member)
      ? stableName(member)
      : member.name
    : member.name

  const secondaryName = isTagTeam(member)
    ? isTagTeamWithStable(member)
      ? tagTeamMembers(member)
      : null
    : member.nickname

  return (
    <View style={styles.wrestlerOuterContainer}>
        <Image style={styles.image} source={{ uri: member.image_url }} />
        <TouchableOpacity
          style={styles.wrestlerContainer}
          onPress={navigateToRosterMember(member)}
        >
          <Text style={[sharedStyles.h2, { textAlign: "center" }]}>{primaryName}</Text>
          { !_.isNil(secondaryName) && (
            <Text
              style={[
                sharedStyles.h3,
                { 
                  color: colors.silver,
                  textAlign: "center"
                }
              ]}
            >
              {secondaryName}
            </Text>
          )}
        </TouchableOpacity>
        <Star member={member} />
    </View>
  )
}

const Star = observer(({ member }: { member: RosterMember }) => {
  const store = useContext(storeContext)
  // TODO: fix bug where store is unitialized
  if (!store) {
    return null
  }

  const [isFavorited, setIsFavorited] = useState(store.isFavorited(member))

  const onPress = () => (
    store.modifyMember(member)
      .then(res => {
        if (res) {
          setIsFavorited(!isFavorited)
        }
      })
  )

  return (
    <TouchableOpacity onPress={onPress}>
      <AntDesign
        name={ isFavorited ? "star" : "staro" }
        size={30}
        color={ isFavorited ? colors.gold : colors.black }
        style={{ paddingRight: 15 }}
      />
    </TouchableOpacity>
  )
})

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
    padding: 10,
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
  }
})

export default RosterScreen
