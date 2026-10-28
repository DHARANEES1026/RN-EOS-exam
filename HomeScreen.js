
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../FinanceContext';
import {
  COLORS,
  Card,
  Button,
  Heading,
  money,
} from '../components';

export default function HomeScreen({ navigation }) {
  const { user, totals, transactions, alerts } = useFinance();

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const currentWeekDate = new Date();
  currentWeekDate.setDate(currentWeekDate.getDate() - 6);
  const weekStart = currentWeekDate.toISOString().slice(0, 10);

  const todayTransactions = transactions.filter((item) => item.date === today);
  const weekTransactions = transactions.filter(
    (item) => item.date >= weekStart && item.date <= today
  );
  const monthTransactions = transactions.filter(
    (item) => item.date.startsWith(currentMonth)
  );

  const getTotals = (items) =>
    items.reduce(
      (result, item) => {
        if (item.type === 'income') result.income += Number(item.amount);
        else result.expenses += Number(item.amount);
        return result;
      },
      { income: 0, expenses: 0 }
    );

  const todayTotals = getTotals(todayTransactions);
  const weekTotals = getTotals(weekTransactions);
  const monthTotals = getTotals(monthTransactions);

  function openAuth(mode) {
    navigation.navigate('Auth', { mode });
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user ? `Hello, ${user.name} 👋` : 'Welcome 👋'}
          </Text>
          <Text style={styles.subtitle}>Your money, made easier.</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="wallet-outline" size={26} color={COLORS.primary} />
        </View>
      </View>

      {!user && (
        <Card>
          <Heading>Finance & Budget Tracker</Heading>
          <Text style={styles.bodyText}>
            Track your income, monitor expenses, and understand your spending
            habits in one place.
          </Text>
          <Button title="Sign In" onPress={() => openAuth('Sign In')} />
          <Button
            title="Create Account"
            secondary
            onPress={() => openAuth('Sign Up')}
          />
        </Card>
      )}

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balance}>{money(totals.balance)}</Text>
        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.balanceLabel}>Income</Text>
            <Text style={styles.income}>{money(totals.income)}</Text>
          </View>
          <View>
            <Text style={styles.balanceLabel}>Expenses</Text>
            <Text style={styles.expense}>{money(totals.expenses)}</Text>
          </View>
        </View>
      </Card>

      <Heading>Reports</Heading>
      <View style={styles.reportRow}>
        {[
          { title: 'Today', values: todayTotals },
          { title: 'Last 7 Days', values: weekTotals },
          { title: 'This Month', values: monthTotals },
        ].map((report) => (
          <Card key={report.title} style={styles.reportCard}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <Text style={styles.incomeSmall}>
              +{money(report.values.income)}
            </Text>
            <Text style={styles.expenseSmall}>
              -{money(report.values.expenses)}
            </Text>
          </Card>
        ))}
      </View>

      <Heading>Personalized Alerts</Heading>
      {alerts.slice(0, 3).map((alert, index) => (
        <Card key={`${alert}-${index}`} style={styles.alertCard}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
          <Text style={styles.alertText}>{alert}</Text>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Heading>Recent Transactions</Heading>
        {user?.role === 'Customer' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Transactions')}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions.slice(0, 4).map((item) => (
        <Card key={item.id} style={styles.transactionCard}>
          <View style={styles.transactionIcon}>
            <Ionicons
              name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
              size={20}
              color={item.type === 'income' ? COLORS.green : COLORS.red}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.subtitle}>
              {item.category} · {item.date}
            </Text>
          </View>
          <Text
            style={[
              styles.transactionAmount,
              { color: item.type === 'income' ? COLORS.green : COLORS.red },
            ]}
          >
            {item.type === 'income' ? '+' : '-'}
            {money(item.amount)}
          </Text>
        </Card>
      ))}

      {user && (
        <Text style={styles.footerText}>
          Signed in as {user.role}. Use the menu to access available screens.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 18, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subtitle: { color: COLORS.muted, marginTop: 4, fontSize: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyText: { color: COLORS.muted, lineHeight: 22, marginBottom: 12 },
  balanceCard: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  balanceLabel: { color: '#E5E1FF', fontSize: 13 },
  balance: { color: COLORS.white, fontSize: 30, fontWeight: '800', marginVertical: 10 },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#8275E7',
    paddingTop: 14,
    marginTop: 6,
  },
  income: { color: '#BBF7D0', fontWeight: '700', marginTop: 5 },
  expense: { color: '#FECACA', fontWeight: '700', marginTop: 5 },
  reportRow: { flexDirection: 'row', gap: 7 },
  reportCard: { flex: 1, padding: 10 },
  reportTitle: { fontSize: 11, color: COLORS.muted, marginBottom: 8 },
  incomeSmall: { color: COLORS.green, fontSize: 11, fontWeight: '700', marginBottom: 5 },
  expenseSmall: { color: COLORS.red, fontSize: 11, fontWeight: '700' },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertText: { flex: 1, color: COLORS.text, lineHeight: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: { color: COLORS.primary, fontWeight: '700', marginBottom: 14 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: { flex: 1 },
  transactionTitle: { color: COLORS.text, fontWeight: '700' },
  transactionAmount: { fontWeight: '800', fontSize: 13 },
  footerText: { color: COLORS.muted, textAlign: 'center', marginTop: 10 },
});
