import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import BottomNav from '../../components/BottomNav';

export default function ScanScreen() {
  const { refreshUser } = useAuth();
  const [manualCode, setManualCode] = useState('');
  const [processing, setProcessing] = useState(false);

  const simulateScan = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    const points = Math.floor(Math.random() * 200) + 50;
    try {
      await api.addPoints(points, 'Receipt Scan', 'Points earned from scanned receipt');
      await refreshUser();
      Alert.alert('Success!', `You earned ${points} points!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleManualEntry = async () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a receipt code');
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    const points = Math.floor(Math.random() * 150) + 25;
    try {
      await api.addPoints(points, 'Manual Entry', `Receipt code: ${manualCode}`);
      await refreshUser();
      Alert.alert('Success!', `Code accepted! You earned ${points} points!`);
      setManualCode('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Receipt</Text>
          <Text style={styles.subtitle}>Earn points on every purchase</Text>
        </View>

        <View style={styles.scanArea}>
          <TouchableOpacity style={[styles.scanButton, processing && styles.scanButtonProcessing]} onPress={simulateScan} disabled={processing}>
            <View style={styles.scanIconContainer}>
              <Ionicons name={processing ? 'hourglass' : 'qr-code'} size={64} color="#FFFFFF" />
            </View>
            <Text style={styles.scanText}>{processing ? 'Processing...' : 'Tap to Scan'}</Text>
            <Text style={styles.scanHint}>Position the receipt within the frame</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.manualEntry}>
          <Text style={styles.manualTitle}>Enter Code Manually</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter receipt code"
              placeholderTextColor="#8B949E"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleManualEntry} disabled={processing}>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Scanning Tips</Text>
          <View style={styles.tip}>
            <Ionicons name="sunny-outline" size={20} color="#8B949E" />
            <Text style={styles.tipText}>Ensure good lighting</Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="expand-outline" size={20} color="#8B949E" />
            <Text style={styles.tipText}>Keep receipt flat and visible</Text>
          </View>
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  content: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#8B949E', marginTop: 4 },
  scanArea: { alignItems: 'center', paddingVertical: 24 },
  scanButton: { width: 180, height: 180, borderRadius: 24, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E63946', borderStyle: 'dashed' },
  scanButtonProcessing: { borderColor: '#58A6FF' },
  scanIconContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E63946', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  scanText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  scanHint: { fontSize: 12, color: '#8B949E', marginTop: 4 },
  divider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#30363D' },
  orText: { color: '#8B949E', paddingHorizontal: 16, fontSize: 14 },
  manualEntry: { paddingHorizontal: 20 },
  manualTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 12 },
  inputContainer: { flexDirection: 'row', gap: 12 },
  input: { flex: 1, backgroundColor: '#161B22', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#30363D' },
  submitBtn: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#E63946', justifyContent: 'center', alignItems: 'center' },
  tips: { margin: 20, backgroundColor: '#161B22', borderRadius: 16, padding: 20 },
  tipsTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 16 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  tipText: { fontSize: 14, color: '#8B949E' },
});
