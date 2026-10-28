
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { FinanceProvider } from './FinanceContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <FinanceProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </FinanceProvider>
  );
}
