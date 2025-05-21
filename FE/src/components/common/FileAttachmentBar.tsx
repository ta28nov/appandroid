import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FileAttachmentBarProps {
  file: { uri: string; name: string; type: string } | null;
  onRemove: () => void;
}

const FileAttachmentBar: React.FC<FileAttachmentBarProps> = ({ file, onRemove }) => {
  if (!file) return null;
  const isImage = file.type.startsWith('image/');
  return (
    <View style={styles.container}>
      {isImage ? (
        <Image source={{ uri: file.uri }} style={styles.thumb} />
      ) : (
        <Icon name="file" size={28} color="#888" style={styles.thumb} />
      )}
      <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <Icon name="close" size={20} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    margin: 8,
    padding: 6,
    minHeight: 44,
  },
  thumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default FileAttachmentBar;
