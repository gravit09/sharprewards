import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockData from '../data/mockData.json';

type FilterType = 'all' | 'earned' | 'redeemed';

export default function ActivityScreen() {
  const { transactions, user } = mockData;
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = transactions.filter((txn) => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  const groupTransactionsByDate = (txns: typeof transactions) => {
    const groups: { [key: string]: typeof transactions } = {};
    
    txns.forEach((txn) => {
      const date = new Date(txn.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(txn);
    });

    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const getTransactionIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    return type === 'earned' ? 'add-circle' : 'remove-circle';
  };

  const getTransactionColor = (type: string): string => {
    return type === 'earned' ? '#10B981' : '#F59E0B';
  };

  // Calculate summary stats
  const earnedThisMonth = transactions
    .filter(t => t.type === 'earned' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.points, 0);
  
  const redeemedThisMonth = transactions
    .filter(t => t.type === 'redeemed' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            +{earnedThisMonth.toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Earned this month</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
          <Ionicons name="gift" size={24} color="#F59E0B" />
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            -{redeemedThisMonth.toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Redeemed this month</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {(['all', 'earned', 'redeemed'] as FilterType[]).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterTab, filter === filterType && styles.filterTabActive]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[styles.filterTabText, filter === filterType && styles.filterTabTextActive]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.transactionList}>
        {Object.entries(groupedTransactions).map(([date, txns]) => (
          <View key={date} style={styles.transactionGroup}>
            <Text style={styles.groupDate}>{date}</Text>
            {txns.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View
                  style={[
                    styles.transactionIcon,
                    { backgroundColor: getTransactionColor(transaction.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getTransactionIcon(transaction.type)}
                    size={24}
                    color={getTransactionColor(transaction.type)}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
                <View style={styles.transactionPoints}>
                  <Text
                    style={[
                      styles.transactionPointsText,
                      { color: getTransactionColor(transaction.type) },
                    ]}
                  >
                    {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                  </Text>
                  <Text style={styles.transactionPointsLabel}>pts</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#64748B" />
            <Text style={styles.emptyTitle}>No Activity Found</Text>
            <Text style={styles.emptyDescription}>
              {filter === 'all'
                ? 'Your transactions will appear here'
                : `No ${filter} transactions found`}
            </Text>
          </View>
        )}

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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#1E293B',
  },
  filterTabActive: {
    backgroundColor: '#6366F1',
  },
  filterTabText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionGroup: {
    marginBottom: 24,
  },
  groupDate: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  transactionPoints: {
    alignItems: 'flex-end',
  },
  transactionPointsText: {
    fontSize: 18,
    fontWeight: '700',
  },
  transactionPointsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
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
});
