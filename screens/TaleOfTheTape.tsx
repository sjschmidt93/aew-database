import { RouteProp } from "@react-navigation/native"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Text, Image, Dimensions, Animated } from "react-native"
import { RootStackParamList } from "../App"
import { colors, sharedStyles } from "../styles"
import { Ionicons, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons"
import _, { first } from "lodash"
import { Wrestler } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AewApi } from "../aew_api"
import { useStore } from "../FavoritesStore"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "TaleOfTheTape">
type Props = {
  route: WrestlerScreenRouteProp
}

const WIDTH_MINUS_PADDING = Dimensions.get('window').width - sharedStyles.scrollViewContainer.paddingHorizontal * 2
const IMAGE_WIDTH = 0.45 * WIDTH_MINUS_PADDING
const BORDER_RADIUS = 12
const SEARCH_BAR_HEIGHT = 40
const EXPANDED_SEARCH_BAR_WIDTH = 0.95 * WIDTH_MINUS_PADDING

const COLLAPSED_FLOATING_BAR_1_LEFT = WIDTH_MINUS_PADDING * 0.025
const COLLAPSED_FLOATING_BAR_2_LEFT = IMAGE_WIDTH + (WIDTH_MINUS_PADDING * 0.075)

@observer
export default class TaleOfTheTape extends React.Component<Props> {
  @observable
  wrestler1 = this.props.route.params.wrestler1

  @observable
  wrestler2 = this.props.route.params.wrestler2

  @observable
  isSearchBar1Visible = false

  @observable
  searchBar1AnimatedValue = new Animated.Value(0)

  @observable
  isSearchBar1Expanded = false

  collapseSearchBar1 = () => (
    Animated.timing(this.searchBar1AnimatedValue, { toValue: 0 })
      .start(() => {
        this.isSearchBar1Visible = false
        this.isSearchBar1Expanded = false
      })
  )

  expandSearchBar1 = () => (
    Animated.timing(this.searchBar1AnimatedValue, { toValue: 1 })
      .start(() => this.isSearchBar1Expanded = true)
  )

  @computed
  get hasNonNullWrestler() {
    return !_.isNil(this.wrestler1) || !_.isNil(this.wrestler2)
  }

  @action onSelectWrestler1 = (wrestler: Wrestler) => this.wrestler1 = wrestler
  @action onSelectWrestler2 = (wrestler: Wrestler) => this.wrestler2 = wrestler

  onCancelSearchBar1Search = () => this.collapseSearchBar1()
  
  onPressEditWrestler1 = () => this.isSearchBar1Visible = true
  
  render() {
    return (
      <View style={sharedStyles.scrollViewContainer}>

        <View style={styles.imagesContainer}>
          <TotpImage
            wrestler={this.wrestler1}
            onSelectWrestler={this.onSelectWrestler1}
            onPressEdit={this.onPressEditWrestler1}
          />
          <TotpImage wrestler={this.wrestler2} onSelectWrestler={this.onSelectWrestler2} />
          <Animated.View style ={[
            styles.floatingSearchBar1,
            {
              left: COLLAPSED_FLOATING_BAR_1_LEFT,
              width: this.searchBar1AnimatedValue.interpolate({
                inputRange: [0,1],
                outputRange: [IMAGE_WIDTH, EXPANDED_SEARCH_BAR_WIDTH]
              }),
              top: IMAGE_WIDTH + 15
            }
          ]}>
            {this.isSearchBar1Visible && (
              <SearchBar
                onSelectWrestler={this.onSelectWrestler1}
                onCancelSearch={this.onCancelSearchBar1Search}
                onPressSearch={this.expandSearchBar1}
                isExpanded={this.isSearchBar1Expanded}
              />
            )}
          </Animated.View>
          {/* <View style = {styles.floatingSearchBar2}>
            <SearchBar />
          </View> */}
        </View>

        <View style={styles.container}>
          <Column wrestler={this.wrestler1} />

          <View style={styles.middleColumnContainer}>

          </View>

          <Column wrestler={this.wrestler2} /> 
        </View>

      </View>
    )
  }
}

interface TotpImageProps {
  wrestler: Wrestler | null
  onSelectWrestler: (wrestler: Wrestler) => void
  onPressEdit: () => void
}

const TotpImage = observer(({ wrestler, onSelectWrestler, onPressEdit }: TotpImageProps) => {
  if (_.isNil(wrestler)) {
    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <View style={styles.imageCircle}>
            <Ionicons name="ios-person" size={0.5 * IMAGE_WIDTH} color={colors.white} />
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: wrestler.image_url }} style={styles.image} />
      <TouchableOpacity onPress={onPressEdit} style={styles.nameContainer}>
        <Text style={sharedStyles.h3}>{wrestler.name}</Text>
        <Feather name="edit" size={16} color={colors.white} style={{ marginLeft: 5 }} />
      </TouchableOpacity>
    </View>
  )
})

const SEARCH_RESULT_MAX = 10

interface SearchBarProps {
  onSelectWrestler: (wrestler: Wrestler) => void
  onPressSearch: () => void
  onCancelSearch: () => void
  isExpanded: boolean
  isWrestlerNil: boolean
}

const SearchBar = observer((props: SearchBarProps ) => {
  const { onSelectWrestler, onPressSearch, onCancelSearch, isExpanded, isWrestlerNil } = props
  const [wrestlers, setWrestlers] = useState([])
  const [resultingWrestlers, setResultingWrestlers] = useState([])
  const [searchInput, setSearchInput] = useState("")

  const store = useStore()

  useEffect(() => {
    AewApi.fetchWrestlers()
      .then(res => setWrestlers(res))
      .catch(e => console.warn("Error fetching wrestlers", e))
  }, [])

  useEffect(() => {
    if (searchInput === "") {
      if (store.favoriteWrestlers.length > SEARCH_RESULT_MAX) {
        setResultingWrestlers(store.favoriteWrestlers.slice(0,SEARCH_RESULT_MAX))
      } else {
        const candidates = store.favoriteWrestlers.concat(wrestlers.slice(0, SEARCH_RESULT_MAX))
        console.log(candidates)
        const candidatesWithoutDupes = candidates.filter((wrestler, index, self) => {
          return self.findIndex(candidate => candidate.id === wrestler.id) === index
        })
        setResultingWrestlers(candidatesWithoutDupes)
      }
    } else {

    }
  }, [searchInput, wrestlers])

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={onPressSearch}>
          <Text>Search</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          {!isWrestlerNil && (
            <TouchableOpacity onPress={onCancelSearch} style={[styles.iconContainer, styles.xContainer]}>
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onPressSearch} style={[styles.iconContainer, styles.searchIconContainer]}>
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {isExpanded && (
        <View style={styles.searchResults}>
          {resultingWrestlers.map(wrestler => {
            return (
              <TouchableOpacity onPress={() => onSelectWrestler(wrestler)} style={styles.wrestlerSearchContainer}>
                <Text style={{ color: colors.white }}>{wrestler.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
})

const Column = ({ wrestler }: { wrestler: Wrestler }) => {
  return (
    null
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  nameContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  columnContainer: {
    flex: 2,
    alignItems: "center"
  },
  floatingSearchBar1: {
    position: "absolute"
  },
  wrestlerSearchContainer: {
    backgroundColor: colors.graphite,
    height: 40,
    width: IMAGE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: colors.black,
    borderBottomWidth: 1
  },
  searchBarContainer: {
    backgroundColor: colors.gray,
    flexDirection: "row",
    justifyContent: "space-between",
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 12,
    alignItems: "center",
    paddingLeft: 10
  },
  iconContainer: {
    width: 35,
    height: SEARCH_BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center"
  },
  searchIconContainer: {
    backgroundColor: colors.graphite,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS
  },
  searchResults: {
    position: "absolute",
    top: 50
  },
  xContainer: {
    backgroundColor: "red"
  },
  imagesContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignContent: "space-between"
  },
  imageContainer: {
    flex: 1,
    alignItems: "center"
  },
  imageCircle: {
    alignItems: "center",
    justifyContent: "center",
    height: 0.75 * IMAGE_WIDTH,
    width: 0.75 * IMAGE_WIDTH,
    backgroundColor: colors.silver,
    borderRadius: 100
  },
  imageBackground: {
    alignItems: "center",
    justifyContent: "center",
    height: IMAGE_WIDTH,
    width: IMAGE_WIDTH,
    backgroundColor: colors.graphite,
    marginBottom: 10
  },
  middleColumnContainer: {
    flex: 1
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    marginBottom: 10
  }
})
