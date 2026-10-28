
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { initialTransactions } from './data';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'Admin',
    },
    {
      id: 'customer-1',
      name: 'Customer',
      email: 'customer@test.com',
      password: 'user123',
      role: 'Customer',
    },
  ]);

  const [transactions, setTransactions] = useState(initialTransactions);
  const [alerts, setAlerts] = useState([
    'Welcome! Review your spending to stay within your budget.',
  ]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenses = transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  function login(email, password, role) {
    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password &&
        item.role === role
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Invalid email, password, or account role.',
      };
    }

    const { password: ignoredPassword, ...safeUser } = foundUser;
    setUser(safeUser);

    return { success: true, user: safeUser };
  }

  function signup(name, email, password, role) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Password must contain at least 6 characters.',
      };
    }

    if (users.some((item) => item.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      };
    }

    if (!['Admin', 'Customer'].includes(role)) {
      return { success: false, message: 'Please select a valid role.' };
    }

    const newUser = {
      id: String(Date.now()),
      name: cleanName,
      email: cleanEmail,
      password,
      role,
    };

    setUsers((previous) => [...previous, newUser]);

    return {
      success: true,
      message: 'Account created. You can now sign in.',
    };
  }

  function logout() {
    setUser(null);
  }

  function addTransaction(transaction) {
    const amount = Number(transaction.amount);

    if (!transaction.title?.trim()) {
      return { success: false, message: 'Enter a transaction title.' };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, message: 'Enter an amount greater than zero.' };
    }

    const newTransaction = {
      ...transaction,
      id: String(Date.now()),
      title: transaction.title.trim(),
      amount,
      date: transaction.date || new Date().toISOString().slice(0, 10),
    };

    setTransactions((previous) => [newTransaction, ...previous]);

    setAlerts((previous) => [
      `${newTransaction.type === 'income' ? 'Income' : 'Expense'} added: ${
        newTransaction.title
      } — ₹${amount.toLocaleString('en-IN')}.`,
      ...previous,
    ]);

    return { success: true, message: 'Transaction added successfully.' };
  }

  function deleteTransaction(id) {
    const selected = transactions.find((item) => item.id === id);

    if (!selected) {
      return { success: false, message: 'Transaction not found.' };
    }

    setTransactions((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setAlerts((previous) => [
      `Transaction removed: ${selected.title}.`,
      ...previous,
    ]);

    return { success: true, message: 'Transaction deleted.' };
  }

  function updateProfile(updatedDetails) {
    if (!user) return;

    const updatedUser = { ...user, ...updatedDetails };
    setUser(updatedUser);

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, ...updatedDetails } : item
      )
    );
  }

  const value = {
    user,
    users,
    transactions,
    alerts,
    totals,
    login,
    signup,
    logout,
    addTransaction,
    deleteTransaction,
    updateProfile,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance must be used inside FinanceProvider.');
  }

  return context;
}
