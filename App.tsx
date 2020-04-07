import React from 'react'
import EventsScreen from './screens/EventsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import RosterScreen from './screens/RosterScreen'
import WrestlerScreen from './screens/WrestlerScreen'
import { navigationRef } from './RootNavigation'
import { Wrestler } from './types'

export type RootStackParamList = {
  Roster: undefined,
  Wrestler: { wrestler: Wrestler }
}

const HomeStack = createStackNavigator<RootStackParamList>()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Roster" component={RosterScreen} />
      <HomeStack.Screen name="Wrestler" component={WrestlerScreen} />
    </HomeStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator>
        <Tab.Screen name="Wrestlers" component={HomeStackScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
