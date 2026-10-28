
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFinance } from '../FinanceContext';
import { COLORS, Card, Button, Field, Heading } from '../components';

export default function AuthScreen({ navigation, route }) {
  const [mode, setMode] = useState(route.params?.mode || 'Sign In');
  const [role, setRole] = useState('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, signup } = useFinance();
  const isSignup = mode === 'Sign Up';

  function submit() {
    if (!email.trim() || !password) {
      Alert.alert('Validation', 'Please enter your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return;
    }

    if (isSignup) {
      if (!name.trim()) {
        Alert.alert('Validation', 'Please enter your name.');
        return;
      }

      const result = signup(name, email, password, role);

      if (!result.success) {
        Alert.alert('Sign Up Failed', result.message);
        return;
      }

      Alert.alert('Success', result.message, [
        {
          text: 'Continue',
          onPress: () => {
            setMode('Sign In');
            setPassword('');
          },
        },
      ]);
      return;
    }

    const result = login(email, password, role);

    if (!result.success) {
      Alert.alert('Sign In Failed', result.message);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.logo}>
        <Text style={styles.logoText}>₹</Text>
      </View>

      <Heading style={styles.title}>
        {isSignup ? 'Create Account' : 'Welcome Back'}
      </Heading>
      <Text style={styles.subtitle}>
        {isSignup
          ? 'Register to start managing your finances.'
          : 'Sign in to manage your budget and transactions.'}
      </Text>

      <Card>
        <Text style={styles.label}>Choose Account Type</Text>
        <View style={styles.roleRow}>
          {['Customer', 'Admin'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setRole(item)}
              style={[
                styles.roleButton,
                role === item && styles.selectedRole,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  role === item && styles.selectedRoleText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isSignup && (
          <Field
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        )}

        <Field
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          keyboardType="email-address"
        />

        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <Button
          title={isSignup ? 'Create Account' : 'Sign In'}
          onPress={submit}
        />

        <TouchableOpacity
          onPress={() => setMode(isSignup ? 'Sign In' : 'Sign Up')}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isSignup
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.demoTitle}>Demo Accounts</Text>
      <Text style={styles.demoText}>Admin: admin@test.com / admin123</Text>
      <Text style={styles.demoText}>Customer: customer@test.com / user123</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  back: { fontSize: 17, color: COLORS.primary, marginBottom: 22 },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  logoText: { fontSize: 38, fontWeight: '800', color: COLORS.primary },
  title: { textAlign: 'center', marginBottom: 4 },
  subtitle: {
    textAlign: 'center',
    color: COLORS.muted,
    lineHeight: 21,
    marginBottom: 20,
  },
  label: { color: COLORS.text, fontWeight: '700', marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedRole: { backgroundColor: COLORS.lightPurple, borderColor: COLORS.primary },
  roleText: { color: COLORS.muted, fontWeight: '600' },
  selectedRoleText: { color: COLORS.primary },
  switchButton: { alignItems: 'center', paddingVertical: 12 },
  switchText: { color: COLORS.primary, fontWeight: '700', textAlign: 'center' },
  demoTitle: { color: COLORS.text, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  demoText: { color: COLORS.muted, marginBottom: 4 },
});
