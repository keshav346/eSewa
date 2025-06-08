import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search, User, Bell, Eye, EyeOff, MoveHorizontal as MoreHorizontal, ArrowUpRight, ChevronDown, CreditCard, Send, Building2, Repeat, Smartphone, Lightbulb, Droplets, Wifi, Plane, Bus, Tv, GraduationCap } from 'lucide-react-native';
import { useBalance } from '@/contexts/BalanceContext';

export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { formatBalance } = useBalance();

  const quickActions = [
    { 
      icon: CreditCard, 
      label: 'Load Money', 
      color: '#16a34a', 
      onPress: () => router.push('/load-money') 
    },
    { 
      icon: Send, 
      label: 'Send Money', 
      color: '#16a34a', 
      onPress: () => router.push('/send') 
    },
    { 
      icon: Building2, 
      label: 'Bank Transfer', 
      color: '#16a34a', 
      onPress: () => router.push('/bank-transfer') 
    },
    { 
      icon: Repeat, 
      label: 'Remittance', 
      color: '#16a34a', 
      onPress: () => {} 
    },
  ];

  const services = [
    { 
      icon: Smartphone, 
      label: 'Topup', 
      color: '#16a34a', 
      onPress: () => router.push('/topup') 
    },
    { 
      icon: Lightbulb, 
      label: 'Electricity', 
      color: '#16a34a', 
      onPress: () => router.push('/electricity') 
    },
    { 
      icon: Droplets, 
      label: 'Khanepani', 
      color: '#16a34a', 
      onPress: () => router.push('/water') 
    },
    { 
      icon: Wifi, 
      label: 'Internet', 
      color: '#16a34a', 
      onPress: () => router.push('/internet') 
    },
    { 
      icon: Plane, 
      label: 'Airlines', 
      color: '#16a34a', 
      onPress: () => router.push('/airlines') 
    },
    { 
      icon: Bus, 
      label: 'Bus Ticket', 
      color: '#16a34a', 
      onPress: () => router.push('/bus') 
    },
    { 
      icon: Tv, 
      label: 'TV', 
      color: '#16a34a', 
      onPress: () => router.push('/tv') 
    },
    { 
      icon: GraduationCap, 
      label: 'School Fee', 
      color: '#16a34a', 
      onPress: () => router.push('/school') 
    },
  ];

  const popularServices = [
    {
      name: 'OYO',
      logo: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      category: 'Hotels'
    },
    {
      name: 'Worldlink',
      logo: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      category: 'Internet'
    },
    {
      name: 'Nepal Telecom',
      logo: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      category: 'Telecom'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#16a34a', '#22c55e']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.avatar}>
                <User size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Search size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Bell size={20} color="#ffffff" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreHorizontal size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceLeft}>
                <View style={styles.balanceIcon}>
                  <CreditCard size={20} color="#16a34a" />
                </View>
                <View>
                  <Text style={styles.balanceAmount}>
                    NPR {formatBalance(balanceVisible)}
                  </Text>
                  <Text style={styles.balanceLabel}>Balance</Text>
                </View>
              </View>
              <View style={styles.balanceRight}>
                <Text style={styles.rewardPoints}>95.52</Text>
                <Text style={styles.rewardLabel}>Reward Points</Text>
                <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                  {balanceVisible ? (
                    <EyeOff size={16} color="#6b7280" />
                  ) : (
                    <Eye size={16} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionItem} onPress={action.onPress}>
              <View style={styles.quickActionIconContainer}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={18} color="#ffffff" />
                </View>
                <View style={styles.quickActionArrow}>
                  <ArrowUpRight size={8} color="#16a34a" />
                </View>
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services Grid */}
        <View style={styles.servicesContainer}>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceItem} onPress={service.onPress}>
                <View style={[styles.serviceIconContainer, { backgroundColor: service.color + '15' }]}>
                  <service.icon size={22} color={service.color} />
                </View>
                <Text style={styles.serviceLabel}>{service.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push('/offers')}>
            <Text style={styles.viewMoreText}>View More</Text>
            <ChevronDown size={16} color="#16a34a" />
          </TouchableOpacity>
        </View>

        {/* eSewa Send Money Promotion */}
        <View style={styles.promotionContainer}>
          <View style={styles.promotionCard}>
            <View style={styles.promotionContent}>
              <View style={styles.promotionLeft}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=200&h=300' }}
                  style={styles.promotionImage}
                />
              </View>
              <View style={styles.promotionRight}>
                <View style={styles.promotionHeader}>
                  <Text style={styles.promotionTitle}>eSewa</Text>
                  <Text style={styles.promotionSubtitle}>Receive/Send Money</Text>
                  <Text style={styles.promotionDescription}>easily with eSewa Send Money</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularServicesScroll}>
            {popularServices.map((service, index) => (
              <TouchableOpacity key={index} style={styles.popularServiceItem}>
                <Image source={{ uri: service.logo }} style={styles.popularServiceLogo} />
                <Text style={styles.popularServiceName}>{service.name}</Text>
                <Text style={styles.popularServiceCategory}>{service.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={16} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by tags (e.g. adsl)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  balanceRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  rewardLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionArrow: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  servicesContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceItem: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    gap: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
    fontFamily: 'Inter-Medium',
  },
  promotionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  promotionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promotionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  promotionLeft: {
    flex: 1,
  },
  promotionImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  promotionRight: {
    flex: 2,
  },
  promotionHeader: {
    alignItems: 'flex-end',
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
  },
  promotionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  promotionDescription: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  popularServicesScroll: {
    paddingLeft: 16,
  },
  popularServiceItem: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    width: 80,
  },
  popularServiceLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginBottom: 8,
  },
  popularServiceName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  popularServiceCategory: {
    fontSize: 8,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
});