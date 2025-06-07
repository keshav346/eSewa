import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Gift, 
  Star, 
  Clock, 
  Tag,
  ArrowRight,
  Percent,
  Trophy,
  Heart,
  ArrowLeft
} from 'lucide-react-native';

export default function OffersScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Offers', icon: Gift },
    { id: 'cashback', label: 'Cashback', icon: Percent },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const offers = [
    {
      id: 1,
      title: '20% Cashback on Grocery',
      description: 'Get 20% cashback up to Rs. 500 on grocery shopping at Bhatbhateni',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'cashback',
      discount: '20%',
      validUntil: '2024-02-15',
      minAmount: 1000,
      maxCashback: 500,
      isPopular: true,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Free Movie Tickets',
      description: 'Book movie tickets and get 1 free ticket on booking 2 tickets',
      image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'rewards',
      discount: 'Buy 2 Get 1',
      validUntil: '2024-02-20',
      minAmount: 800,
      maxCashback: 400,
      isPopular: false,
      isFavorite: true
    },
    {
      id: 3,
      title: '15% Off on Food Delivery',
      description: 'Order food online and get 15% discount up to Rs. 300',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'cashback',
      discount: '15%',
      validUntil: '2024-02-10',
      minAmount: 500,
      maxCashback: 300,
      isPopular: true,
      isFavorite: false
    },
    {
      id: 4,
      title: 'Double Reward Points',
      description: 'Earn 2x reward points on all transactions above Rs. 2000',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'rewards',
      discount: '2x Points',
      validUntil: '2024-02-25',
      minAmount: 2000,
      maxCashback: 0,
      isPopular: false,
      isFavorite: true
    },
    {
      id: 5,
      title: '10% Cashback on Bills',
      description: 'Pay electricity, water, or internet bills and get 10% cashback',
      image: 'https://images.pexels.com/photos/6863515/pexels-photo-6863515.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'cashback',
      discount: '10%',
      validUntil: '2024-02-28',
      minAmount: 300,
      maxCashback: 200,
      isPopular: false,
      isFavorite: false
    },
    {
      id: 6,
      title: 'Free Delivery on Shopping',
      description: 'Shop online and get free delivery on orders above Rs. 1500',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
      category: 'rewards',
      discount: 'Free Delivery',
      validUntil: '2024-03-01',
      minAmount: 1500,
      maxCashback: 0,
      isPopular: true,
      isFavorite: false
    },
  ];

  const filteredOffers = offers.filter(offer => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return offer.isFavorite;
    return offer.category === selectedCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleFavorite = (offerId) => {
    // In a real app, this would update the backend
    console.log('Toggle favorite for offer:', offerId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers & Rewards</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>5 New</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.activeCategoryTab
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <category.icon 
              size={16} 
              color={selectedCategory === category.id ? '#ffffff' : '#64748b'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.activeCategoryText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Offers List */}
      <ScrollView style={styles.offersList} showsVerticalScrollIndicator={false}>
        {filteredOffers.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.offerCard}>
            <View style={styles.offerImageContainer}>
              <Image source={{ uri: offer.image }} style={styles.offerImage} />
              {offer.isPopular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color="#ffffff" />
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(offer.id)}
              >
                <Heart 
                  size={16} 
                  color={offer.isFavorite ? '#ef4444' : '#ffffff'} 
                  fill={offer.isFavorite ? '#ef4444' : 'transparent'}
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.offerContent}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{offer.discount}</Text>
                </View>
              </View>
              
              <Text style={styles.offerDescription}>{offer.description}</Text>
              
              <View style={styles.offerDetails}>
                <View style={styles.offerDetailItem}>
                  <Tag size={12} color="#64748b" />
                  <Text style={styles.offerDetailText}>
                    Min: Rs. {offer.minAmount.toLocaleString()}
                  </Text>
                </View>
                {offer.maxCashback > 0 && (
                  <View style={styles.offerDetailItem}>
                    <Gift size={12} color="#64748b" />
                    <Text style={styles.offerDetailText}>
                      Max: Rs. {offer.maxCashback}
                    </Text>
                  </View>
                )}
                <View style={styles.offerDetailItem}>
                  <Clock size={12} color="#64748b" />
                  <Text style={styles.offerDetailText}>
                    Until {formatDate(offer.validUntil)}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim Offer</Text>
                <ArrowRight size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  headerBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryTab: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  offersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  offerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  offerImageContainer: {
    position: 'relative',
  },
  offerImage: {
    width: '100%',
    height: 160,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerContent: {
    padding: 16,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  offerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  offerDescription: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  offerDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  offerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerDetailText: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});