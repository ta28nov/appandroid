import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const EMOJIS = ['😀','😂','😍','😎','😭','👍','🙏','🎉','❤️','🔥','😡','😱','😅','😇','🤔','🥳','😏','😴','😬','🤩','😢'];

interface EmojiPickerProps {
  visible: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ visible, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.picker}>
          <FlatList
            data={EMOJIS}
            numColumns={8}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.emojiBtn} onPress={() => onSelect(item)}>
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  picker: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    paddingBottom: 24,
    minHeight: 120,
  },
  emojiBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  emoji: {
    fontSize: 24,
  },
});

export default EmojiPicker;
