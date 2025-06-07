import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Building, User, CreditCard } from 'lucide-react-native';

export default function BankTransferScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [remarks, setRemarks] = useState('');

  const banks = [
    { id: 'nabil', name: 'Nabil Bank', code: 'NABIL', color: '#1E40AF' },
    { id: 'nic', name: 'NIC Asia Bank', code: 'NICA', color: '#059669' },
    { id: 'global', name: 'Global IME Bank', code: 'GIME', color: '#EA580C' },
    { id: 'kumari', name: 'Kumari Bank', code: 'KBL', color: '#7C3AED' },
    { id: 'himalayan', name: 'Himalayan Bank', code: 'HBL', color: '#DC2626' },
    { id: 'standard', name: 'Standard Chartered', code: 'SCB', color: '#0891B2' },
  ];

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleTransfer = () => {
    if (!accountNumber || !amount || !selectedBank || !accountName) return;

    router.push({
      pathname: '/payment-confirmation',
      params: {
        type: 'bank-transfer',
        accountNumber,
        accountName,
        amount,
        bank: selectedBank.name,
        bankCode: selectedBank.code,
        remarks: remarks || 'Bank Transfer'
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
          <Text style={styles.headerTitle}>Bank Transfer</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Select Bank */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bank</Text>
          <View style={styles.banksGrid}>
            {banks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankCard,
                  selectedBank?.id === bank.id && styles.selectedBank
                ]}
                onPress={() => setSelectedBank(bank)}
              >
                <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
                  <Building size={20} color={bank.color} />
                </View>
                <Text style={styles.bankName}>{bank.name}</Text>
                <Text style={styles.bankCode}>{bank.code}</Text>
                {selectedBank?.id === bank.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <CreditCard size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Account Number"
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Account Holder Name"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer Amount</Text>
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

        {/* Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={remarks}
              onChangeText={setRemarks}
              placeholder="Enter remarks"
              placeholderTextColor="#94a3b8"
              multiline
            />
          </View>
        </View>

        {/* Summary */}
        {accountNumber && amount && selectedBank && accountName && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Transfer Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Bank:</Text>
                <Text style={styles.summaryValue}>{selectedBank.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Account Number:</Text>
                <Text style={styles.summaryValue}>{accountNumber}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Account Name:</Text>
                <Text style={styles.summaryValue}>{accountName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>Rs. {amount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Transfer Fee:</Text>
                <Text style={styles.summaryValue}>Rs. 25</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>Rs. {(parseInt(amount) + 25).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Transfer Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.transferButton,
              (!accountNumber || !amount || !selectedBank || !accountName) && styles.transferButtonDisabled
            ]}
            onPress={handleTransfer}
            disabled={!accountNumber || !amount || !selectedBank || !accountName}
          >
            <Text style={styles.transferButtonText}>
              Transfer Rs. {amount || '0'}
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
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  bankCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  selectedBank: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  bankIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 2,
  },
  bankCode: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
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
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
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
  transferButton: {
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
  transferButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});