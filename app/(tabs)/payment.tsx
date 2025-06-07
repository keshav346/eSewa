import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, QrCode, Receipt, Clock, CircleCheck as CheckCircle, Circle as XCircle, ArrowUpRight, ArrowDownLeft, Smartphone, Zap } from 'lucide-react-native';

export default function PaymentScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
  ];

  const payments = [
    {
      id: 1,
      type: 'qr-payment',
      merchant: 'Bhatbhateni Supermarket',
      amount: 2450,
      date: '2024-01-20',
      time: '3:45 PM',
      status: 'completed',
      transactionId: 'TXN123456789',
      icon: QrCode,
      color: '#16a34a'
    },
    {
      id: 2,
      type: 'bill-payment',
      merchant: 'Nepal Electricity Authority',
      amount: 850,
      date: '2024-01-20',
      time: '2:30 PM',
      status: 'completed',
      transactionId: 'TXN123456788',
      icon: Zap,
      color: '#EAB308'
    },
    {
      id: 3,
      type: 'transfer',
      merchant: 'Ram Sharma',
      amount: 5000,
      date: '2024-01-19',
      time: '8:15 PM',
      status: 'pending',
      transactionId: 'TXN123456787',
      icon: ArrowUpRight,
      color: '#F59E0B'
    },
    {
      id: 4,
      type: 'topup',
      merchant: 'Ncell Recharge',
      amount: 100,
      date: '2024-01-19',
      time: '6:20 PM',
      status: 'completed',
      transactionId: 'TXN123456786',
      icon: Smartphone,
      color: '#EA580C'
    },
    {
      id: 5,
      type: 'qr-payment',
      merchant: 'KFC Restaurant',
      amount: 1250,
      date: '2024-01-19',
      time: '1:30 PM',
      status: 'failed',
      transactionId: 'TXN123456785',
      icon: QrCode,
      color: '#DC2626'
    },
    {
      id: 6,
      type: 'transfer',
      merchant: 'Sita Devi',
      amount: 3000,
      date: '2024-01-18',
      time: '4:45 PM',
      status: 'completed',
      transactionId: 'TXN123456784',
      icon: ArrowUpRight,
      color: '#16a34a'
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || payment.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return Receipt;
    }
  };

  const getStatusColor = (status) => {
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
        day: 'numeric'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Payments</Text>
        <View style={styles.headerActions}>
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
            placeholder="Search payments..."
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

      {/* Payments List */}
      <ScrollView style={styles.paymentsList} showsVerticalScrollIndicator={false}>
        {filteredPayments.map((payment) => {
          const StatusIcon = getStatusIcon(payment.status);
          const statusColor = getStatusColor(payment.status);
          
          return (
            <TouchableOpacity key={payment.id} style={styles.paymentItem}>
              <View style={[styles.paymentIcon, { backgroundColor: payment.color + '20' }]}>
                <payment.icon size={20} color={payment.color} />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentMerchant}>{payment.merchant}</Text>
                <Text style={styles.paymentId}>ID: {payment.transactionId}</Text>
                <Text style={styles.paymentDate}>{formatDate(payment.date)} • {payment.time}</Text>
              </View>
              <View style={styles.paymentRight}>
                <Text style={styles.paymentAmount}>Rs. {payment.amount.toLocaleString()}</Text>
                <View style={styles.statusContainer}>
                  <StatusIcon size={12} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <QrCode size={24} color="#16a34a" />
          <Text style={styles.quickActionText}>Scan & Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Receipt size={24} color="#16a34a" />
          <Text style={styles.quickActionText}>Pay Bills</Text>
        </TouchableOpacity>
      </View>
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
  paymentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  paymentItem: {
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
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMerchant: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  paymentId: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  paymentDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});