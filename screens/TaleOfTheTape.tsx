import { RouteProp } from "@react-navigation/native"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useContext, useEffect, useRef, useState } from "react"
import { View, StyleSheet, Text, Image, Dimensions, Animated, StyleProp, Keyboard, TextInput, ViewStyle } from "react-native"
import { RootStackParamList } from "../App"
import { colors, sharedStyles } from "../styles"
import { Ionicons, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons"
import _, { Dictionary, first } from "lodash"
import { Wrestler } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AewApi } from "../aew_api"
import { useStore } from "../FavoritesStore"
import { toHeightString, toRecordString, toWeightString } from "./WrestlerScreen"
import { PersonIcon } from "../components/PersonIcon"
import { WrestlerContext } from "../WrestlerContext"

type WrestlerScreenRouteProp = RouteProp<RootStackParamList, "TaleOfTheTape">
type Props = {
  route: WrestlerScreenRouteProp
}

const PADDING = sharedStyles.scrollViewContainer.paddingHorizontal * 2
const WIDTH_MINUS_PADDING = Dimensions.get('window').width - PADDING
const IMAGE_WIDTH = 0.45 * WIDTH_MINUS_PADDING
const BORDER_RADIUS = 12

const COLLAPSED_SEARCH_BAR_HEIGHT = 40
const EXPANDED_SEARCH_BAR_HEIGHT = COLLAPSED_SEARCH_BAR_HEIGHT * 1.5

const EXPANDED_SEARCH_BAR_WIDTH = 0.95 * WIDTH_MINUS_PADDING

const COLLAPSED_FLOATING_BAR_1_LEFT = PADDING / 2 + WIDTH_MINUS_PADDING * 0.025
const COLLAPSED_FLOATING_BAR_2_LEFT = COLLAPSED_FLOATING_BAR_1_LEFT + IMAGE_WIDTH + WIDTH_MINUS_PADDING * 0.05

const SEARCH_BAR_TOP = IMAGE_WIDTH + 15

@observer
export default class TaleOfTheTape extends React.Component<Props> {
  @observable wrestler1 = this.props.route.params.wrestler1
  @observable wrestler2 = this.props.route.params.wrestler2

  @observable isSearchBar1Visible = false
  @observable isSearchBar1Expanded = false
  @observable searchBar1AnimatedValue = new Animated.Value(0)
  @observable isSearchBar1Animating = false

  @observable isSearchBar2Visible = _.isNil(this.wrestler2)
  @observable isSearchBar2Expanded = false
  @observable searchBar2AnimatedValue = new Animated.Value(0)
  @observable isSearchBar2Animating = false

  collapseSearchBar1 = () => {
    this.isSearchBar1Animating = true
    this.isSearchBar1Expanded = false
    Animated.timing(this.searchBar1AnimatedValue, { toValue: 0 })
      .start(() => {
        this.isSearchBar1Animating = false
        this.isSearchBar1Visible = false
        this.isSearchBar1Expanded = false
      })
  }

  expandSearchBar1 = () => {
    this.isSearchBar1Animating = true
    Animated.timing(this.searchBar1AnimatedValue, { toValue: 1 })
      .start(() => {
        this.isSearchBar1Animating = false
        this.isSearchBar1Expanded = true
      })
  }

  onCancelSearchBar1Search = () => this.collapseSearchBar1()
  onPressEditWrestler1 = () => this.isSearchBar1Visible = true
  
  collapseSearchBar2 = () => {
    this.isSearchBar2Animating = true
    this.isSearchBar2Expanded = false
    Animated.timing(this.searchBar2AnimatedValue, { toValue: 0 })
      .start(() => {
        this.isSearchBar2Animating = false
        if (!_.isNil(this.wrestler2)) {
          this.isSearchBar2Visible = false
        }
      })
  }

  expandSearchBar2 = () => {
    this.isSearchBar2Animating = true
    Animated.timing(this.searchBar2AnimatedValue, { toValue: 1 })
      .start(() => {
        this.isSearchBar2Animating = false
        this.isSearchBar2Expanded = true
      })
  }

  onCancelSearchBar2Search = () => this.collapseSearchBar2()
  onPressEditWrestler2 = () => this.isSearchBar2Visible = true

  @computed
  get animatedValueSum () {
    return Animated.add(this.searchBar1AnimatedValue, this.searchBar2AnimatedValue)
  }

  @action onSelectWrestler1 = (wrestler: Wrestler) => {
    this.wrestler1 = wrestler
    this.collapseSearchBar1()
  }
  @action onSelectWrestler2 = (wrestler: Wrestler) => {
    this.wrestler2 = wrestler
    this.collapseSearchBar2()
  }

  fadeTransform = (animatedValue: Animated.Value | Animated.AnimatedAddition) => ({
    transform: [
      { 
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, EXPANDED_SEARCH_BAR_HEIGHT]
        })
      }
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5]
    })
  })

  render() {
    const sumTransform = this.fadeTransform(this.animatedValueSum)
    return (
      <View style={sharedStyles.scrollViewContainer}>
        <Animated.View style ={[
          styles.floatingSearchBar,
          this.fadeTransform(this.searchBar2AnimatedValue),
          {
            left: COLLAPSED_FLOATING_BAR_1_LEFT,
            width: this.searchBar1AnimatedValue.interpolate({
              inputRange: [0,1],
              outputRange: [IMAGE_WIDTH, EXPANDED_SEARCH_BAR_WIDTH]
            }),
            top: this.searchBar1AnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [SEARCH_BAR_TOP, 0]
            }),
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
              disabled={this.isSearchBar1Animating || this.isSearchBar2Animating || this.isSearchBar2Expanded}
              otherWrestler={this.wrestler2}
            />
          )}
        </Animated.View>

        <Animated.View style ={[
          styles.floatingSearchBar,
          this.fadeTransform(this.searchBar1AnimatedValue),
          {
            left: this.searchBar2AnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [COLLAPSED_FLOATING_BAR_2_LEFT, COLLAPSED_FLOATING_BAR_1_LEFT]
            }),
            width: this.searchBar2AnimatedValue.interpolate({
              inputRange: [0,1],
              outputRange: [IMAGE_WIDTH, EXPANDED_SEARCH_BAR_WIDTH]
            }),
            top: this.searchBar2AnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [SEARCH_BAR_TOP, 0]
            }),
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
              disabled={this.isSearchBar2Animating || this.isSearchBar1Animating || this.isSearchBar1Expanded}
              otherWrestler={this.wrestler1}
            />
          )}
        </Animated.View>

        <Animated.View style={[styles.imagesContainer, sumTransform]}>
          <TotpImage
            wrestler={this.wrestler1}
            onPressEdit={this.onPressEditWrestler1}
          />
          <TotpImage
            wrestler={this.wrestler2}
            onPressEdit={this.onPressEditWrestler2}
          />
        </Animated.View>
        <Animated.View style={sumTransform}>
          <WrestlerColumns wrestler1={this.wrestler1} wrestler2={this.wrestler2} />
        </Animated.View>

      </View>
    )
  }
}

interface WrestlerColumnsProp {
  wrestler1: Wrestler
  wrestler2: Wrestler
}

interface AtttributeDictionary {
  [key: string]: (wrestler: Wrestler) => string
}

const WrestlerColumns = ({ wrestler1, wrestler2 }: WrestlerColumnsProp) => {
  const attributes: AtttributeDictionary = {
    "height": wrestler => toHeightString(wrestler.height),
    "weight": wrestler => toWeightString(wrestler.weight),
    "record": wrestler => toRecordString(wrestler),
    "hometown": wrestler => wrestler.hometown,
    "nickname": wrestler => wrestler.nickname || "N/A"
  }

  return (
    <View>
      {Object.keys(attributes).map((key, index) => (
        <View key={`column-${index}`}style={styles.rowContainer}>
          <View style={styles.outerColumnContainer}>
            <Text numberOfLines={1} style={sharedStyles.body}>{attributes[key](wrestler1)}</Text>
          </View>
          <View style={styles.middleColumnContainer}>
            <Text style={sharedStyles.body}>{key}</Text>
          </View>
          <View style={styles.outerColumnContainer}>
            <Text numberOfLines={1} style={[sharedStyles.body, { paddingHorizontal: 5}]}>{wrestler2? attributes[key](wrestler2) : "N/A"}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

interface TotpImageProps {
  wrestler: Wrestler | null
  onPressEdit: () => void
}

const TotpImage = observer(({ wrestler, onPressEdit }: TotpImageProps) => {
  if (_.isNil(wrestler)) {
    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <PersonIcon size={0.75 * IMAGE_WIDTH} />
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

const SEARCH_RESULT_MAX = 6

interface SearchBarProps {
  onSelectWrestler: (wrestler: Wrestler) => void
  onPressSearch: () => void
  onCancelSearch: () => void
  isExpanded: boolean
  isWrestlerNil: boolean
  animatedValue: Animated.Value
  disabled: boolean
  otherWrestler: Wrestler
}

const SearchBar = observer((props: SearchBarProps) => {
  const [resultingWrestlers, setResultingWrestlers] = useState<Wrestler[]>([])
  const [searchInput, setSearchInput] = useState("")

  const textInputRef = useRef<TextInput>()

  const store = useStore()
  const wrestlers = useContext(WrestlerContext)

  useEffect(() => {
    const filteredWrestlers = wrestlers.filter(wrestler => wrestler.id !== props.otherWrestler?.id)
    if (searchInput === "") {
      setResultingWrestlers(filteredWrestlers.slice(0, SEARCH_RESULT_MAX))
    } else {
      setResultingWrestlers(filteredWrestlers.filter(wrestler => wrestler.name.toLowerCase().startsWith(searchInput.toLowerCase())))
    }
  }, [searchInput, wrestlers])

  useEffect(() => {
    if (props.isExpanded) {
      textInputRef?.current?.focus()
    }
  }, [props.isExpanded])

  const onPressStar = () => setResultingWrestlers(store.favoriteWrestlers.slice(0, SEARCH_RESULT_MAX))

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={props.onPressSearch}>
          <TextInput
            ref={textInputRef}
            value={searchInput}
            placeholder="Search"
            onChangeText={text => setSearchInput(text)}
          />
        </TouchableOpacity>
        <View style={styles.iconsContainer}>
          <SearchBarIcon
            animatedValue={props.animatedValue}
            color={colors.gold}
            visible={props.isExpanded && store.favoriteWrestlers.length > 0}
            onPress={onPressStar}
            disabled={props.disabled}
            icon={<AntDesign name="staro" size={24} />}
          />
          <SearchBarIcon
            animatedValue={props.animatedValue}
            color="red"
            visible={props.isExpanded || !props.isWrestlerNil}
            onPress={() => {
              props.onCancelSearch()
              Keyboard.dismiss()
            }}
            disabled={props.disabled}
            icon={<MaterialIcons name="cancel" size={24} color="white" />}
          />
          <SearchBarIcon
            animatedValue={props.animatedValue}
            color={colors.graphite}
            onPress={props.onPressSearch}
            disabled={props.disabled}
            icon={<AntDesign name="search1" size={24} color="white" />}
            style={styles.searchIconContainer}
          />
        </View>
      </View>
      {props.isExpanded && (
        <View style={styles.searchResults}>
          {resultingWrestlers.map(wrestler => {
            const onSelect = () => {
              props.onSelectWrestler(wrestler)
              Keyboard.dismiss()
            }
            return (
              <TouchableOpacity onPress={onSelect} style={styles.wrestlerSearchContainer}>
                <Text style={{ color: colors.white }}>{wrestler.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  )
})

interface SearchBarIconProps {
  animatedValue: Animated.Value
  color: string
  disabled: boolean
  onPress: () => void
  icon: React.ReactNode
  visible?: boolean
  style?: StyleProp<ViewStyle>
}

const SearchBarIcon = ({ animatedValue, color, onPress, disabled, icon, visible = true, style = null }: SearchBarIconProps) => {
  if (!visible) {
    return null
  }

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [35, ROW_HEIGHT]
  })

  return (
    <Animated.View style={{ width }}>
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.iconContainer, style, { backgroundColor: color }]}>
        {icon}
      </TouchableOpacity>
    </Animated.View>
  )
}

const ROW_HEIGHT = 50

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  rowContainer: {
    flexDirection: "row",
    borderBottomColor: colors.graphite,
    borderBottomWidth: 1,
    height: ROW_HEIGHT,
    marginBottom: 5
  },
  middleColumnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray
  },
  outerColumnContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.graphite,
    paddingHorizontal: 3
  },
  nameContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  floatingSearchBar: {
    position: "absolute"
  },
  wrestlerSearchContainer: {
    backgroundColor: colors.graphite,
    height: 40,
    width: EXPANDED_SEARCH_BAR_WIDTH,
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
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS
  },
  searchResults: {
    position: "absolute",
    top: EXPANDED_SEARCH_BAR_HEIGHT + 5
  },
  imagesContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingBottom: 40
  },
  imageContainer: {
    flex: 1,
    alignItems: "center"
  },
  imageBackground: {
    alignItems: "center",
    justifyContent: "center",
    height: IMAGE_WIDTH,
    width: IMAGE_WIDTH,
    backgroundColor: colors.graphite,
    marginBottom: 10
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    marginBottom: 10
  }
})
