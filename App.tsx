import React from 'react'
import { Image } from 'react-native'
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
import { images } from './assets'

export type RootStackParamList = {
  Home: undefined, 
  Roster: undefined,
  Wrestler: { wrestler: Wrestler },
  Event: { event: Event }
}

const RootStack = createStackNavigator<RootStackParamList>()

const screenOptions: StackNavigationOptions = {
  headerTitle: () => <Image style={{ height: 50, width: 60, alignSelf: "center", overflow: "hidden" }} source={images.aewLogo} />,
  headerStyle: { backgroundColor: "black" }
}

function HomeStack() {
  return (
    <RootStack.Navigator headerMode="screen" screenOptions={screenOptions}>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="Wrestler" component={WrestlerScreen} />
      <RootStack.Screen name="Event" component={EventPage} />
    </RootStack.Navigator>
  )
}

function RosterStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Roster" component={RosterScreen} options={screenOptions} />
      <RootStack.Screen name="Wrestler" component={WrestlerScreen} options={({ route }) => ({ title: route.params.wrestler.name })}/>
      <RootStack.Screen name="Event" component={EventPage} />
    </RootStack.Navigator>
  )
}

function EventsStack() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Events" component={EventsScreen} />
      <RootStack.Screen name="Wrestler" component={WrestlerScreen} />
      <RootStack.Screen name="Event" component={EventPage} />
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
