import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import mockData from '../data/mockData.json';

const { width } = Dimensions.get('window');

const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    camera: 'camera',
    'map-pin': 'location',
    gift: 'gift',
    headphones: 'headset',
    lightning: 'flash',
    users: 'people',
    clipboard: 'clipboard',
    smartphone: 'phone-portrait',
  };
  return iconMap[iconName] || 'help-circle';
};

export default function HomeScreen() {
  const { user, offers, quickActions, tiers } = mockData;
  const currentTier = tiers.find(t => t.name === user.tier);
  const progress = user.points / (user.points + user.pointsToNextTier);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pointsGradient}
          >
            <View style={styles.pointsHeader}>
              <View style={styles.tierBadge}>
                <Ionicons name="diamond" size={16} color={currentTier?.color || '#FFD700'} />
                <Text style={[styles.tierText, { color: currentTier?.color }]}>
                  {user.tier} Member
                </Text>
              </View>
              <Text style={styles.memberId}>ID: {user.memberId}</Text>
            </View>

            <View style={styles.pointsCenter}>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>
                {user.points.toLocaleString()}
              </Text>
              <Text style={styles.pointsSubtext}>
                ≈ ${(user.points / 100).toFixed(2)} value
              </Text>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>{user.tier}</Text>
                <Text style={styles.progressText}>{user.nextTier}</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.progressInfo}>
                {user.pointsToNextTier.toLocaleString()} pts to {user.nextTier}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionItem}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons
                    name={getIconName(action.icon)}
                    size={24}
                    color={action.color}
                  />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersContainer}
          >
            {offers.map((offer) => (
              <TouchableOpacity key={offer.id} style={styles.offerCard}>
                <View style={styles.offerIconContainer}>
                  <Ionicons
                    name={getIconName(offer.image)}
                    size={28}
                    color="#6366F1"
                  />
                </View>
                {offer.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDescription} numberOfLines={2}>
                  {offer.description}
                </Text>
                <View style={styles.offerPoints}>
                  <Ionicons name="add-circle" size={16} color="#10B981" />
                  <Text style={styles.offerPointsText}>+{offer.bonusPoints} pts</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.statValue}>{user.totalEarned.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="gift" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{user.totalRedeemed.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Redeemed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#6366F1" />
              <Text style={styles.statValue}>
                {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  pointsCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  pointsGradient: {
    padding: 24,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tierText: {
    fontSize: 13,
    fontWeight: '700',
  },
  memberId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  pointsCenter: {
    alignItems: 'center',
    marginVertical: 24,
  },
  pointsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 52,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -2,
  },
  pointsSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: (width - 52) / 4,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  offersContainer: {
    paddingRight: 20,
    gap: 14,
  },
  offerCard: {
    width: 180,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    position: 'relative',
  },
  offerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  newBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  offerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  offerPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offerPointsText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});
