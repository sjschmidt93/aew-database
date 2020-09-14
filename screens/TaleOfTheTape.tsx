import { RouteProp } from "@react-navigation/native"
import { computed, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { View, StyleSheet, Text, Image, Dimensions } from "react-native"
import { RootStackParamList } from "../App"
import { sharedStyles } from "../styles"

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
  
  render() {
    return (
      <View style={sharedStyles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.columnContainer}>
            <Image source={{ uri: this.wrestler1.image_url }} style={styles.image} />
            <Text style={sharedStyles.h3}>{this.wrestler1.name}</Text>
          </View>
          <View style={styles.middleColumnContainer}>

          </View>
          <View style={styles.columnContainer}>
            <Text style={sharedStyles.h3}>{this.wrestler1.name}</Text>
          </View> 
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  columnContainer: {
    flex: 2,
    alignItems: "center"
  },
  middleColumnContainer: {
    flex: 1
  },
  image: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4
  }
})
