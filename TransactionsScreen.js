
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useFinance } from '../FinanceContext';
import { categories } from '../data';
import { COLORS, Card, Heading, Field, Button, money } from '../components';

export default function TransactionsScreen() {
  const { user, transactions, addTransaction, deleteTransaction } =
    useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const months = useMemo(() => {
    const uniqueMonths = [
      ...new Set(transactions.map((item) => item.date.slice(0, 7))),
    ];
    if (!uniqueMonths.includes(month)) uniqueMonths.push(month);
    return uniqueMonths.sort((a, b) => b.localeCompare(a));
  }, [transactions, month]);

  const filteredTransactions = transactions
    .filter((item) => item.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (user?.role !== 'Customer') {
    return (
      <View style={styles.screen}>
        <Text style={styles.info}>
          Transactions are available to Customer accounts only.
        </Text>
      </View>
    );
  }

  function submitTransaction() {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Validation', 'Enter a title and amount.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Validation', 'Enter the date in YYYY-MM-DD format.');
      return;
    }

    const result = addTransaction({
      title,
      amount,
      category,
      type,
      date,
    });

    if (!result.success) {
      Alert.alert('Unable to Add Transaction', result.message);
      return;
    }

    setTitle('');
    setAmount('');
    setMonth(date.slice(0, 7));
    Alert.alert('Success', result.message);
  }

  function confirmDelete(item) {
    Alert.alert('Delete Transaction', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(item.id),
      },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Heading>Transactions</Heading>
      <Text style={styles.subtitle}>
        Add your income and expenses, then select a month to review them.
      </Text>

      <Card>
        <Heading style={styles.smallHeading}>Add Transaction</Heading>

        <View style={styles.typeRow}>
          {['expense', 'income'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setType(item)}
              style={[
                styles.typeButton,
                type === item && styles.selectedType,
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  type === item && styles.selectedTypeText,
                ]}
              >
                {item === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field
          label="Transaction Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Grocery shopping"
        />

        <Field
          label="Amount (₹)"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
        />

        <Text style={styles.fieldLabel}>Category</Text>
        <View style={styles.categoryOptions}>
          {categories
            .filter((item) =>
              type === 'income'
                ? ['Salary', 'Freelance', 'Other'].includes(item.name)
                : !['Salary', 'Freelance'].includes(item.name)
            )
            .map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => setCategory(item.name)}
                style={[
                  styles.categoryChip,
                  category === item.name && styles.selectedCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === item.name && styles.selectedCategoryText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        <Field
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2026-10-28"
        />

        <Button title="Add Transaction" onPress={submitTransaction} />
      </Card>

      <Heading>Month-wise Transactions</Heading>

      <View style={styles.monthRow}>
        {months.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setMonth(item)}
            style={[
              styles.monthChip,
              month === item && styles.selectedMonth,
            ]}
          >
            <Text
              style={[
                styles.monthText,
                month === item && styles.selectedMonthText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTransactions.length === 0 ? (
        <Card>
          <Text style={styles.subtitle}>No transactions for {month}.</Text>
        </Card>
      ) : (
        filteredTransactions.map((item) => (
          <Card key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.subtitle}>
                {item.category} · {item.date}
              </Text>
            </View>
            <View style={styles.amountColumn}>
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
              <TouchableOpacity onPress={() => confirmDelete(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
  smallHeading: { fontSize: 18, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  selectedType: { backgroundColor: COLORS.lightPurple, borderColor: COLORS.primary },
  typeText: { color: COLORS.muted, fontWeight: '600' },
  selectedTypeText: { color: COLORS.primary },
  fieldLabel: { color: COLORS.text, fontWeight: '700', marginBottom: 9 },
  categoryOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedCategory: { backgroundColor: COLORS.lightPurple, borderColor: COLORS.primary },
  categoryChipText: { color: COLORS.muted, fontSize: 12 },
  selectedCategoryText: { color: COLORS.primary, fontWeight: '700' },
  monthRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  monthChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
  },
  selectedMonth: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  monthText: { color: COLORS.text, fontSize: 12 },
  selectedMonthText: { color: COLORS.white, fontWeight: '700' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transactionInfo: { flex: 1 },
  transactionTitle: { color: COLORS.text, fontWeight: '700' },
  amountColumn: { alignItems: 'flex-end' },
  amount: { fontWeight: '800', fontSize: 13 },
  deleteText: { color: COLORS.red, fontSize: 12, marginTop: 7 },
  info: { color: COLORS.muted, padding: 20 },
});
