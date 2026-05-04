import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header = ({ 
  title, 
  showBack = false, 
  onBack,
  rightElement 
}: HeaderProps) => {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.primary,
      }
    ]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView>
        <View style={[styles.content, { paddingHorizontal: spacing.md, paddingBottom: spacing.sm }]}>
          <View style={styles.sideSection}>
            {showBack && (
              <TouchableOpacity 
                onPress={onBack} 
                style={[styles.iconButton, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm }]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chevron-left" size={28} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          <Text 
            numberOfLines={1}
            style={[
              styles.title, 
              { 
                color: colors.white, 
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.bold 
              }
            ]}
          >
            {title}
          </Text>

          <View style={[styles.sideSection, { alignItems: 'flex-end' }]}>
            {rightElement}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  sideSection: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
