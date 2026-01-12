import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';

interface Transaction {
  _id: string;
  type: 'earned' | 'redeemed';
  title: string;
  description: string;
  points: number;
  createdAt: string;
}

export default function ActivityScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions(filter);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  useEffect(() => { loadTransactions(); }, [filter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [filter]);

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'earned', label: 'Earned' },
    { key: 'redeemed', label: 'Redeemed' },
  ] as const;

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.type === 'earned' ? '#39D35320' : '#E6394620' }]}>
        <Ionicons name={item.type === 'earned' ? 'arrow-down' : 'arrow-up'} size={24} color={item.type === 'earned' ? '#39D353' : '#E63946'} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.transactionDesc}>{item.description}</Text> : null}
        <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={[styles.transactionPoints, { color: item.type === 'earned' ? '#39D353' : '#E63946' }]}>
        {item.type === 'earned' ? '+' : ''}{item.points}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>

      <View style={styles.filterContainer}>
        {filterButtons.map((btn) => (
          <TouchableOpacity key={btn.key} style={[styles.filterBtn, filter === btn.key && styles.filterBtnActive]} onPress={() => setFilter(btn.key)}>
            <Text style={[styles.filterBtnText, filter === btn.key && styles.filterBtnTextActive]}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E63946" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={64} color="#30363D" />
            <Text style={styles.emptyTitle}>No Activity</Text>
            <Text style={styles.emptyDesc}>Your transactions will appear here</Text>
          </View>
        }
      />
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  filterBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D' },
  filterBtnActive: { backgroundColor: '#E63946', borderColor: '#E63946' },
  filterBtnText: { color: '#8B949E', fontWeight: '600' },
  filterBtnTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 16, padding: 16, marginBottom: 12 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  transactionDesc: { fontSize: 13, color: '#8B949E', marginTop: 2 },
  transactionDate: { fontSize: 12, color: '#8B949E', marginTop: 4 },
  transactionPoints: { fontSize: 18, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#8B949E', marginTop: 8 },
});
