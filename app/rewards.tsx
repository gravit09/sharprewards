import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockData from '../data/mockData.json';

const { width } = Dimensions.get('window');

type Reward = typeof mockData.rewards[0];

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    discount: 'pricetag',
    gift_card: 'card',
    shipping: 'car',
    exclusive: 'star',
    bonus: 'flash',
  };
  return iconMap[category] || 'gift';
};

const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    discount: '#F59E0B',
    gift_card: '#6366F1',
    shipping: '#10B981',
    exclusive: '#EC4899',
    bonus: '#8B5CF6',
  };
  return colorMap[category] || '#6366F1';
};

export default function RewardsScreen() {
  const { rewards, user, myRewards } = mockData;
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');

  const featuredRewards = rewards.filter(r => r.featured);

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  const confirmRedeem = () => {
    setShowModal(false);
    // In a real app, this would update state/backend
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.pointsBadgeText}>{user.points.toLocaleString()}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.tabActive]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
            My Rewards ({myRewards.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'available' ? (
          <>
            {/* Featured Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔥 Featured Rewards</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredContainer}
              >
                {featuredRewards.map((reward) => (
                  <TouchableOpacity
                    key={reward.id}
                    style={styles.featuredCard}
                    onPress={() => handleRedeem(reward)}
                  >
                    <View
                      style={[
                        styles.featuredIcon,
                        { backgroundColor: getCategoryColor(reward.category) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(reward.category)}
                        size={32}
                        color={getCategoryColor(reward.category)}
                      />
                    </View>
                    <Text style={styles.featuredTitle}>{reward.title}</Text>
                    <Text style={styles.featuredDescription} numberOfLines={2}>
                      {reward.description}
                    </Text>
                    <View style={styles.featuredFooter}>
                      <View style={styles.pointsRequired}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.pointsRequiredText}>
                          {reward.points.toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.expiresText}>Expires: {reward.expiresIn}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* All Rewards */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Rewards</Text>
              <View style={styles.rewardsGrid}>
                {rewards.map((reward) => {
                  const canAfford = user.points >= reward.points;
                  return (
                    <TouchableOpacity
                      key={reward.id}
                      style={[styles.rewardCard, !canAfford && styles.rewardCardDisabled]}
                      onPress={() => canAfford && handleRedeem(reward)}
                      disabled={!canAfford}
                    >
                      <View
                        style={[
                          styles.rewardIcon,
                          { backgroundColor: getCategoryColor(reward.category) + '20' },
                        ]}
                      >
                        <Ionicons
                          name={getCategoryIcon(reward.category)}
                          size={28}
                          color={getCategoryColor(reward.category)}
                        />
                      </View>
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <Text style={styles.rewardDescription} numberOfLines={1}>
                          {reward.description}
                        </Text>
                      </View>
                      <View style={styles.rewardRight}>
                        <View style={[styles.rewardPoints, !canAfford && styles.rewardPointsDisabled]}>
                          <Ionicons
                            name="star"
                            size={12}
                            color={canAfford ? '#F59E0B' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.rewardPointsText,
                              !canAfford && styles.rewardPointsTextDisabled,
                            ]}
                          >
                            {reward.points.toLocaleString()}
                          </Text>
                        </View>
                        {!canAfford && (
                          <Text style={styles.needMoreText}>
                            Need {(reward.points - user.points).toLocaleString()}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          /* My Rewards Tab */
          <View style={styles.section}>
            {myRewards.length > 0 ? (
              myRewards.map((reward) => (
                <View key={reward.id} style={styles.myRewardCard}>
                  <View style={styles.myRewardHeader}>
                    <View style={styles.myRewardIconContainer}>
                      <Ionicons name="gift" size={24} color="#6366F1" />
                    </View>
                    <View style={styles.myRewardInfo}>
                      <Text style={styles.myRewardTitle}>{reward.title}</Text>
                      <Text style={styles.myRewardDescription}>{reward.description}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{reward.status}</Text>
                    </View>
                  </View>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Reward Code</Text>
                    <View style={styles.codeBox}>
                      <Text style={styles.codeText}>{reward.code}</Text>
                      <TouchableOpacity style={styles.copyButton}>
                        <Ionicons name="copy-outline" size={20} color="#6366F1" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.expiryText}>
                    Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="gift-outline" size={64} color="#64748B" />
                <Text style={styles.emptyTitle}>No Rewards Yet</Text>
                <Text style={styles.emptyDescription}>
                  Redeem your points for exciting rewards!
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Redeem Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Redemption</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            
            {selectedReward && (
              <>
                <View style={styles.modalRewardInfo}>
                  <View
                    style={[
                      styles.modalIcon,
                      { backgroundColor: getCategoryColor(selectedReward.category) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryIcon(selectedReward.category)}
                      size={40}
                      color={getCategoryColor(selectedReward.category)}
                    />
                  </View>
                  <Text style={styles.modalRewardTitle}>{selectedReward.title}</Text>
                  <Text style={styles.modalRewardDescription}>
                    {selectedReward.description}
                  </Text>
                </View>

                <View style={styles.modalPoints}>
                  <Text style={styles.modalPointsLabel}>Points Required</Text>
                  <View style={styles.modalPointsValue}>
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Text style={styles.modalPointsText}>
                      {selectedReward.points.toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalBalance}>
                  <View style={styles.modalBalanceRow}>
                    <Text style={styles.modalBalanceLabel}>Current Balance</Text>
                    <Text style={styles.modalBalanceValue}>
                      {user.points.toLocaleString()} pts
                    </Text>
                  </View>
                  <View style={styles.modalBalanceRow}>
                    <Text style={styles.modalBalanceLabel}>After Redemption</Text>
                    <Text style={styles.modalBalanceValueNew}>
                      {(user.points - selectedReward.points).toLocaleString()} pts
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.redeemButton} onPress={confirmRedeem}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.redeemButtonText}>Confirm Redemption</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pointsBadgeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  featuredContainer: {
    gap: 14,
    paddingRight: 20,
  },
  featuredCard: {
    width: 200,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
  },
  featuredIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  featuredTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  featuredDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 14,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsRequiredText: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '700',
  },
  expiresText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rewardsGrid: {
    gap: 12,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  rewardRight: {
    alignItems: 'flex-end',
  },
  rewardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  rewardPointsDisabled: {
    backgroundColor: '#334155',
  },
  rewardPointsText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '700',
  },
  rewardPointsTextDisabled: {
    color: '#64748B',
  },
  needMoreText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  myRewardCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },
  myRewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  myRewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  myRewardInfo: {
    flex: 1,
  },
  myRewardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  myRewardDescription: {
    fontSize: 13,
    color: '#94A3B8',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  codeContainer: {
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  codeText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  copyButton: {
    padding: 4,
  },
  expiryText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalRewardInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalRewardTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalRewardDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  modalPoints: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  modalPointsLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  modalPointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalPointsText: {
    fontSize: 28,
    color: '#F59E0B',
    fontWeight: '800',
  },
  modalBalance: {
    marginBottom: 24,
  },
  modalBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalBalanceLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalBalanceValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalBalanceValueNew: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
  },
  redeemButtonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
