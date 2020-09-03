import React from 'react'
import { Image } from 'react-native'
import EventsScreen from './screens/EventsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import RosterScreen from './screens/RosterScreen'
import WrestlerScreen from './screens/WrestlerScreen'
import { navigationRef } from './RootNavigation'
import { Wrestler, Event, Championship } from './types'
import HomeScreen from './screens/HomeScreen'
import EventPage from './screens/EventPage'
import { images } from './assets'
import ChampionshipPage from './screens/ChampionshipPage'
import TagTeamScreen from './screens/TagTeamScreen'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { colors } from './styles'
import GoToModal from './GoToModal'
import { observer, Provider } from 'mobx-react'
import favoritesStore from "./FavoritesStore"

export type RootStackParamList = {
  Home: undefined, 
  Roster: undefined,
  Wrestler: { wrestler: Wrestler },
  Event: { event: Event },
  Championship: { championship: Championship }
  TagTeam: { tagTeam: TagTeam }
}

const RootStack = createStackNavigator<RootStackParamList>()

const homeScreenOptions: StackNavigationOptions = {
  headerTitle: () => <Image style={{ height: 50, width: 60 }} source={images.aewLogo} />,
  headerStyle: { backgroundColor: "black" }
}

function HomeStack() {
  return (
    <RootStack.Navigator headerMode="screen" screenOptions={screenOptions}>
      <RootStack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
      <RootStack.Screen
        name="Championship"
        component={ChampionshipPage}
        options={({ route }) => ({ title: route.params.championship.name })}
      />
      <RootStack.Screen
        name="Wrestler"
        component={WrestlerScreen}
        options={({ route }) => ({ title: route.params.wrestler.name })}
      />
      <RootStack.Screen
        name="TagTeam"
        component={TagTeamScreen}
        options={({ route }) => ({ title: route.params.tagTeam.name })}
      />
      <RootStack.Screen
        name="Event"
        component={EventPage}
        options={({ route }) => ({ title: route.params.event.name })}
      />
    </RootStack.Navigator>
  )
}

const screenOptions: StackNavigationOptions = {
  headerTitleAlign: "center",
  headerTitleStyle: { color: "white", alignSelf: "center" },
  headerStyle: { backgroundColor: colors.black },
  headerTintColor: "white"
}

function RosterStack() {
  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen name="Roster" component={RosterScreen} />
      <RootStack.Screen
        name="Wrestler"
        component={WrestlerScreen}
        options={({ route }) => ({ title: route.params.wrestler.name })}
      />
      <RootStack.Screen
        name="Event"
        component={EventPage}
        options={({ route }) => ({ title: route.params.event.name })}
      />
      <RootStack.Screen
        name="TagTeam"
        component={TagTeamScreen}
        options={({ route }) => ({ title: route.params.tagTeam.name })}
      />
    </RootStack.Navigator>
  )
}

function EventsStack() {
  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen name="Events" component={EventsScreen} />
      <RootStack.Screen
        name="Wrestler"
        component={WrestlerScreen}
        options={({ route }) => ({ title: route.params.wrestler.name })}
      />
      <RootStack.Screen
        name="Event"
        component={EventPage}
        options={({ route }) => ({ title: route.params.event.name })}
      />
    </RootStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

@observer
export default class App extends React.Component {
  render() {
    return (
      <>
        <NavigationContainer ref={navigationRef}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case "Home":
                    iconName = "md-home"
                    break
                  case "Roster":
                    iconName = "ios-people"
                    break
                  case "Events":
                    return <MaterialIcons name="event" size={size} color={color} />
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: colors.aewYellow,
              inactiveTintColor: colors.white,
              activeBackgroundColor: colors.black,
              inactiveBackgroundColor: colors.black
            }}
          >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Roster" component={RosterStack} />
            <Tab.Screen name="Events" component={EventsStack} />
          </Tab.Navigator>
        </NavigationContainer>
        <GoToModal />
      </>
    )
  }
}
