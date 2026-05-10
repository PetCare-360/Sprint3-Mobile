import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

export const Header = ({ 
  title, 
  showBack = false, 
  onBack,
  rightElement,
  transparent = false
}: HeaderProps) => {
  const { colors, spacing, typography, radius, isDark, shadows } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: transparent ? 'transparent' : (isDark ? colors.background : colors.surface),
        borderBottomColor: transparent ? 'transparent' : colors.divider,
        borderBottomWidth: transparent ? 0 : 1,
      }
    ]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor="transparent" 
      />
      <SafeAreaView>
        <View style={[styles.content, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
          <View style={styles.sideSection}>
            {showBack && (
              <TouchableOpacity 
                onPress={onBack} 
                style={[
                  styles.iconButton, 
                  { 
                    backgroundColor: isDark ? colors.surface : colors.gray50, 
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.divider
                  }
                ]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text 
              numberOfLines={1}
              style={[
                styles.title, 
                { 
                  color: colors.text, 
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.bold,
                  letterSpacing: -0.5,
                }
              ]}
            >
              {title}
            </Text>
          </View>

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
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 8,
    minHeight: 64,
  },
  sideSection: {
    minWidth: 44,
    height: 44,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    })
  },
});

