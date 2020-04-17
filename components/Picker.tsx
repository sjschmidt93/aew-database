import React from "react"
import { FlatList, Text, StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { sharedStyles } from "../styles"
import { observer } from "mobx-react"
import { GRAPHITE, AEW_YELLOW } from "../screens/RosterScreen"

interface PickerProps {
  options: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

@observer
export default class Picker extends React.Component<PickerProps> {
  renderItem = ({item, index}) => {
    const isSelected = this.props.selectedIndex === index
    const unselectedTextStyle = {
      color: GRAPHITE
    }
    const selectedContainerStyle = {
      borderBottomWidth: 2,
      borderBottomColor: 'white'
    }
    return (
      <TouchableOpacity
        style={[styles.columnContainer, isSelected && selectedContainerStyle]}
        onPress={() => this.props.onSelect(index)}
      >
        <Text style={[sharedStyles.h3, !isSelected && unselectedTextStyle]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.options}
          horizontal={true}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => <View style={{ width: 10 }}/>}
          extraData={this.props.selectedIndex}
          contentContainerStyle={{ backgroundColor: AEW_YELLOW, flex: 1, paddingLeft: 15 }}
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
