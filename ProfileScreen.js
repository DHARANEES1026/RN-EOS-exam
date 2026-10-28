
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../FinanceContext';
import {
  COLORS,
  Card,
  Heading,
  Field,
  Button,
} from '../components';

export default function ProfileScreen({ navigation }) {
  const {
    user,
    users,
    updateProfile,
    logout,
  } = useFinance();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  if (!user || user.role !== 'Customer') {
    return (
      <View style={styles.screen}>
        <View style={styles.accessContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={48}
            color={COLORS.primary}
          />
          <Text style={styles.accessTitle}>Access Restricted</Text>
          <Text style={styles.accessText}>
            Only Customer accounts can view and edit this profile.
          </Text>
        </View>
      </View>
    );
  }

  const initials = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : 'C';

  function saveProfile() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      Alert.alert(
        'Validation Error',
        'Please enter your name and email address.'
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    const duplicateEmail = users.some(
      (item) =>
        item.id !== user.id &&
        item.email.toLowerCase() === cleanEmail
    );

    if (duplicateEmail) {
      Alert.alert(
        'Email Already Exists',
        'Please use a different email address.'
      );
      return;
    }

    setSaving(true);

    try {
      updateProfile({
        name: cleanName,
        email: cleanEmail,
      });

      Alert.alert(
        'Profile Updated',
        'Your profile details have been updated successfully.'
      );
    } catch (error) {
      Alert.alert(
        'Update Failed',
        'Unable to update your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  function confirmSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();

            // Reset the root Stack Navigator.
            let rootNavigation = navigation;

            while (rootNavigation.getParent()) {
              rootNavigation = rootNavigation.getParent();
            }

            rootNavigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Manage your personal information.
          </Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          <View style={styles.roleBadge}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.roleText}>Customer Account</Text>
          </View>
        </Card>

        <Heading>Personal Information</Heading>

        <Card>
          <Field
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

          <Field
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={saveProfile}
            disabled={saving}
          />

          <Button
            title="Reset Changes"
            secondary
            onPress={() => {
              setName(user.name || '');
              setEmail(user.email || '');
            }}
          />
        </Card>

        <Heading>Account Information</Heading>

        <Card>
          <View style={styles.infoRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Account Role</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={22}
              color={COLORS.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Registered Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
        </Card>

        <Button
          title="Sign Out"
          secondary
          onPress={confirmSignOut}
        />

        <Text style={styles.footer}>
          Finance & Budget Tracker
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 26,
    marginBottom: 24,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#DCD5FF',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.text,
  },
  profileEmail: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  roleText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  accessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  accessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 16,
  },
  accessText: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  footer: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
  },
});
