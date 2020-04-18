import React from 'react'
import EventsScreen from './screens/EventsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import RosterScreen from './screens/RosterScreen'
import WrestlerScreen from './screens/WrestlerScreen'
import { navigationRef } from './RootNavigation'
import { Wrestler, Event } from './types'
import HomeScreen from './screens/HomeScreen'
import EventPage from './screens/EventPage'

export type RootStackParamList = {
  Home: undefined, 
  Roster: undefined,
  Wrestler: { wrestler: Wrestler },
  Event: { event: Event }
}

const RootStack = createStackNavigator<RootStackParamList>()

const screenOptions: StackNavigationOptions = {
  // header: () => <Image style={{ height: 80, width: 80, alignSelf: 'center' }} source={require('./assets/images/aew-logo.jpg')} />,
  // headerStyle: { backgroundColor: 'black' }
}

function HomeStack() {
  return (
    <RootStack.Navigator headerMode="screen">
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="Roster" component={RosterScreen} />
      <RootStack.Screen name="Wrestler" component={WrestlerScreen} />
      <RootStack.Screen name="Event" component={EventPage} />
    </RootStack.Navigator>
  )
}

function RosterStack() {
  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen name="Roster" component={RosterScreen} />
      <RootStack.Screen name="Wrestler" component={WrestlerScreen} />
      <RootStack.Screen name="Event" component={EventPage} />
    </RootStack.Navigator>
  )
}

function EventsStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Events" component={EventsScreen} />
    </RootStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Roster" component={RosterStack} />
        <Tab.Screen name="Events" component={EventsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
