import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Smartphone,
  Zap,
  Gift
} from 'lucide-react-native';

export default function StatementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'sent', label: 'Sent' },
    { id: 'received', label: 'Received' },
    { id: 'bills', label: 'Bills' },
    { id: 'topup', label: 'Top-up' },
  ];

  const transactions = [
    {
      id: 1,
      type: 'sent',
      title: 'Ram Sharma',
      subtitle: 'Money Transfer',
      amount: -2500,
      date: '2024-01-20',
      time: '2:30 PM',
      status: 'completed',
      icon: ArrowUpRight,
      color: '#DC2626'
    },
    {
      id: 2,
      type: 'received',
      title: 'Sita Devi',
      subtitle: 'Money Received',
      amount: +1200,
      date: '2024-01-20',
      time: '1:15 PM',
      status: 'completed',
      icon: ArrowDownLeft,
      color: '#059669'
    },
    {
      id: 3,
      type: 'bills',
      title: 'Nepal Electricity Authority',
      subtitle: 'Electricity Bill',
      amount: -850,
      date: '2024-01-20',
      time: '12:45 PM',
      status: 'completed',
      icon: Zap,
      color: '#EAB308'
    },
    {
      id: 4,
      type: 'topup',
      title: 'Ncell Recharge',
      subtitle: 'Mobile Top-up',
      amount: -100,
      date: '2024-01-19',
      time: '8:20 PM',
      status: 'completed',
      icon: Smartphone,
      color: '#EA580C'
    },
    {
      id: 5,
      type: 'sent',
      title: 'Maya Gurung',
      subtitle: 'Money Transfer',
      amount: -5000,
      date: '2024-01-19',
      time: '3:45 PM',
      status: 'completed',
      icon: ArrowUpRight,
      color: '#DC2626'
    },
    {
      id: 6,
      type: 'bills',
      title: 'Worldlink Internet',
      subtitle: 'Internet Bill',
      amount: -1200,
      date: '2024-01-19',
      time: '11:30 AM',
      status: 'completed',
      icon: Receipt,
      color: '#7C3AED'
    },
    {
      id: 7,
      type: 'received',
      title: 'Krishna Bahadur',
      subtitle: 'Money Received',
      amount: +3500,
      date: '2024-01-18',
      time: '6:15 PM',
      status: 'completed',
      icon: ArrowDownLeft,
      color: '#059669'
    },
    {
      id: 8,
      type: 'bills',
      title: 'Khanepani Company',
      subtitle: 'Water Bill',
      amount: -450,
      date: '2024-01-18',
      time: '2:10 PM',
      status: 'completed',
      icon: Receipt,
      color: '#3B82F6'
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction Statement</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Calendar size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{formatDate(date)}</Text>
            {transactions.map((transaction) => (
              <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '20' }]}>
                  <transaction.icon size={20} color={transaction.color} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
                  <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    { color: transaction.amount > 0 ? '#059669' : '#1f2937' }
                  ]}>
                    {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount).toLocaleString()}
                  </Text>
                  <Text style={styles.statusText}>
                    {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeFilterTab: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  transactionTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusText: {
    fontSize: 10,
    color: '#059669',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});