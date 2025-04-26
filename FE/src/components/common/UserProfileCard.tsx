import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import { getInitials } from '../../utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UserProfileCardProps {
  userId: string;
  name: string;
  role?: string;
  department?: string;
  avatar?: string;
  presence?: 'online' | 'offline' | 'busy' | 'away';
  onPress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
  showPresence?: boolean;
}

const PresenceStatusColors = {
  online: '#34C759', // green
  offline: '#8E8E93', // gray
  busy: '#FF3B30', // red
  away: '#FF9500', // orange
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userId,
  name,
  role,
  department,
  avatar,
  presence,
  onPress,
  style,
  compact = false,
  showPresence = true,
}) => {
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const renderAvatar = () => {
    if (avatar) {
      return (
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: avatar }} 
            style={[
              styles.avatar,
              compact ? styles.avatarCompact : null,
            ]} 
          />
          {showPresence && presence && (
            <View 
              style={[
                styles.presenceIndicator,
                { backgroundColor: PresenceStatusColors[presence] },
                compact ? styles.presenceIndicatorCompact : null,
              ]}
            />
          )}
        </View>
      );
    } else {
      // Fallback to initials avatar
      return (
        <View style={styles.avatarContainer}>
          <View 
            style={[
              styles.initialsAvatar,
              { backgroundColor: colors.primary },
              compact ? styles.avatarCompact : null,
            ]}
          >
            <Text style={styles.initialsText}>{getInitials(name)}</Text>
          </View>
          {showPresence && presence && (
            <View 
              style={[
                styles.presenceIndicator,
                { backgroundColor: PresenceStatusColors[presence] },
                compact ? styles.presenceIndicatorCompact : null,
              ]}
            />
          )}
        </View>
      );
    }
  };
  
  const cardContent = (
    <>
      {renderAvatar()}
      <View style={[styles.infoContainer, compact ? styles.infoContainerCompact : null]}>
        <Text 
          style={[
            styles.name,
            { color: theme.colors.text },
            compact ? styles.nameCompact : null,
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        
        {(role || department) && !compact && (
          <Text 
            style={[
              styles.details,
              { color: isDarkMode ? colors.text.secondary : colors.text.secondary },
            ]}
            numberOfLines={1}
          >
            {role && department ? `${role} • ${department}` : role || department}
          </Text>
        )}
      </View>
    </>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface },
          !compact && SHADOW.small,
          compact ? styles.containerCompact : null,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {cardContent}
        <Icon name="chevron-right" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    );
  }
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
        !compact && SHADOW.small,
        compact ? styles.containerCompact : null,
        style,
      ]}
    >
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginVertical: SPACING.xs,
  },
  containerCompact: {
    padding: SPACING.xs,
    borderRadius: 8,
    marginVertical: 0,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  initialsAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  presenceIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  presenceIndicatorCompact: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  infoContainerCompact: {
    marginLeft: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.button,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: 2,
  },
  nameCompact: {
    fontSize: FONT_SIZE.body,
    marginBottom: 0,
  },
  details: {
    fontSize: FONT_SIZE.body,
  },
});

export default UserProfileCard; 