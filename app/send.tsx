import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { QrCode, Contact, Smartphone, ArrowLeft, Search } from 'lucide-react-native';

export default function SendScreen() {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const quickAmounts = [100, 500, 1000, 5000];
  
  const recentContacts = [
    { id: 1, name: 'Ram Sharma', phone: '+977-9841234567', avatar: 'RS' },
    { id: 2, name: 'Sita Devi', phone: '+977-9851234567', avatar: 'SD' },
    { id: 3, name: 'Krishna Bahadur', phone: '+977-9861234567', avatar: 'KB' },
    { id: 4, name: 'Maya Gurung', phone: '+977-9871234567', avatar: 'MG' },
  ];

  const sendMethods = [
    { icon: QrCode, label: 'QR Code', description: 'Scan to send money', color: '#1E40AF' },
    { icon: Contact, label: 'Contact', description: 'Send to phone contacts', color: '#059669' },
    { icon: Smartphone, label: 'Phone Number', description: 'Enter mobile number', color: '#EA580C' },
  ];

  const handleSend = () => {
    if (!amount || !selectedContact) return;

    router.push({
      pathname: '/payment-confirmation',
      params: {
        type: 'send-money',
        recipient: selectedContact.name,
        phone: selectedContact.phone,
        amount,
        remarks: 'Money Transfer'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Send Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Method</Text>
          <View style={styles.methodsContainer}>
            {sendMethods.map((method, index) => (
              <TouchableOpacity key={index} style={styles.methodItem}>
                <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                  <method.icon size={24} color={method.color} />
                </View>
                <View style={styles.methodDetails}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
                <Text style={styles.quickAmountText}>Rs. {quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Contacts</Text>
            <TouchableOpacity style={styles.searchButton}>
              <Search size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactsList}>
            {recentContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  selectedContact?.id === contact.id && styles.selectedContact
                ]}
                onPress={() => setSelectedContact(contact)}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>{contact.avatar}</Text>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                {selectedContact?.id === contact.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Send Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!amount || !selectedContact) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!amount || !selectedContact}
          >
            <Text style={styles.sendButtonText}>
              Send Rs. {amount || '0'}
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchButton: {
    padding: 8,
  },
  methodsContainer: {
    paddingHorizontal: 20,
  },
  methodItem: {
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
  methodLabel: {
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
    paddingHorizontal: 20,
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  contactsList: {
    paddingHorizontal: 20,
  },
  contactItem: {
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
  selectedContact: {
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  contactPhone: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sendButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});