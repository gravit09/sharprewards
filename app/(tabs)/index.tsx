import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({ earnedThisMonth: 0, redeemedThisMonth: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [statsData, transactionsData] = await Promise.all([api.getStats(), api.getTransactions()]);
      setStats(statsData);
      setRecentActivity(transactionsData.slice(0, 3));
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), loadData()]);
    setRefreshing(false);
  }, []);

  const tierColors: Record<string, string> = { Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700', Platinum: '#E5E4E2' };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E63946" />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.pointsCard}>
          <View style={styles.pointsRow}>
            <View>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>{user?.points?.toLocaleString() || 0}</Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: tierColors[user?.tier || 'Bronze'] + '20', borderColor: tierColors[user?.tier || 'Bronze'] }]}>
              <Ionicons name="diamond" size={16} color={tierColors[user?.tier || 'Bronze']} />
              <Text style={[styles.tierText, { color: tierColors[user?.tier || 'Bronze'] }]}>{user?.tier}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+{stats.earnedThisMonth}</Text>
              <Text style={styles.statLabel}>Earned this month</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.redeemedThisMonth}</Text>
              <Text style={styles.statLabel}>Redeemed</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyActivity}>
              <Ionicons name="receipt-outline" size={48} color="#30363D" />
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          ) : (
            recentActivity.map((item, i) => (
              <View key={i} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: item.type === 'earned' ? '#39D35320' : '#E6394620' }]}>
                  <Ionicons name={item.type === 'earned' ? 'arrow-down' : 'arrow-up'} size={20} color={item.type === 'earned' ? '#39D353' : '#E63946'} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.activityPoints, { color: item.type === 'earned' ? '#39D353' : '#E63946' }]}>
                  {item.type === 'earned' ? '+' : ''}{item.points}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  greeting: { fontSize: 16, color: '#8B949E' },
  name: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center' },
  pointsCard: { margin: 20, backgroundColor: '#161B22', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#30363D' },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pointsLabel: { fontSize: 14, color: '#8B949E' },
  pointsValue: { fontSize: 40, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
  tierText: { fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#30363D' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#39D353' },
  statLabel: { fontSize: 12, color: '#8B949E', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#30363D' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  emptyActivity: { alignItems: 'center', padding: 32, backgroundColor: '#161B22', borderRadius: 16 },
  emptyText: { fontSize: 14, color: '#8B949E', marginTop: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', padding: 16, borderRadius: 12, marginBottom: 12 },
  activityIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  activityDate: { fontSize: 12, color: '#8B949E', marginTop: 2 },
  activityPoints: { fontSize: 16, fontWeight: '700' },
});
