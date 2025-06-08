import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CircleCheck as CheckCircle, Download, Share, MoveHorizontal as MoreHorizontal, CreditCard, Smartphone, Building, Zap, Wallet, User, Phone } from 'lucide-react-native';
import { useBalance } from '@/contexts/BalanceContext';
import { useProfile } from '@/contexts/ProfileContext';
import { usePaymentHistory } from '@/contexts/PaymentHistoryContext';

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams();
  const { formatBalance } = useBalance();
  const { profileData } = useProfile();
  const { addPayment } = usePaymentHistory();
  
  const { 
    type, 
    phoneNumber, 
    accountNumber,
    accountName,
    customerNumber,
    customerName,
    passengerName,
    studentName,
    amount, 
    operator,
    bank,
    provider,
    method,
    transactionCode, 
    date, 
    time, 
    serviceCharge,
    remarks
  } = params;

  // Add payment to history when component mounts
  useEffect(() => {
    const addToHistory = async () => {
      const paymentData = {
        type: type as any,
        title: getTransactionTitle(),
        subtitle: getTransactionSubtitle(),
        amount: parseFloat(amount as string),
        status: 'completed' as const,
        date: date as string,
        time: time as string,
        transactionId: transactionCode as string,
        recipient: getRecipient(),
        provider: getProvider(),
        icon: getServiceIcon(),
        color: getServiceColor(),
        category: getCategory()
      };

      await addPayment(paymentData);
    };

    addToHistory();
  }, []);

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  const handleRaiseIssue = () => {
    // Handle raise issue functionality
    console.log('Raise issue');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getServiceIcon = () => {
    switch (type) {
      case 'topup': return '📱';
      case 'electricity': return '⚡';
      case 'water': return '💧';
      case 'internet': return '🌐';
      case 'bank-transfer': return '🏦';
      case 'load-money': return '💰';
      case 'airlines': return '✈️';
      case 'bus': return '🚌';
      case 'tv': return '📺';
      case 'school': return '🎓';
      default: return '💳';
    }
  };

  const getServiceColor = () => {
    switch (type) {
      case 'topup': return '#7C3AED';
      case 'electricity': return '#EAB308';
      case 'water': return '#3B82F6';
      case 'internet': return '#059669';
      case 'bank-transfer': return '#1E40AF';
      case 'load-money': return '#059669';
      case 'airlines': return '#DC2626';
      case 'bus': return '#F59E0B';
      case 'tv': return '#7C3AED';
      case 'school': return '#EA580C';
      default: return '#64748b';
    }
  };

  const getCategory = () => {
    switch (type) {
      case 'topup': return 'topup';
      case 'electricity':
      case 'water':
      case 'internet':
      case 'tv': return 'bills';
      case 'bank-transfer': return 'transfer';
      case 'load-money': return 'payment';
      case 'airlines':
      case 'bus':
      case 'school': return 'payment';
      default: return 'payment';
    }
  };

  const getTransactionTitle = () => {
    switch (type) {
      case 'topup': return `${operator} Topup`;
      case 'bank-transfer': return `${bank} Transfer`;
      case 'electricity': return `${provider} Bill Payment`;
      case 'water': return `${provider} Bill Payment`;
      case 'internet': return `${provider} Bill Payment`;
      case 'tv': return `${provider} Bill Payment`;
      case 'load-money': return `Money Loaded via ${method}`;
      case 'airlines': return `${provider} Booking`;
      case 'bus': return `${provider} Ticket`;
      case 'school': return `${provider} Fee Payment`;
      default: return 'Transaction';
    }
  };

  const getTransactionSubtitle = () => {
    switch (type) {
      case 'topup': return 'Mobile Top-up';
      case 'bank-transfer': return 'Bank Transfer';
      case 'electricity': return 'Electricity Bill';
      case 'water': return 'Water Bill';
      case 'internet': return 'Internet Bill';
      case 'tv': return 'TV Bill';
      case 'load-money': return 'Money Loaded';
      case 'airlines': return 'Flight Booking';
      case 'bus': return 'Bus Ticket';
      case 'school': return 'School Fee';
      default: return 'Payment';
    }
  };

  const getRecipient = () => {
    return accountName || customerName || passengerName || studentName || phoneNumber || 'N/A';
  };

  const getProvider = () => {
    return operator || bank || provider || method || 'eSewa';
  };

  const getDestinationInfo = () => {
    switch (type) {
      case 'topup':
        return { label: 'Destination Number', value: phoneNumber };
      case 'bank-transfer':
        return { label: 'Account Number', value: accountNumber };
      case 'electricity':
      case 'water':
      case 'internet':
      case 'tv':
        return { label: 'Customer Number', value: customerNumber };
      case 'load-money':
        return { label: 'Load Method', value: method };
      case 'airlines':
        return { label: 'Passenger Name', value: passengerName };
      case 'bus':
        return { label: 'Passenger Name', value: passengerName };
      case 'school':
        return { label: 'Student Name', value: studentName };
      default:
        return { label: 'Reference', value: 'N/A' };
    }
  };

  const getProviderInfo = () => {
    switch (type) {
      case 'topup':
        return { label: 'Operator Name', value: operator };
      case 'bank-transfer':
        return { label: 'Bank Name', value: bank };
      case 'electricity':
      case 'water':
      case 'internet':
      case 'tv':
        return { label: 'Service Provider', value: provider?.toUpperCase() };
      case 'load-money':
        return { label: 'Service Provider', value: method?.toUpperCase() };
      case 'airlines':
      case 'bus':
      case 'school':
        return { label: 'Service Provider', value: provider?.toUpperCase() };
      default:
        return { label: 'Provider', value: 'eSewa' };
    }
  };

  const destinationInfo = getDestinationInfo();
  const providerInfo = getProviderInfo();

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
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Download size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MoreHorizontal size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Success Status */}
          <View style={styles.successSection}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color="#16a34a" />
            </View>
            <Text style={styles.successTitle}>Transaction Successful!</Text>
            <Text style={styles.successSubtitle}>Your {getTransactionTitle().toLowerCase()} has been completed</Text>
          </View>

          {/* Profile Information */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Account Holder</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <User size={16} color="#16a34a" />
                </View>
                <Text style={styles.profileText}>{profileData.name}</Text>
              </View>
              <View style={styles.profileItem}>
                <View style={styles.profileIcon}>
                  <Phone size={16} color="#16a34a" />
                </View>
                <Text style={styles.profileText}>{profileData.phone}</Text>
              </View>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIcon}>
                <CreditCard size={20} color="#16a34a" />
              </View>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceAmount}>NPR {formatBalance(false)}</Text>
                <Text style={styles.balanceLabel}>Current Balance</Text>
              </View>
              <View style={styles.refreshIcon}>
                <View style={styles.refreshButton}>
                  <Text style={styles.refreshText}>⟲</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Transaction Status Card */}
          <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View style={styles.operatorIcon}>
                <Text style={styles.operatorEmoji}>{getServiceIcon()}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{getTransactionTitle()}</Text>
                <Text style={styles.transactionDate}>
                  {formatDate(date as string)} {time}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: type === 'load-money' ? '#16a34a' : '#ef4444' }
              ]}>
                {type === 'load-money' ? '+' : '-'}Rs. {amount}
              </Text>
            </View>
            
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Complete</Text>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Transaction Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Transaction Code:</Text>
                <Text style={styles.detailValue}>{transactionCode}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Amount (NPR):</Text>
                <Text style={styles.detailValue}>{amount}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Service Charge:</Text>
                <Text style={styles.detailValue}>Rs. {serviceCharge}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <Text style={styles.detailValue}>eSewa Wallet</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{destinationInfo.label}:</Text>
                <Text style={styles.detailValue}>{destinationInfo.value}</Text>
              </View>
              
              {accountName && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Account Holder Name:</Text>
                  <Text style={styles.detailValue}>{accountName}</Text>
                </View>
              )}
              
              {customerName && customerName !== 'N/A' && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Customer Name:</Text>
                  <Text style={styles.detailValue}>{customerName}</Text>
                </View>
              )}
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{providerInfo.label}:</Text>
                <Text style={styles.detailValue}>{providerInfo.value}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Remarks:</Text>
                <Text style={styles.detailValue}>{remarks}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Processed By:</Text>
                <Text style={styles.detailValue}>{profileData.phone}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Initiator Name:</Text>
                <Text style={styles.detailValue}>{profileData.name}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>DONE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.issueButton} onPress={handleRaiseIssue}>
              <Text style={styles.issueButtonText}>RAISE ISSUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16a34a20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileHeader: {
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileInfo: {
    gap: 8,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16a34a20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  balanceCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#16a34a20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  refreshIcon: {
    alignItems: 'center',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  operatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  operatorEmoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  detailsCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    flex: 1,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
  },
  doneButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  issueButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  issueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    fontFamily: 'Inter-SemiBold',
  },
});