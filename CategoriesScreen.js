
import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../FinanceContext';
import { categories } from '../data';
import { COLORS, Card, Heading, money } from '../components';

export default function CategoriesScreen({ navigation }) {
  const { user, transactions } = useFinance();

  if (user?.role !== 'Customer') {
    return (
      <View style={styles.screen}>
        <Text style={styles.info}>
          Categories are available to Customer accounts only.
        </Text>
      </View>
    );
  }

  function openCategory(categoryName) {
    navigation.getParent()?.getParent()?.navigate('CategoryDetails', {
      categoryName,
    });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading>Overall Categories</Heading>
      <Text style={styles.subtitle}>
        Choose a category to see its transactions.
      </Text>

      {categories.map((category) => {
        const categoryTransactions = transactions.filter(
          (item) =>
            item.category === category.name && item.type === 'expense'
        );

        const total = categoryTransactions.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );

        return (
          <TouchableOpacity
            key={category.name}
            activeOpacity={0.8}
            onPress={() => openCategory(category.name)}
          >
            <Card style={styles.categoryCard}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${category.color}20` },
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={23}
                  color={category.color}
                />
              </View>

              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.subtitle}>
                  {categoryTransactions.length}{' '}
                  {categoryTransactions.length === 1
                    ? 'transaction'
                    : 'transactions'}
                </Text>
              </View>

              <View style={styles.totalArea}>
                <Text style={styles.total}>{money(total)}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.muted}
                />
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, paddingBottom: 30 },
  subtitle: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    height: 46,
    width: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: { flex: 1 },
  categoryName: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  totalArea: { alignItems: 'flex-end', gap: 5 },
  total: { color: COLORS.text, fontWeight: '800' },
  info: { color: COLORS.muted, padding: 20 },
});
