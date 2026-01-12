import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const tierColors: Record<string, string> = { Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700', Platinum: '#E5E4E2' };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Edit profile coming soon') },
    { icon: 'card-outline', label: 'Payment Methods', onPress: () => Alert.alert('Coming Soon', 'Payment methods coming soon') },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon') },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Help', 'Contact support@sharprewards.com') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
          </View>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColors[user?.tier || 'Bronze'] + '20', borderColor: tierColors[user?.tier || 'Bronze'] }]}>
            <Ionicons name="diamond" size={16} color={tierColors[user?.tier || 'Bronze']} />
            <Text style={[styles.tierText, { color: tierColors[user?.tier || 'Bronze'] }]}>{user?.tier} Member</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.points?.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.memberId}</Text>
            <Text style={styles.statLabel}>Member ID</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#8B949E" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E63946" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Sharp Rewards v1.0.0</Text>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { flex: 1 },
  header: { alignItems: 'center', paddingVertical: 32 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E63946', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  email: { fontSize: 16, color: '#8B949E', marginTop: 4 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 8, marginTop: 16 },
  tierText: { fontSize: 14, fontWeight: '600' },
  statsCard: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#161B22', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#30363D' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 13, color: '#8B949E', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#30363D' },
  menuSection: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 12, padding: 16, marginBottom: 8 },
  menuIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#21262D', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E63946', gap: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#E63946' },
  version: { textAlign: 'center', color: '#8B949E', fontSize: 13, marginVertical: 24 },
});
