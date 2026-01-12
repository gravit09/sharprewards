import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="diamond" size={60} color="#E63946" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Sharp Rewards and earn points!</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Ionicons name="person-outline" size={20} color="#8B949E" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#8B949E" value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#8B949E" value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#8B949E" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#8B949E" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8B949E" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#8B949E" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8B949E" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#8B949E', marginTop: 8 },
  form: { width: '100%' },
  row: { flexDirection: 'row', gap: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#30363D' },
  halfInput: { flex: 1 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, color: '#FFFFFF', fontSize: 16 },
  button: { backgroundColor: '#E63946', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#8B949E', fontSize: 15 },
  linkText: { color: '#E63946', fontSize: 15, fontWeight: '600' },
});
