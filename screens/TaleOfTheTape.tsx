import { RouteProp } from "@react-navigation/native"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, Image, Dimensions, Animated } from "react-native"
import { RootStackParamList } from "../App"
import { colors, sharedStyles } from "../styles"
import { Ionicons, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons"
import _ from "lodash"
import { Wrestler } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AewApi } from "../aew_api"
import { useStore } from "../FavoritesStore"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "TaleOfTheTape">
type Props = {
  route: WrestlerScreenRouteProp
}

@observer
export default class TaleOfTheTape extends React.Component<Props> {
  @observable
  wrestler1 = this.props.route.params.wrestler1

  @observable
  wrestler2 = this.props.route.params.wrestler2

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
          <TotpImage wrestler={this.wrestler1} onSelectWrestler={this.onSelectWrestler1} />
          <TotpImage wrestler={this.wrestler2} onSelectWrestler={this.onSelectWrestler2} />
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
}

const TotpImage = observer(({ wrestler, onSelectWrestler }: TotpImageProps) => {
  const [isSearching, setIsSearching] = useState(false)

  const onCancelSearch = () => setIsSearching(false)

  if (_.isNil(wrestler)) {
    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <View style={styles.imageCircle}>
            <Ionicons name="ios-person" size={0.5 * IMAGE_WIDTH} color={colors.white} />
          </View>
        </View>
        <SearchBar onSelectWrestler={onSelectWrestler} onCancelSearch={onCancelSearch} />
      </View>
    )
  }

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: wrestler.image_url }} style={styles.image} />
      { !isSearching ? (
          <TouchableOpacity onPress={() => setIsSearching(!isSearching)} style={styles.nameContainer}>
            <Text style={sharedStyles.h3}>{wrestler.name}</Text>
            <Feather name="edit" size={16} color={colors.white} style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        ) : <SearchBar onSelectWrestler={onSelectWrestler} onCancelSearch={onCancelSearch} />
      }
    </View>
  )
})

const SEARCH_RESULT_MAX = 10

interface SearchBarProps {
  onSelectWrestler: (wrestler: Wrestler) => void
  onCancelSearch: () => void
}

const SearchBar = observer(({ onSelectWrestler, onCancelSearch }: SearchBarProps ) => {
  const [wrestlers, setWrestlers] = useState([])
  const [resultingWrestlers, setResultingWrestlers] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [isSelected, setIsSelected] = useState(false)

  const width = new Animated.Value(IMAGE_WIDTH)
  const left = new Animated.Value(0)

  const animatedValue = new Animated.Value(0)

  const store = useStore()

  useEffect(() => {
    Animated.timing(
      animatedValue, {
        toValue: isSelected ? 1 : 0
      }).start(() => {
      if(!isSelected) {
        // do stuff
      }
    })
  }, [isSelected])

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
      <Animated.View
        style={[
          styles.searchBarContainer, {
          left: animatedValue.interpolate({
            inputRange: [0,1],
            outputRange: [0, (IMAGE_WIDTH - 0.95 * WIDTH_MINUS_PADDING)  / 2]
          }),
          width: animatedValue.interpolate({
            inputRange: [0,1],
            outputRange: [IMAGE_WIDTH, 0.95 * WIDTH_MINUS_PADDING]
          })
        }]}
      >
        <TouchableOpacity onPress={() => setIsSelected(true)}>
          <Text>Search</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setIsSelected(false)} style={[styles.iconContainer, styles.xContainer]}>
            <MaterialIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSelected(true)} style={[styles.iconContainer, styles.searchIconContainer]}>
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.searchResults}>
        {resultingWrestlers.map(wrestler => {
          return (
            <TouchableOpacity onPress={() => onSelectWrestler(wrestler)} style={styles.wrestlerSearchContainer}>
              <Text style={{ color: colors.white }}>{wrestler.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
})

const Column = ({ wrestler }: { wrestler: Wrestler }) => {
  return (
    null
  )
}

const WIDTH_MINUS_PADDING = Dimensions.get('window').width - sharedStyles.scrollViewContainer.paddingHorizontal * 2
const IMAGE_WIDTH = 0.45 * WIDTH_MINUS_PADDING
const BORDER_RADIUS = 12
const SEARCH_BAR_HEIGHT = 40
const FULL_SEARCH_BAR_WIDTH = 0.95 * WIDTH_MINUS_PADDING

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
