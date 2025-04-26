import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PRESENCE_STATUS } from '../../utils/constants';

type PresenceStatus = 'online' | 'offline' | 'busy' | 'away';

interface PresenceIndicatorProps {
  status: PresenceStatus;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  borderColor?: string;
}

const PresenceStatusColors = {
  online: '#34C759', // green
  offline: '#8E8E93', // gray
  busy: '#FF3B30', // red
  away: '#FF9500', // orange
};

const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  status,
  size = 'medium',
  style,
  borderColor = 'white',
}) => {
  // Get size dimensions
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 1.5,
        };
      case 'large':
        return {
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2.5,
        };
      case 'medium':
      default:
        return {
          width: 12,
          height: 12,
          borderRadius: 6,
          borderWidth: 2,
        };
    }
  };

  return (
    <View
      style={[
        styles.indicator,
        getDimensions(),
        { backgroundColor: PresenceStatusColors[status], borderColor },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default PresenceIndicator; 