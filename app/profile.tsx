import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockData from '../data/mockData.json';

type MenuItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
};

export default function ProfileScreen() {
  const { user, tiers } = mockData;
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const currentTier = tiers.find(t => t.name === user.tier);
  const nextTier = tiers.find(t => t.name === user.nextTier);

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { id: 'personal', title: 'Personal Information', icon: 'person-outline', color: '#6366F1', hasArrow: true },
        { id: 'payment', title: 'Payment Methods', icon: 'card-outline', color: '#10B981', hasArrow: true },
        { id: 'addresses', title: 'Saved Addresses', icon: 'location-outline', color: '#F59E0B', hasArrow: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', title: 'Push Notifications', icon: 'notifications-outline', color: '#EC4899', hasSwitch: true },
        { id: 'darkmode', title: 'Dark Mode', icon: 'moon-outline', color: '#8B5CF6', hasSwitch: true },
        { id: 'language', title: 'Language', icon: 'language-outline', color: '#06B6D4', hasArrow: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', title: 'Help Center', icon: 'help-circle-outline', color: '#6366F1', hasArrow: true },
        { id: 'contact', title: 'Contact Us', icon: 'chatbubble-outline', color: '#10B981', hasArrow: true },
        { id: 'feedback', title: 'Send Feedback', icon: 'star-outline', color: '#F59E0B', hasArrow: true },
      ],
    },
    {
      title: 'Legal',
      items: [
        { id: 'terms', title: 'Terms of Service', icon: 'document-text-outline', color: '#64748B', hasArrow: true },
        { id: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark-outline', color: '#64748B', hasArrow: true },
      ],
    },
  ];

  const handleSwitchChange = (id: string, value: boolean) => {
    if (id === 'notifications') {
      setNotifications(value);
    } else if (id === 'darkmode') {
      setDarkMode(value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.firstName[0]}{user.lastName[0]}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.tierBadge}>
            <Ionicons name="diamond" size={16} color={currentTier?.color || '#FFD700'} />
            <Text style={[styles.tierText, { color: currentTier?.color }]}>
              {user.tier} Member
            </Text>
          </View>
        </View>

        {/* Tier Progress Card */}
        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierTitle}>Your Status</Text>
            <TouchableOpacity>
              <Text style={styles.viewBenefits}>View Benefits</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tierProgress}>
            <View style={styles.tierInfo}>
              <View style={[styles.tierDot, { backgroundColor: currentTier?.color }]} />
              <Text style={styles.currentTierText}>{user.tier}</Text>
            </View>
            <View style={styles.tierInfo}>
              <View style={[styles.tierDot, { backgroundColor: nextTier?.color }]} />
              <Text style={styles.nextTierText}>{user.nextTier}</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(user.points / (user.points + user.pointsToNextTier)) * 100}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressText}>
            <Text style={styles.progressHighlight}>{user.pointsToNextTier.toLocaleString()}</Text> points to {user.nextTier}
          </Text>

          {/* Current Tier Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Your Benefits</Text>
            {currentTier?.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.points.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalEarned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Lifetime Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.floor((new Date().getTime() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30))}
            </Text>
            <Text style={styles.statLabel}>Months Active</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.hasArrow && (
                    <Ionicons name="chevron-forward" size={20} color="#64748B" />
                  )}
                  {item.hasSwitch && (
                    <Switch
                      value={item.id === 'notifications' ? notifications : darkMode}
                      onValueChange={(value) => handleSwitchChange(item.id, value)}
                      trackColor={{ false: '#334155', true: '#6366F1' }}
                      thumbColor="#FFFFFF"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Sharp Rewards v1.0.0</Text>

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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tierCard: {
    marginHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewBenefits: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
  tierProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  currentTierText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nextTierText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  benefitsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  menuSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  menuSectionTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 14,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 20,
  },
});
