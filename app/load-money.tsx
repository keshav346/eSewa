import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, CreditCard, Building, Smartphone, Plus } from 'lucide-react-native';

export default function LoadMoneyScreen() {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);

  const loadMethods = [
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      description: 'Transfer from your bank account',
      icon: Building, 
      color: '#1E40AF',
      fee: 'Free'
    },
    { 
      id: 'card', 
      name: 'Debit/Credit Card', 
      description: 'Load using your card',
      icon: CreditCard, 
      color: '#059669',
      fee: '1.5% + Rs. 10'
    },
    { 
      id: 'mobile', 
      name: 'Mobile Banking', 
      description: 'Load via mobile banking',
      icon: Smartphone, 
      color: '#EA580C',
      fee: 'Free'
    },
  ];

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  const handleLoadMoney = () => {
    if (!amount || !selectedMethod) return;

    router.push({
      pathname: '/payment-confirmation',
      params: {
        type: 'load-money',
        amount,
        method: selectedMethod.name,
        methodId: selectedMethod.id,
        fee: selectedMethod.fee
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Load Money</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Current Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current eSewa Balance</Text>
          <Text style={styles.balanceAmount}>Rs. 746.80</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>Rs.</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>Rs. {quickAmount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Load Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Load Method</Text>
          <View style={styles.methodsContainer}>
            {loadMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod?.id === method.id && styles.selectedMethod
                ]}
                onPress={() => setSelectedMethod(method)}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                  <method.icon size={24} color={method.color} />
                </View>
                <View style={styles.methodDetails}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                  <Text style={styles.methodFee}>Fee: {method.fee}</Text>
                </View>
                {selectedMethod?.id === method.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {amount && selectedMethod && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Transaction Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Load Amount:</Text>
                <Text style={styles.summaryValue}>Rs. {amount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Method:</Text>
                <Text style={styles.summaryValue}>{selectedMethod.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Fee:</Text>
                <Text style={styles.summaryValue}>{selectedMethod.fee}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>Rs. {amount}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Load Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.loadButton,
              (!amount || !selectedMethod) && styles.loadButtonDisabled
            ]}
            onPress={handleLoadMoney}
            disabled={!amount || !selectedMethod}
          >
            <Text style={styles.loadButtonText}>
              Load Rs. {amount || '0'}
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#16a34a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  placeholder: {
    width: 40,
  },
  balanceSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
  },
  section: {
    marginBottom: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  quickAmountButton: {
    width: '31%',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  methodsContainer: {
    paddingHorizontal: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  methodDescription: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  methodFee: {
    fontSize: 11,
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loadButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  loadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});