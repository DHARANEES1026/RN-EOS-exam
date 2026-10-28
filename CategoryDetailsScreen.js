
import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useFinance } from '../FinanceContext';
import { COLORS, Card, Heading, money } from '../components';

export default function CategoryDetailsScreen({ route }) {
  const { transactions } = useFinance();
  const categoryName = route.params?.categoryName || 'Other';

  const categoryTransactions = transactions
    .filter((item) => item.category === categoryName)
    .sort((a, b) => b.date.localeCompare(a.date));

  const expenses = categoryTransactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const income = categoryTransactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading>{categoryName} Details</Heading>
      <Text style={styles.subtitle}>
        Transactions recorded in this category.
      </Text>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.label}>Expenses</Text>
          <Text style={styles.expense}>{money(expenses)}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.income}>{money(income)}</Text>
        </Card>
      </View>

      <Heading>Transactions</Heading>

      {categoryTransactions.length === 0 ? (
        <Card>
          <Text style={styles.subtitle}>
            No transactions found for {categoryName}.
          </Text>
        </Card>
      ) : (
        categoryTransactions.map((item) => (
          <Card key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.date}</Text>
              {item.note ? (
                <Text style={styles.note}>{item.note}</Text>
              ) : null}
            </View>

            <Text
              style={[
                styles.amount,
                {
                  color:
                    item.type === 'income' ? COLORS.green : COLORS.red,
                },
              ]}
            >
              {item.type === 'income' ? '+' : '-'}
              {money(item.amount)}
            </Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, paddingBottom: 30 },
  subtitle: { color: COLORS.muted, fontSize: 12, marginTop: 4, lineHeight: 19 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1 },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 8 },
  expense: { color: COLORS.red, fontWeight: '800', fontSize: 16 },
  income: { color: COLORS.green, fontWeight: '800', fontSize: 16 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transactionInfo: { flex: 1 },
  transactionTitle: { color: COLORS.text, fontWeight: '700' },
  note: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  amount: { fontWeight: '800', fontSize: 13 },
});
