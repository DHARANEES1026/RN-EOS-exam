
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useFinance } from '../FinanceContext';
import { COLORS, Card, Heading, money } from '../components';

export default function AnalysisScreen() {
  const { transactions, totals } = useFinance();

  const expenseTransactions = transactions.filter(
    (item) => item.type === 'expense'
  );

  const categoryTotals = expenseTransactions.reduce((result, item) => {
    result[item.category] =
      (result[item.category] || 0) + Number(item.amount);
    return result;
  }, {});

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const expenseTotal = totals.expenses || 1;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading>Financial Analysis</Heading>
      <Text style={styles.subtitle}>
        Understand your income and spending at a glance.
      </Text>

      <Card style={styles.balanceCard}>
        <Text style={styles.lightText}>Available Balance</Text>
        <Text style={styles.balance}>{money(totals.balance)}</Text>
      </Card>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.label}>Total Income</Text>
          <Text style={styles.income}>{money(totals.income)}</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.label}>Total Expenses</Text>
          <Text style={styles.expense}>{money(totals.expenses)}</Text>
        </Card>
      </View>

      <Heading>Expense Breakdown</Heading>

      {Object.entries(categoryTotals).length === 0 ? (
        <Card>
          <Text style={styles.subtitle}>No expense transactions yet.</Text>
        </Card>
      ) : (
        Object.entries(categoryTotals)
          .sort((a, b) => b[1] - a[1])
          .map(([category, amount]) => {
            const percentage = Math.min(
              100,
              (amount / expenseTotal) * 100
            );

            return (
              <Card key={category}>
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryAmount}>{money(amount)}</Text>
                </View>
                <View style={styles.progressBackground}>
                  <View
                    style={[styles.progress, { width: `${percentage}%` }]}
                  />
                </View>
                <Text style={styles.percentage}>
                  {percentage.toFixed(1)}% of total expenses
                </Text>
              </Card>
            );
          })
      )}

      <Heading>Insights</Heading>
      <Card>
        <Text style={styles.insight}>
          {totals.balance >= 0
            ? 'Your recorded income is greater than your expenses.'
            : 'Your recorded expenses are greater than your income.'}
        </Text>
      </Card>
      {highestCategory && (
        <Card>
          <Text style={styles.insight}>
            Your highest expense category is {highestCategory[0]} at{' '}
            {money(highestCategory[1])}.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, paddingBottom: 30 },
  subtitle: { color: COLORS.muted, marginBottom: 16, lineHeight: 20 },
  balanceCard: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  lightText: { color: '#E5E1FF' },
  balance: { color: COLORS.white, fontSize: 30, fontWeight: '800', marginTop: 10 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1 },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 8 },
  income: { color: COLORS.green, fontWeight: '800', fontSize: 16 },
  expense: { color: COLORS.red, fontWeight: '800', fontSize: 16 },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryName: { color: COLORS.text, fontWeight: '700' },
  categoryAmount: { color: COLORS.text, fontWeight: '800' },
  progressBackground: {
    height: 8,
    backgroundColor: '#EDEDF3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progress: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  percentage: { color: COLORS.muted, fontSize: 11, marginTop: 7 },
  insight: { color: COLORS.text, lineHeight: 21 },
});
