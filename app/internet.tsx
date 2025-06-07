import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Wifi, Building, User } from 'lucide-react-native';

export default function InternetScreen() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = [
    { 
      id: 'worldlink', 
      name: 'WorldLink Communications', 
      shortName: 'WorldLink',
      color: '#DC2626',
      serviceCharge: 15
    },
    { 
      id: 'vianet', 
      name: 'Vianet Communications', 
      shortName: 'Vianet',
      color: '#059669',
      serviceCharge: 12
    },
    { 
      id: 'subisu', 
      name: 'Subisu Cablenet', 
      shortName: 'Subisu',
      color: '#7C3AED',
      serviceCharge: 10
    },
    { 
      id: 'ntc', 
      name: 'Nepal Telecom ADSL', 
      shortName: 'NTC ADSL',
      color: '#1E40AF',
      serviceCharge: 8
    },
  ];

  const quickAmounts = [800, 1200, 1500, 2000, 2500, 3000];

  const handlePayBill = () => {
    if (!customerNumber || !amount || !selectedProvider) return;

    router.push({
      pathname: '/payment-confirmation',
      params: {
        type: 'internet',
        customerNumber,
        customerName: customerName || 'N/A',
        amount,
        provider: selectedProvider.name,
        providerId: selectedProvider.id,
        serviceCharge: selectedProvider.serviceCharge.toString()
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
          <Text style={styles.headerTitle}>Internet Bill Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Select Provider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Internet Provider</Text>
          <View style={styles.providersContainer}>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider?.id === provider.id && styles.selectedProvider
                ]}
                onPress={() => setSelectedProvider(provider)}
              >
                <View style={[styles.providerIcon, { backgroundColor: provider.color + '20' }]}>
                  <Wifi size={24} color={provider.color} />
                </View>
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerShortName}>{provider.shortName}</Text>
                  <Text style={styles.serviceCharge}>Service Charge: Rs. {provider.serviceCharge}</Text>
                </View>
                {selectedProvider?.id === provider.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Building size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={customerNumber}
              onChangeText={setCustomerNumber}
              placeholder="Customer ID / Username"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Customer Name (Optional)"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Amount</Text>
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
                <Text style={styles.quickAmountText}>Rs. {quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {customerNumber && amount && selectedProvider && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Bill Payment Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Provider:</Text>
                <Text style={styles.summaryValue}>{selectedProvider.shortName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Customer ID:</Text>
                <Text style={styles.summaryValue}>{customerNumber}</Text>
              </View>
              {customerName && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Customer Name:</Text>
                  <Text style={styles.summaryValue}>{customerName}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Bill Amount:</Text>
                <Text style={styles.summaryValue}>Rs. {amount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Charge:</Text>
                <Text style={styles.summaryValue}>Rs. {selectedProvider.serviceCharge}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>Rs. {(parseInt(amount) + selectedProvider.serviceCharge).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pay Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.payButton,
              (!customerNumber || !amount || !selectedProvider) && styles.payButtonDisabled
            ]}
            onPress={handlePayBill}
            disabled={!customerNumber || !amount || !selectedProvider}
          >
            <Text style={styles.payButtonText}>
              Pay Rs. {amount ? (parseInt(amount) + (selectedProvider?.serviceCharge || 0)).toLocaleString() : '0'}
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
  providersContainer: {
    paddingHorizontal: 20,
  },
  providerCard: {
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
  selectedProvider: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  providerShortName: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  serviceCharge: {
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
    fontSize: 12,
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
  payButton: {
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
  payButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});