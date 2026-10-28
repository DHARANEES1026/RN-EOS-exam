
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../FinanceContext';
import { COLORS } from '../components';

import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabsNavigator() {
  const { user } = useFinance();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 62,
          paddingBottom: 7,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Analysis: 'pie-chart-outline',
            Transactions: 'receipt-outline',
            Categories: 'grid-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] || 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />

      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ title: 'Analysis' }}
      />

      {user?.role === 'Customer' && (
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ title: 'Transactions' }}
        />
      )}

      {user?.role === 'Customer' && (
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ title: 'Categories' }}
        />
      )}
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  const { user, logout } = useFinance();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.text,
        drawerStyle: {
          backgroundColor: COLORS.card,
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabsNavigator}
        options={{
          title: 'Finance & Budget Tracker',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="speedometer-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {user?.role === 'Customer' && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="Sign Out"
        component={SignOutScreen}
        options={{
          title: 'Sign Out',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="log-out-outline"
              size={size}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (event) => {
            event.preventDefault();

            logout();

            let parent = navigation;
            while (parent.getParent()) {
              parent = parent.getParent();
            }

            parent.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        })}
      />
    </Drawer.Navigator>
  );
}

function SignOutScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator color={COLORS.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const { user } = useFinance();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Auth"
        component={AuthScreen}
      />

      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
      />

      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{
          headerShown: true,
          title: 'Category Details',
          headerTintColor: COLORS.primary,
          headerStyle: {
            backgroundColor: COLORS.card,
          },
        }}
      />
    </Stack.Navigator>
  );
}
