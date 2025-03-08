import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { connectionStatus$ } from '@/state/state';

export function ConnectionStatus() {
  const isConnected = useSelector(connectionStatus$.isConnected);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You're offline. Changes will sync when connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    padding: 8,
    width: '100%',
  },
  text: {
    color: '#721c24',
    textAlign: 'center',
    fontSize: 12,
  },
});
