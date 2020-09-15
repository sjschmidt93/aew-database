import { RouteProp } from "@react-navigation/native"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { View, StyleSheet, Text, Image, Dimensions } from "react-native"
import { RootStackParamList } from "../App"
import { colors, sharedStyles } from "../styles"
import { Ionicons, Feather } from "@expo/vector-icons"
import _ from "lodash"
import { Wrestler } from "../types"
import { TouchableOpacity } from "react-native-gesture-handler"

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
          <TotpImage wrestler={null} onSelectWrestler={this.onSelectWrestler2} />
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
  
  return (
    <View style={styles.imageContainer}>
      {!_.isNil(wrestler)
        ? (
          <>
            <Image source={{ uri: wrestler.image_url }} style={styles.image} />
            <TouchableOpacity onPress={() => onSelectWrestler(wrestler)} style={styles.nameContainer}>
              <Text style={sharedStyles.h3}>{wrestler.name}</Text>
              <Feather name="edit" size={16} color={colors.white} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </>
        ) 
        : (
          <View style={styles.imageBackground}>
            <View style={styles.imageCircle}>
              <Ionicons name="ios-person" size={0.5 * IMAGE_WIDTH} color={colors.white} />
            </View>
          </View>
        )
      }
    </View>
  )
})

const Column = ({ wrestler }: { wrestler: Wrestler }) => {
  return (
    null
  )
}

const IMAGE_WIDTH = 0.45 * (Dimensions.get('window').width - sharedStyles.scrollViewContainer.paddingHorizontal * 2)

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
    backgroundColor: colors.graphite
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
