import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';

export const Settings = ({ navigation }: any) => {
  const { signOut } = useAuth();
  const { colors, spacing, typography, radius, toggleTheme, isDark } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => await signOut() }
      ]
    );
  };

  const SettingItem = ({ icon, label, value, onPress, isSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.text, fontSize: typography.sizes.md }]}>{value}</Text>
        </View>
      </View>
      {isSwitch ? (
        <Switch 
          value={switchValue} 
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary + '50' }}
          thumbColor={switchValue ? colors.primary : colors.gray500}
        />
      ) : (
        onPress && <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Configurações" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card variant="elevated" padding="none" style={styles.menuCard}>
          <SettingItem 
            icon="theme-light-dark" 
            label="Tema" 
            value={isDark ? 'Modo Escuro' : 'Modo Claro'} 
            isSwitch 
            switchValue={isDark} 
            onSwitchChange={toggleTheme} 
          />
        </Card>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.danger + '10', borderRadius: radius.md }]} 
          onPress={handleSignOut}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger, fontSize: typography.sizes.md }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuCard: {
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontWeight: '700',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 8,
  },
  logoutText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
