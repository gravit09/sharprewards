import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { name: 'index', title: 'Home', icon: 'home', path: '/(tabs)' },
  { name: 'rewards', title: 'Rewards', icon: 'gift', path: '/(tabs)/rewards' },
  { name: 'scan', title: 'Scan', icon: 'qr-code', path: '/(tabs)/scan' },
  { name: 'activity', title: 'Activity', icon: 'receipt', path: '/(tabs)/activity' },
  { name: 'profile', title: 'Profile', icon: 'person', path: '/(tabs)/profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string, name: string) => {
    if (name === 'index') return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
    return pathname.includes(name);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.path, tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.path as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={active ? '#E63946' : '#8B949E'}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#161B22',
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 11,
    color: '#8B949E',
    marginTop: 4,
  },
  activeLabel: {
    color: '#E63946',
  },
});
