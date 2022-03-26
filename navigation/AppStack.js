import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screen/App/Home';
import {DashboardStack} from './DashboardStack';
import DashboardBottomSheet from '../components/DashboardBottomSheet';
import AppConfig from '../redux/app-config';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const Dashboard = () => {
  return (
    <Tab.Navigator tabBar={props => <DashboardBottomSheet {...props} />}>
      <Tab.Screen name="Tab" component={DashboardStack} />
    </Tab.Navigator>
  );
};

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppConfig.SCREEN.HOME}
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={AppConfig.SCREEN.DASHBOARD}
        component={Dashboard}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
