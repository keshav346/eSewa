import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plane, Building, User, Calendar } from 'lucide-react-native';

export default function AirlinesScreen() {
  const [passengerName, setPassengerName] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAirline, setSelectedAirline] = useState(null);

  const airlines = [
    { 
      id: 'nac', 
      name: 'Nepal Airlines Corporation', 
      shortName: 'NAC',
      color: '#DC2626',
      serviceCharge: 50
    },
    { 
      id: 'buddha', 
      name: 'Buddha Air', 
      shortName: 'Buddha Air',
      color: '#059669',
      serviceCharge: 45
    },
    { 
      id: 'yeti', 
      name: 'Yeti Airlines', 
      shortName: 'Yeti Airlines',
      color: '#7C3AED',
      serviceCharge: 40
    },
    { 
      id: 'shree', 
      name: 'Shree Airlines', 
      shortName: 'Shree Airlines',
      color: '#EA580C',
      serviceCharge: 35
    },
  ];

  const quickAmounts = [5000, 10000, 15000, 20000, 25000, 30000];

  const handleBookTicket = () => {
    if (!passengerName || !amount || !selectedAirline) return;

    router.push({
      pathname: '/payment-confirmation',
      params: {
        type: 'airlines',
        passengerName,
        ticketNumber: ticketNumber || 'N/A',
        amount,
        provider: selectedAirline.name,
        providerId: selectedAirline.id,
        serviceCharge: selectedAirline.serviceCharge.toString()
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
          <Text style={styles.headerTitle}>Airlines Booking</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Select Airline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Airline</Text>
          <View style={styles.airlinesContainer}>
            {airlines.map((airline) => (
              <TouchableOpacity
                key={airline.id}
                style={[
                  styles.airlineCard,
                  selectedAirline?.id === airline.id && styles.selectedAirline
                ]}
                onPress={() => setSelectedAirline(airline)}
              >
                <View style={[styles.airlineIcon, { backgroundColor: airline.color + '20' }]}>
                  <Plane size={24} color={airline.color} />
                </View>
                <View style={styles.airlineDetails}>
                  <Text style={styles.airlineName}>{airline.name}</Text>
                  <Text style={styles.airlineShortName}>{airline.shortName}</Text>
                  <Text style={styles.serviceCharge}>Service Charge: Rs. {airline.serviceCharge}</Text>
                </View>
                {selectedAirline?.id === airline.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Passenger Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Details</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={passengerName}
              onChangeText={setPassengerName}
              placeholder="Passenger Name"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Calendar size={20} color="#16a34a" />
            </View>
            <TextInput
              style={styles.textInput}
              value={ticketNumber}
              onChangeText={setTicketNumber}
              placeholder="Ticket Number (Optional)"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Amount</Text>
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

        {/* Summary */}
        {passengerName && amount && selectedAirline && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Airline:</Text>
                <Text style={styles.summaryValue}>{selectedAirline.shortName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Passenger:</Text>
                <Text style={styles.summaryValue}>{passengerName}</Text>
              </View>
              {ticketNumber && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ticket Number:</Text>
                  <Text style={styles.summaryValue}>{ticketNumber}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ticket Amount:</Text>
                <Text style={styles.summaryValue}>Rs. {amount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Charge:</Text>
                <Text style={styles.summaryValue}>Rs. {selectedAirline.serviceCharge}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>Rs. {(parseInt(amount) + selectedAirline.serviceCharge).toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Book Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!passengerName || !amount || !selectedAirline) && styles.bookButtonDisabled
            ]}
            onPress={handleBookTicket}
            disabled={!passengerName || !amount || !selectedAirline}
          >
            <Text style={styles.bookButtonText}>
              Book Ticket Rs. {amount ? (parseInt(amount) + (selectedAirline?.serviceCharge || 0)).toLocaleString() : '0'}
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
  airlinesContainer: {
    paddingHorizontal: 20,
  },
  airlineCard: {
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
  selectedAirline: {
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  airlineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  airlineDetails: {
    flex: 1,
  },
  airlineName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  airlineShortName: {
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
  bookButton: {
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
  bookButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
});