import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import MapRateScreen from "../screens/MapRateScreen";
import BusinessDetailScreen, {
  screenOptions as businessDetailScreenOptions,
} from "../screens/BusinessDetailScreen";
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types";
import ExchangeRateList from "../screens/ExchangeRateListScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Search"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Search"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-search" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Rate List"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-list" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="MapRateScreen"
        component={MapRateScreen}
        options={{ headerTitle: "Search Exchange Rate" }}
      />
      <TabOneStack.Screen
        name="BusinessDetailScreen"
        component={BusinessDetailScreen}
        options={businessDetailScreenOptions}
      />
    </TabOneStack.Navigator>
  );
}

const TopTabStack = createMaterialTopTabNavigator();

function TopTabTwoNavigator() {
  return (
    <TopTabStack.Navigator>
      <TopTabStack.Screen name="Banks" component={ExchangeRateList} />
      <TopTabStack.Screen name="Exchanges" component={ExchangeRateList} />
    </TopTabStack.Navigator>
  );
}
const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="ExchangeRateListScreen"
        component={TopTabTwoNavigator}
        options={{ headerTitle: "Latest Exchange Rates" }}
      />
    </TabTwoStack.Navigator>
  );
}
