import React from "react"
import { FlatList, Text, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { sharedStyles } from "../styles"
import { observer } from "mobx-react"
import { GRAPHITE } from "../screens/RosterScreen"

interface PickerProps {
  options: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

@observer
export default class Picker extends React.Component<PickerProps> {
  renderItem = ({item, index}) => {
    const textStyle = {
      color: index == this.props.selectedIndex ? 'white' : GRAPHITE
    }
    return (
      <TouchableOpacity
        style={styles.columnContainer}
        onPress={() => this.props.onSelect(index)}
      >
        <Text style={[sharedStyles.h3, textStyle]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.options}
          horizontal={true}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <View style={{ width: 10 }}/>}
          extraData={this.props.selectedIndex}
          contentContainerStyle={{backgroundColor: '#A18931', flex: 1, paddingLeft: 15}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  columnContainer: {
    padding: 5
  }
})