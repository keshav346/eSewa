import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Shield, Smartphone, CreditCard, CircleCheck as CheckCircle, Building, Zap, Wallet } from 'lucide-react-native';
import { useBalance } from '@/contexts/BalanceContext';

export default function PaymentConfirmationScreen() {
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { balance, addMoney, deductMoney } = useBalance();
  
  const { 
    type, 
    phoneNumber, 
    amount, 
    operator, 
    operatorId,
    accountNumber,
    accountName,
    bank,
    bankCode,
    customerNumber,
    customerName,
    provider,
    providerId,
    serviceCharge,
    method,
    methodId,
    fee,
    remarks
  } = params;

  const getServiceIcon = () => {
    switch (type) {
      case 'topup':
        return Smartphone;
      case 'bank-transfer':
        return Building;
      case 'electricity':
        return Zap;
      case 'load-money':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const getServiceTitle = () => {
    switch (type) {
      case 'topup':
        return 'Mobile Topup';
      case 'bank-transfer':
        return 'Bank Transfer';
      case 'electricity':
        return 'Electricity Bill Payment';
      case 'load-money':
        return 'Load Money';
      default:
        return 'Payment';
    }
  };

  const getServiceProvider = () => {
    switch (type) {
      case 'topup':
        return operator;
      case 'bank-transfer':
        return bank;
      case 'electricity':
        return provider;
      case 'load-money':
        return method;
      default:
        return 'eSewa';
    }
  };

  const getTotalAmount = () => {
    const baseAmount = parseFloat(amount) || 0;
    const charge = parseFloat(serviceCharge) || 0;
    return baseAmount + charge;
  };

  const handleConfirmPayment = () => {
    const totalAmount = getTotalAmount();
    const baseAmount = parseFloat(amount) || 0;
    
    // Check if it's a load money transaction
    if (type === 'load-money') {
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        
        // Add money to balance
        addMoney(baseAmount);
        
        // Generate transaction details
        const transactionCode = Math.random().toString(36).substr(2, 8).toUpperCase();
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const timeString = currentDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        
        router.replace({
          pathname: '/payment-success',
          params: {
            type,
            phoneNumber: phoneNumber || '',
            accountNumber: accountNumber || '',
            accountName: accountName || '',
            customerNumber: customerNumber || '',
            customerName: customerName || '',
            amount: amount.toString(),
            operator: operator || '',
            bank: bank || '',
            provider: provider || '',
            method: method || '',
            transactionCode,
            date: dateString,
            time: timeString,
            serviceCharge: serviceCharge || '0',
            remarks: remarks || getServiceTitle()
          }
        });
      }, 2000);
      return;
    }
    
    // For other transactions, check balance and deduct money
    if (balance < totalAmount) {
      Alert.alert(
        'Insufficient Balance',
        `Your current balance is Rs. ${balance.toFixed(2)}. You need Rs. ${totalAmount.toFixed(2)} for this transaction.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Deduct money from balance
      const success = deductMoney(totalAmount);
      
      if (success) {
        // Generate transaction details
        const transactionCode = Math.random().toString(36).substr(2, 8).toUpperCase();
        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const timeString = currentDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        
        router.replace({
          pathname: '/payment-success',
          params: {
            type,
            phoneNumber: phoneNumber || '',
            accountNumber: accountNumber || '',
            accountName: accountName || '',
            customerNumber: customerNumber || '',
            customerName: customerName || '',
            amount: amount.toString(),
            operator: operator || '',
            bank: bank || '',
            provider: provider || '',
            method: method || '',
            transactionCode,
            date: dateString,
            time: timeString,
            serviceCharge: serviceCharge || '0',
            remarks: remarks || getServiceTitle()
          }
        });
      } else {
        Alert.alert('Transaction Failed', 'Insufficient balance for this transaction.');
      }
    }, 2000);
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.processingText}>Processing Payment...</Text>
          <Text style={styles.processingSubtext}>Please wait while we process your {getServiceTitle().toLowerCase()}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ServiceIcon = getServiceIcon();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Shield size={20} color="#16a34a" />
          <Text style={styles.securityText}>Secure Payment</Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsCard}>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceIcon}>
              <ServiceIcon size={24} color="#16a34a" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{getServiceTitle()}</Text>
              <Text style={styles.serviceProvider}>{getServiceProvider()}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            {/* Conditional rendering based on service type */}
            {type === 'topup' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobile Number:</Text>
                  <Text style={styles.detailValue}>{phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Operator:</Text>
                  <Text style={styles.detailValue}>{operator}</Text>
                </View>
              </>
            )}
            
            {type === 'bank-transfer' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bank:</Text>
                  <Text style={styles.detailValue}>{bank}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Number:</Text>
                  <Text style={styles.detailValue}>{accountNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Name:</Text>
                  <Text style={styles.detailValue}>{accountName}</Text>
                </View>
              </>
            )}
            
            {type === 'electricity' && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Provider:</Text>
                  <Text style={styles.detailValue}>{provider}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Customer Number:</Text>
                  <Text style={styles.detailValue}>{customerNumber}</Text>
                </View>
                {customerName && customerName !== 'N/A' && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer Name:</Text>
                    <Text style={styles.detailValue}>{customerName}</Text>
                  </View>
                )}
              </>
            )}
            
            {type === 'load-money' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Load Method:</Text>
                <Text style={styles.detailValue}>{method}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>Rs. {amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Charge:</Text>
              <Text style={styles.detailValue}>Rs. {serviceCharge || '0'}</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>Rs. {getTotalAmount().toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodCard}>
          <View style={styles.paymentMethodHeader}>
            <Text style={styles.paymentMethodTitle}>Payment Method</Text>
          </View>
          <View style={styles.paymentMethodInfo}>
            <View style={styles.paymentMethodIcon}>
              <CreditCard size={20} color="#16a34a" />
            </View>
            <View style={styles.paymentMethodDetails}>
              <Text style={styles.paymentMethodName}>eSewa Wallet</Text>
              <Text style={styles.paymentMethodBalance}>Available: Rs. {balance.toFixed(2)}</Text>
            </View>
            <CheckCircle size={20} color="#16a34a" />
          </View>
        </View>

        {/* Balance Warning for insufficient funds */}
        {type !== 'load-money' && balance < getTotalAmount() && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              Insufficient balance! You need Rs. {(getTotalAmount() - balance).toFixed(2)} more.
            </Text>
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            type !== 'load-money' && balance < getTotalAmount() && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirmPayment}
          disabled={type !== 'load-money' && balance < getTotalAmount()}
        >
          <Text style={styles.confirmButtonText}>
            {type === 'load-money' ? 'Load' : 'Confirm & Pay'} Rs. {getTotalAmount().toLocaleString()}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By proceeding, you agree to our Terms & Conditions and Privacy Policy
        </Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  serviceProvider: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
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
  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentMethodHeader: {
    marginBottom: 12,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  paymentMethodBalance: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  warningText: {
    fontSize: 14,
    color: '#dc2626',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  termsText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    marginTop: 20,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});