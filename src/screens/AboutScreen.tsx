import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

const REPO_URL = 'https://github.com/PetCare-360/Sprint3-Mobile';

export const AboutScreen = ({ navigation }: any) => {
  const { colors, spacing, typography, radius } = useTheme();

  const version = Constants.expoConfig?.version ?? '—';
  const commitHash: string = Constants.expoConfig?.extra?.commitHash ?? 'dev';
  const shortHash = commitHash === 'dev' ? commitHash : commitHash.slice(0, 7);

  const InfoRow = ({ icon, label, value }: { icon: React.ComponentProps<typeof Icon>['name']; label: string; value: string }) => (
    <View style={styles.row}>
      <View style={[styles.iconBadge, { backgroundColor: colors.primary + '14', borderRadius: radius.round }]}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: colors.text }]} selectable>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Sobre o app" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.hero}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary + '14', borderRadius: radius.round }]}>
            <Icon name="paw" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>PetCare 360</Text>
          <Text style={{ color: colors.textSecondary }}>Monitoramento de saúde e localização de pets</Text>
        </View>

        <Card padding="md" variant="flat" style={{ marginTop: 24 }}>
          <InfoRow icon="tag-outline" label="Versão" value={version} />
          <View style={{ height: 16 }} />
          <InfoRow icon="source-commit" label="Commit de referência desta build" value={shortHash} />
        </Card>

        <TouchableOpacity onPress={() => Linking.openURL(REPO_URL)} style={styles.repoLink}>
          <Icon name="github" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.textSecondary, textDecorationLine: 'underline' }}>Ver código-fonte no repositório</Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Desenvolvido como projeto acadêmico (Sprint 4) com React Native + Expo.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { alignItems: 'center', marginTop: 8 },
  logoCircle: { width: 84, height: 84, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  appName: { fontSize: 22, fontWeight: 'bold', letterSpacing: -0.5, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  rowValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  repoLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 32, lineHeight: 18 },
});
