import React from 'react'
import { Image, TouchableHighlightBase, TouchableOpacity } from 'react-native'
import EventsScreen from './screens/EventsScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import RosterScreen from './screens/RosterScreen'
import WrestlerScreen from './screens/WrestlerScreen'
import { navigate, navigationRef } from './RootNavigation'
import { Wrestler, Event, Championship, TagTeam } from './types'
import HomeScreen from './screens/HomeScreen'
import EventPage from './screens/EventPage'
import { images } from './assets'
import ChampionshipPage from './screens/ChampionshipPage'
import TagTeamScreen from './screens/TagTeamScreen'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { colors } from './styles'
import GoToModal from './GoToModal'
import { observer, Provider } from 'mobx-react'
import { StoreProvider } from "./FavoritesStore"
import TaleOfTheTape from './screens/TaleOfTheTape'

export type RootStackParamList = {
  Home: undefined, 
  Roster: undefined,
  Events: undefined,
  Wrestler: { wrestler: Wrestler },
  Event: { event: Event },
  Championship: { championship: Championship }
  TagTeam: { tagTeam: TagTeam },
  TaleOfTheTape: { wrestler1: Wrestler, wrestler2: Wrestler }
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
        options={({ route }) => ({
          title: route.params.wrestler.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigate("TaleOfTheTape", {
                wrestler1: route.params.wrestler,
                wrestler2: route.params.wrestler
              })}
            >
             <Ionicons name="md-people" size={32} color="white" style={{ paddingRight: 10 }} />
            </TouchableOpacity>
          )
        })}
      />
      <RootStack.Screen
        name="TaleOfTheTape"
        component={TaleOfTheTape}
        options={{ title: "Tale of the Tape" }}
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
      <StoreProvider>
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
          <GoToModal />
        </NavigationContainer>
      </StoreProvider>
    )
  }
}
