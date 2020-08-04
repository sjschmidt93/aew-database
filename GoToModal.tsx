import { View } from "react-native"
import { observable } from "mobx"
import React from "react"
import { observer } from "mobx-react"

@observer
export default class GoToModal extends React.Component {
  @observable
  static isVisible = false

  render() {
    return GoToModal.isVisible && (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        
      </View>
    )
  }
}
