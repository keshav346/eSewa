import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Calendar, Download, TrendingUp, TrendingDown, DollarSign, MoveVertical as MoreVertical } from 'lucide-react-native';
import { usePaymentHistory } from '@/contexts/PaymentHistoryContext';
import { useBalance } from '@/contexts/BalanceContext';

export default function StatementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { payments, isLoading } = usePaymentHistory();
  const { balance } = useBalance();

  const filters = [
    { id: 'all', label: 'All', color: '#64748b' },
    { id: 'payment', label: 'Payments', color: '#059669' },
    { id: 'transfer', label: 'Transfers', color: '#1E40AF' },
    { id: 'bills', label: 'Bills', color: '#EAB308' },
    { id: 'topup', label: 'Top-ups', color: '#7C3AED' },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || payment.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const groupedPayments = filteredPayments.reduce((groups, payment) => {
    const date = payment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(payment);
    return groups;
  }, {} as Record<string, typeof payments>);

  const formatDate = (dateString: string) => {
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

  const calculateStats = () => {
    const thisMonth = payments.filter(p => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    });

    const totalSpent = thisMonth
      .filter(p => p.type !== 'load-money')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalLoaded = thisMonth
      .filter(p => p.type === 'load-money')
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalSpent, totalLoaded, transactionCount: thisMonth.length };
  };

  const stats = calculateStats();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Transaction Statement</Text>
            <Text style={styles.headerSubtitle}>Track your spending & earnings</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Download size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MoreVertical size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <DollarSign size={20} color="#16a34a" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>Rs. {balance.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Current Balance</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <TrendingDown size={16} color="#ef4444" />
                <Text style={styles.statAmount}>Rs. {stats.totalSpent.toLocaleString()}</Text>
              </View>
              <Text style={styles.statTitle}>Spent This Month</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <TrendingUp size={16} color="#16a34a" />
                <Text style={styles.statAmount}>Rs. {stats.totalLoaded.toLocaleString()}</Text>
              </View>
              <Text style={styles.statTitle}>Loaded This Month</Text>
            </View>
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
                selectedFilter === filter.id && [styles.activeFilterTab, { backgroundColor: filter.color }]
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
        <View style={styles.transactionsList}>
          {Object.entries(groupedPayments).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No transactions found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search terms' : 'Your transactions will appear here'}
              </Text>
            </View>
          ) : (
            Object.entries(groupedPayments).map(([date, transactions]) => (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>{formatDate(date)}</Text>
                  <Text style={styles.dateHeaderCount}>
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                
                {transactions.map((transaction) => (
                  <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle}>{transaction.title}</Text>
                      <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
                      <View style={styles.transactionMeta}>
                        <Text style={styles.transactionTime}>{transaction.time}</Text>
                        <View style={styles.transactionDot} />
                        <Text style={styles.transactionId}>ID: {transaction.transactionId}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.amountText,
                        { color: transaction.type === 'load-money' ? '#059669' : '#1f2937' }
                      ]}>
                        {transaction.type === 'load-money' ? '+' : '-'}Rs. {transaction.amount.toLocaleString()}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#059669';
    case 'pending':
      return '#F59E0B';
    case 'failed':
      return '#DC2626';
    default:
      return '#64748b';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeFilterTab: {
    borderColor: 'transparent',
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
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  dateHeaderCount: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 20,
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
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  transactionTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  transactionDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#94a3b8',
    marginHorizontal: 6,
  },
  transactionId: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});