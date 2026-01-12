import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';

interface Reward {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  featured: boolean;
}

export default function RewardsScreen() {
  const { user, refreshUser } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myRewards, setMyRewards] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const loadRewards = async () => {
    try {
      const [rewardsData, myRewardsData] = await Promise.all([api.getRewards(), api.getMyRewards()]);
      setRewards(rewardsData);
      setMyRewards(myRewardsData);
    } catch (error) {
      console.error('Error loading rewards:', error);
    }
  };

  useEffect(() => { loadRewards(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadRewards()]);
    setRefreshing(false);
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (!user || user.points < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points - (user?.points || 0)} more points.`);
      return;
    }
    Alert.alert('Redeem Reward', `Redeem "${reward.title}" for ${reward.points} points?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Redeem',
        onPress: async () => {
          try {
            const result = await api.redeemReward(reward._id);
            Alert.alert('Success!', `Code: ${result.reward.code}`);
            await Promise.all([refreshUser(), loadRewards()]);
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const categoryIcons: Record<string, string> = {
    discount: 'pricetag', gift_card: 'card', shipping: 'airplane', exclusive: 'star', bonus: 'flash',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.pointsBadge}>
          <Ionicons name="diamond" size={16} color="#E63946" />
          <Text style={styles.pointsText}>{user?.points?.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E63946" />}>
        {myRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Rewards ({myRewards.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {myRewards.map((reward, i) => (
                <TouchableOpacity key={i} style={styles.myRewardCard} onPress={() => setSelectedReward(reward)}>
                  <View style={styles.myRewardIcon}>
                    <Ionicons name="ticket" size={24} color="#39D353" />
                  </View>
                  <Text style={styles.myRewardTitle} numberOfLines={1}>{reward.title}</Text>
                  <Text style={styles.myRewardCode}>{reward.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          {rewards.map((reward) => (
            <View key={reward._id} style={[styles.rewardCard, reward.featured && styles.featuredCard]}>
              {reward.featured && <View style={styles.featuredBadge}><Text style={styles.featuredText}>Featured</Text></View>}
              <View style={styles.rewardHeader}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name={(categoryIcons[reward.category] || 'gift') as any} size={24} color="#E63946" />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDesc}>{reward.description}</Text>
                </View>
              </View>
              <View style={styles.rewardFooter}>
                <View style={styles.pointsRequired}>
                  <Ionicons name="diamond-outline" size={16} color="#8B949E" />
                  <Text style={styles.pointsRequiredText}>{reward.points.toLocaleString()} pts</Text>
                </View>
                <TouchableOpacity
                  style={[styles.redeemBtn, (user?.points || 0) < reward.points && styles.redeemBtnDisabled]}
                  onPress={() => handleRedeem(reward)}
                  disabled={(user?.points || 0) < reward.points}
                >
                  <Text style={styles.redeemBtnText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!selectedReward} transparent animationType="fade" onRequestClose={() => setSelectedReward(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="ticket" size={48} color="#39D353" />
            </View>
            <Text style={styles.modalTitle}>{selectedReward?.title}</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Your Code</Text>
              <Text style={styles.codeValue}>{selectedReward?.code}</Text>
            </View>
            <Text style={styles.expiresText}>Expires: {selectedReward?.expiresAt && new Date(selectedReward.expiresAt).toLocaleDateString()}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReward(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  pointsText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  myRewardCard: { width: 140, backgroundColor: '#161B22', borderRadius: 16, padding: 16, marginRight: 12, alignItems: 'center' },
  myRewardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#39D35320', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  myRewardTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  myRewardCode: { fontSize: 12, color: '#39D353', marginTop: 4 },
  rewardCard: { backgroundColor: '#161B22', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#30363D' },
  featuredCard: { borderColor: '#E63946' },
  featuredBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#E6394620', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  featuredText: { fontSize: 10, color: '#E63946', fontWeight: '700' },
  rewardHeader: { flexDirection: 'row', marginBottom: 16 },
  rewardIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E6394620', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  rewardDesc: { fontSize: 13, color: '#8B949E', marginTop: 4 },
  rewardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsRequired: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsRequiredText: { fontSize: 14, color: '#8B949E', fontWeight: '600' },
  redeemBtn: { backgroundColor: '#E63946', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  redeemBtnDisabled: { backgroundColor: '#30363D' },
  redeemBtnText: { color: '#FFFFFF', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#161B22', borderRadius: 24, padding: 32, width: '85%', alignItems: 'center' },
  modalIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#39D35320', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  codeContainer: { backgroundColor: '#0D1117', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginTop: 20 },
  codeLabel: { fontSize: 12, color: '#8B949E' },
  codeValue: { fontSize: 24, fontWeight: '700', color: '#39D353', marginTop: 4 },
  expiresText: { fontSize: 13, color: '#8B949E', marginTop: 16 },
  closeBtn: { backgroundColor: '#E63946', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginTop: 20 },
  closeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
