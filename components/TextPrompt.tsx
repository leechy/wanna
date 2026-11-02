// hooks
import { useEffect, useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import SmallButton from '@/components/SmallButton';

interface TextPromptProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  submitTitle?: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

/**
 * Asks for one line of text, works the same on iOS and Android.
 * Give it a `key` per question, so the text starts from `initialValue`.
 */
export function TextPrompt({
  visible,
  title,
  placeholder,
  initialValue = '',
  submitTitle = 'Send',
  onSubmit,
  onCancel,
}: TextPromptProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const [text, setText] = useState(initialValue);
  const inputRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    if (visible) {
      // after the modal is shown, so the keyboard comes up
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={styles.overlay}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        accessibilityHint="Closes without saving"
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={[styles.dialog, { backgroundColor }]} accessible={false}>
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
            <ThemedInput
              placeholder={placeholder ?? ''}
              value={text}
              onChange={setText}
              inputRef={inputRef}
              enterKeyHint="send"
              onSubmit={() => onSubmit(text.trim())}
            />
            <View style={styles.buttons}>
              <SmallButton title="Cancel" onPress={onCancel} />
              <SmallButton title={submitTitle} onPress={() => onSubmit(text.trim())} />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#00000066',
  },
  dialog: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
