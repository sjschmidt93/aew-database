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

const COLLAPSED_SEARCH_BAR_HEIGHT = 40
const EXPANDED_SEARCH_BAR_HEIGHT = COLLAPSED_SEARCH_BAR_HEIGHT * 1.5

const EXPANDED_SEARCH_BAR_WIDTH = 0.95 * WIDTH_MINUS_PADDING

const COLLAPSED_FLOATING_BAR_1_LEFT = WIDTH_MINUS_PADDING * 0.025
const COLLAPSED_FLOATING_BAR_2_LEFT = IMAGE_WIDTH + (WIDTH_MINUS_PADDING * 0.075) // incorrect but close

const SEARCH_BAR_TOP = IMAGE_WIDTH + 15

@observer
export default class TaleOfTheTape extends React.Component<Props> {
  @observable wrestler1 = this.props.route.params.wrestler1
  @observable wrestler2 = this.props.route.params.wrestler2

  @observable isSearchBar1Visible = false
  @observable isSearchBar1Expanded = false
  @observable searchBar1AnimatedValue = new Animated.Value(0)

  @observable isSearchBar2Visible = _.isNil(this.wrestler2)
  @observable isSearchBar2Expanded = false
  @observable searchBar2AnimatedValue = new Animated.Value(0)


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

  onCancelSearchBar1Search = () => this.collapseSearchBar1()
  onPressEditWrestler1 = () => this.isSearchBar1Visible = true
  
  collapseSearchBar2 = () => (
    Animated.timing(this.searchBar2AnimatedValue, { toValue: 0 })
      .start(() => {
        this.isSearchBar2Visible = false
        this.isSearchBar2Expanded = false
      })
  )
  expandSearchBar2 = () => (
    Animated.timing(this.searchBar2AnimatedValue, { toValue: 1 })
      .start(() => this.isSearchBar2Expanded = true)
  )

  onCancelSearchBar2Search = () => this.collapseSearchBar2()
  onPressEditWrestler2 = () => this.isSearchBar2Visible = true

  @computed
  get hasNonNullWrestler() {
    return !_.isNil(this.wrestler1) || !_.isNil(this.wrestler2)
  }

  @action onSelectWrestler1 = (wrestler: Wrestler) => this.wrestler1 = wrestler
  @action onSelectWrestler2 = (wrestler: Wrestler) => this.wrestler2 = wrestler


  
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
            styles.floatingSearchBar,
            {
              left: COLLAPSED_FLOATING_BAR_1_LEFT,
              width: this.searchBar1AnimatedValue.interpolate({
                inputRange: [0,1],
                outputRange: [IMAGE_WIDTH, EXPANDED_SEARCH_BAR_WIDTH]
              }),
              top: SEARCH_BAR_TOP,
              zIndex: this.searchBar1AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 5000]
              }),
              height: this.searchBar1AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [COLLAPSED_SEARCH_BAR_HEIGHT, EXPANDED_SEARCH_BAR_HEIGHT]
              })
            }
          ]}>
            {this.isSearchBar1Visible && (
              <SearchBar
                onSelectWrestler={this.onSelectWrestler1}
                onCancelSearch={this.onCancelSearchBar1Search}
                onPressSearch={this.expandSearchBar1}
                isExpanded={this.isSearchBar1Expanded}
                isWrestlerNil={_.isNil(this.wrestler1)}
                animatedValue={this.searchBar1AnimatedValue}
              />
            )}
          </Animated.View>
          <Animated.View style ={[
            styles.floatingSearchBar,
            {
              left: this.searchBar2AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [COLLAPSED_FLOATING_BAR_2_LEFT, 0]
              }),
              width: this.searchBar2AnimatedValue.interpolate({
                inputRange: [0,1],
                outputRange: [IMAGE_WIDTH, EXPANDED_SEARCH_BAR_WIDTH]
              }),
              top: IMAGE_WIDTH + 15,
              zIndex: this.searchBar2AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 5000]
              }),
              height: this.searchBar2AnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [COLLAPSED_SEARCH_BAR_HEIGHT, EXPANDED_SEARCH_BAR_HEIGHT]
              })
            }
          ]}>
            {this.isSearchBar2Visible && (
              <SearchBar
                onSelectWrestler={this.onSelectWrestler2}
                onCancelSearch={this.onCancelSearchBar2Search}
                onPressSearch={this.expandSearchBar2}
                isExpanded={this.isSearchBar2Expanded}
                isWrestlerNil={_.isNil(this.wrestler2)}
                animatedValue={this.searchBar2AnimatedValue}
              />
            )}
          </Animated.View>
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
  animatedValue: Animated.Value
}

const SearchBar = observer((props: SearchBarProps ) => {
  const { onSelectWrestler, onPressSearch, onCancelSearch, isExpanded, isWrestlerNil, animatedValue } = props
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

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [35, 50]
  })
  return (
    <View>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={onPressSearch}>
          <Text>Search</Text>
        </TouchableOpacity>
        <View style={styles.iconsContainer}>
          {!isWrestlerNil && (
            <Animated.View style={{ width }}>
                <TouchableOpacity onPress={onCancelSearch} style={[styles.iconContainer, styles.xContainer]}>
                  <MaterialIcons name="cancel" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>
          )}
          <Animated.View style ={{ width }}>
            <TouchableOpacity onPress={onPressSearch} style={[styles.iconContainer, styles.searchIconContainer]}>
              <AntDesign name="search1" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
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
  floatingSearchBar: {
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
    height: "100%",
    borderRadius: 12,
    alignItems: "center",
    paddingLeft: 10
  },
  iconsContainer: {
    flexDirection: "row",
    height: "100%"
  },
  iconContainer: {
    width: "100%",
    height: "100%",
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
    top: 65
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
