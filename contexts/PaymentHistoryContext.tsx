import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PaymentHistoryItem {
  id: string;
  type: 'topup' | 'electricity' | 'water' | 'internet' | 'bank-transfer' | 'load-money' | 'airlines' | 'bus' | 'tv' | 'school' | 'send-money';
  title: string;
  subtitle: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  transactionId: string;
  recipient?: string;
  provider?: string;
  icon: string;
  color: string;
  category: 'payment' | 'transfer' | 'topup' | 'bills';
}

interface PaymentHistoryContextType {
  payments: PaymentHistoryItem[];
  addPayment: (payment: Omit<PaymentHistoryItem, 'id'>) => Promise<void>;
  getPaymentsByCategory: (category: string) => PaymentHistoryItem[];
  getRecentPayments: (limit?: number) => PaymentHistoryItem[];
  clearHistory: () => Promise<void>;
  isLoading: boolean;
}

const PaymentHistoryContext = createContext<PaymentHistoryContextType | undefined>(undefined);

interface PaymentHistoryProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@esewa_payment_history';

export function PaymentHistoryProvider({ children }: PaymentHistoryProviderProps) {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load payment history from storage on app start
  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const storedPayments = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPayments) {
        const parsedPayments = JSON.parse(storedPayments);
        setPayments(parsedPayments);
      } else {
        // Initialize with some sample data for demo
        const samplePayments = generateSamplePayments();
        setPayments(samplePayments);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(samplePayments));
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePaymentHistory = async (newPayments: PaymentHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPayments));
    } catch (error) {
      console.error('Error saving payment history:', error);
    }
  };

  const addPayment = async (payment: Omit<PaymentHistoryItem, 'id'>) => {
    const newPayment: PaymentHistoryItem = {
      ...payment,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);
    await savePaymentHistory(updatedPayments);
  };

  const getPaymentsByCategory = (category: string) => {
    if (category === 'all') return payments;
    return payments.filter(payment => payment.category === category);
  };

  const getRecentPayments = (limit: number = 5) => {
    return payments.slice(0, limit);
  };

  const clearHistory = async () => {
    setPayments([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const generateSamplePayments = (): PaymentHistoryItem[] => {
    return [
      {
        id: '1',
        type: 'topup',
        title: 'Ncell Recharge',
        subtitle: 'Mobile Top-up',
        amount: 100,
        status: 'completed',
        date: '2024-01-20',
        time: '2:30 PM',
        transactionId: 'TXN123456789',
        provider: 'Ncell',
        icon: '📱',
        color: '#7C3AED',
        category: 'topup'
      },
      {
        id: '2',
        type: 'electricity',
        title: 'Nepal Electricity Authority',
        subtitle: 'Electricity Bill',
        amount: 850,
        status: 'completed',
        date: '2024-01-20',
        time: '1:15 PM',
        transactionId: 'TXN123456788',
        provider: 'NEA',
        icon: '⚡',
        color: '#EAB308',
        category: 'bills'
      },
      {
        id: '3',
        type: 'bank-transfer',
        title: 'Ram Sharma',
        subtitle: 'Bank Transfer',
        amount: 5000,
        status: 'completed',
        date: '2024-01-19',
        time: '8:45 PM',
        transactionId: 'TXN123456787',
        recipient: 'Ram Sharma',
        icon: '🏦',
        color: '#1E40AF',
        category: 'transfer'
      },
      {
        id: '4',
        type: 'water',
        title: 'KUKL Water Bill',
        subtitle: 'Water Bill Payment',
        amount: 450,
        status: 'completed',
        date: '2024-01-19',
        time: '3:20 PM',
        transactionId: 'TXN123456786',
        provider: 'KUKL',
        icon: '💧',
        color: '#3B82F6',
        category: 'bills'
      },
      {
        id: '5',
        type: 'load-money',
        title: 'Money Loaded',
        subtitle: 'Bank Transfer',
        amount: 2000,
        status: 'completed',
        date: '2024-01-18',
        time: '6:15 PM',
        transactionId: 'TXN123456785',
        provider: 'Bank Transfer',
        icon: '💰',
        color: '#059669',
        category: 'payment'
      }
    ];
  };

  return (
    <PaymentHistoryContext.Provider value={{
      payments,
      addPayment,
      getPaymentsByCategory,
      getRecentPayments,
      clearHistory,
      isLoading
    }}>
      {children}
    </PaymentHistoryContext.Provider>
  );
}

export function usePaymentHistory() {
  const context = useContext(PaymentHistoryContext);
  if (context === undefined) {
    throw new Error('usePaymentHistory must be used within a PaymentHistoryProvider');
  }
  return context;
}