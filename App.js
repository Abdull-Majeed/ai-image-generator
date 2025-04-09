import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt.');
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer hf...',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        Alert.alert('Error', 'Failed to generate image.');
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        setImageUrl(base64Image);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Image Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a prompt..."
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Generate Image" onPress={generateImage} />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode: 'contain',
  },
});
