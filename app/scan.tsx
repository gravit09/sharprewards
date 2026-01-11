import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, G, Line } from 'react-native-svg';
import mockData from '../data/mockData.json';

const { width } = Dimensions.get('window');

// Custom QR Code component using SVG
const QRCodeDisplay = ({ value, size }: { value: string; size: number }) => {
  // Generate a simple visual pattern based on the value
  const generatePattern = (val: string) => {
    const pattern: boolean[][] = [];
    const gridSize = 21;
    
    // Create base pattern
    for (let i = 0; i < gridSize; i++) {
      pattern[i] = [];
      for (let j = 0; j < gridSize; j++) {
        // Finder patterns (corners)
        if ((i < 7 && j < 7) || (i < 7 && j >= gridSize - 7) || (i >= gridSize - 7 && j < 7)) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || 
              (j >= gridSize - 7 && (j === gridSize - 7 || j === gridSize - 1)) ||
              (i >= gridSize - 7 && (i === gridSize - 7 || i === gridSize - 1))) {
            pattern[i][j] = true;
          } else if ((i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                     (i >= 2 && i <= 4 && j >= gridSize - 5 && j <= gridSize - 3) ||
                     (i >= gridSize - 5 && i <= gridSize - 3 && j >= 2 && j <= 4)) {
            pattern[i][j] = true;
          } else {
            pattern[i][j] = false;
          }
        } else {
          // Data pattern based on string hash
          const charCode = val.charCodeAt((i * gridSize + j) % val.length) || 0;
          pattern[i][j] = ((charCode + i + j) % 3) === 0;
        }
      }
    }
    return pattern;
  };

  const pattern = generatePattern(value);
  const cellSize = size / 21;
  const padding = 10;

  return (
    <View style={[styles.qrContainer, { width: size + padding * 2, height: size + padding * 2 }]}>
      <Svg width={size} height={size}>
        <Rect x={0} y={0} width={size} height={size} fill="#FFFFFF" rx={4} />
        <G>
          {pattern.map((row, i) =>
            row.map((cell, j) =>
              cell ? (
                <Rect
                  key={`${i}-${j}`}
                  x={j * cellSize}
                  y={i * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0F172A"
                />
              ) : null
            )
          )}
        </G>
      </Svg>
    </View>
  );
};

export default function ScanScreen() {
  const { user } = mockData;
  const [activeTab, setActiveTab] = useState<'show' | 'scan'>('show');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan & Earn</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'show' && styles.tabActive]}
          onPress={() => setActiveTab('show')}
        >
          <Ionicons
            name="qr-code"
            size={20}
            color={activeTab === 'show' ? '#FFFFFF' : '#64748B'}
          />
          <Text style={[styles.tabText, activeTab === 'show' && styles.tabTextActive]}>
            Show Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.tabActive]}
          onPress={() => setActiveTab('scan')}
        >
          <Ionicons
            name="scan"
            size={20}
            color={activeTab === 'scan' ? '#FFFFFF' : '#64748B'}
          />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.tabTextActive]}>
            Scan Receipt
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'show' ? (
        /* Show QR Code View */
        <View style={styles.content}>
          <View style={styles.qrCard}>
            <View style={styles.qrHeader}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>S</Text>
              </View>
              <View>
                <Text style={styles.brandName}>Sharp Rewards</Text>
                <Text style={styles.memberLabel}>Member ID</Text>
              </View>
            </View>

            <View style={styles.qrWrapper}>
              <QRCodeDisplay value={user.memberId} size={220} />
            </View>

            <View style={styles.memberIdContainer}>
              <Text style={styles.memberId}>{user.memberId}</Text>
              <TouchableOpacity>
                <Ionicons name="copy-outline" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.qrInstruction}>
              Show this code at checkout to earn points
            </Text>
          </View>

          {/* Points Summary */}
          <View style={styles.pointsSummary}>
            <View style={styles.pointsRow}>
              <View style={styles.pointsItem}>
                <Text style={styles.pointsValue}>{user.points.toLocaleString()}</Text>
                <Text style={styles.pointsLabel}>Available</Text>
              </View>
              <View style={styles.pointsDivider} />
              <View style={styles.pointsItem}>
                <Text style={styles.pointsValue}>{user.tier}</Text>
                <Text style={styles.pointsLabel}>Status</Text>
              </View>
              <View style={styles.pointsDivider} />
              <View style={styles.pointsItem}>
                <Text style={styles.pointsValue}>2x</Text>
                <Text style={styles.pointsLabel}>Multiplier</Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.tipText}>Scan before payment for bonus points</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.tipText}>Earn 2x points as a Gold member</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.tipText}>Check for bonus offers before shopping</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Scan Receipt View */
        <View style={styles.content}>
          <View style={styles.scannerPlaceholder}>
            <View style={styles.scanFrame}>
              <View style={[styles.cornerTL, styles.corner]} />
              <View style={[styles.cornerTR, styles.corner]} />
              <View style={[styles.cornerBL, styles.corner]} />
              <View style={[styles.cornerBR, styles.corner]} />
              
              <View style={styles.scanLineContainer}>
                <View style={styles.scanLine} />
              </View>
            </View>
            
            <Text style={styles.scanInstruction}>
              Position the receipt barcode within the frame
            </Text>
          </View>

          <View style={styles.scanOptions}>
            <TouchableOpacity style={styles.scanOption}>
              <View style={styles.scanOptionIcon}>
                <Ionicons name="camera" size={24} color="#6366F1" />
              </View>
              <Text style={styles.scanOptionTitle}>Take Photo</Text>
              <Text style={styles.scanOptionDescription}>Capture receipt with camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.scanOption}>
              <View style={styles.scanOptionIcon}>
                <Ionicons name="images" size={24} color="#10B981" />
              </View>
              <Text style={styles.scanOptionTitle}>From Gallery</Text>
              <Text style={styles.scanOptionDescription}>Select from photos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentScans}>
            <Text style={styles.recentTitle}>Recent Scans</Text>
            <View style={styles.recentItem}>
              <View style={styles.recentIconContainer}>
                <Ionicons name="receipt" size={20} color="#6366F1" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentStore}>Sharp Store - Downtown</Text>
                <Text style={styles.recentDate}>Today, 2:45 PM</Text>
              </View>
              <View style={styles.recentPoints}>
                <Text style={styles.recentPointsText}>+450 pts</Text>
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.recentIconContainer}>
                <Ionicons name="receipt" size={20} color="#6366F1" />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentStore}>Sharp Electronics</Text>
                <Text style={styles.recentDate}>Yesterday, 11:20 AM</Text>
              </View>
              <View style={styles.recentPoints}>
                <Text style={styles.recentPointsText}>+280 pts</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  qrCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandName: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  memberLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  qrWrapper: {
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  memberIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  memberId: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  qrInstruction: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  pointsSummary: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pointsItem: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  pointsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  tipsContainer: {
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  scannerPlaceholder: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scanFrame: {
    width: width - 80,
    height: width - 80,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#6366F1',
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 20,
    left: 20,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 20,
    right: 20,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLineContainer: {
    width: '70%',
    height: 2,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scanInstruction: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 16,
    textAlign: 'center',
  },
  scanOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  scanOption: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  scanOptionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanOptionTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  scanOptionDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  recentScans: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentStore: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#64748B',
  },
  recentPoints: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  recentPointsText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
  },
});
