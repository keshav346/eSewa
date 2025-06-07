import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  balance: number;
  addMoney: (amount: number) => void;
  deductMoney: (amount: number) => boolean;
  formatBalance: (showBalance: boolean) => string;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
  children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  const [balance, setBalance] = useState(746.80); // Initial balance

  const addMoney = (amount: number) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  const deductMoney = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prevBalance => prevBalance - amount);
      return true; // Transaction successful
    }
    return false; // Insufficient balance
  };

  const formatBalance = (showBalance: boolean): string => {
    return showBalance ? balance.toFixed(2) : 'XXXX.XX';
  };

  return (
    <BalanceContext.Provider value={{ balance, addMoney, deductMoney, formatBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}