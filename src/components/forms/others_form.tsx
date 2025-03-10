import React, {useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

const OthersForm = () => {
  const {colors} = useTheme();
  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userResponse, setUserResponse] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  interface FormData {
    name: string;
    email: string;
    response: string;
  }

  const handleSubmit = async () => {
    try {
      const payload: FormData = {
        name,
        email,
        response: userResponse,
      };

      const response = await fetch(
        'https://saikawalab-427516.uc.r.appspot.com/api/v1/others-interest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your information has been submitted!');
        setName('');
        setEmail('');
        setUserResponse('');
        setFocusedInput(null);
      } else {
        Alert.alert('Error', 'Incomplete form. Please fill all fields.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={[styles.introText, {color: colors.primary}]}>
          If you are looking to collaborate or volunteer with the lab don’t
          hesitate to reach out! Visit our website to learn more about the work
          we are doing. Please leave a message below with your interest and we
          will get back to you shortly.
        </Text>
        <Text style={[styles.label, {color: colors.primary}]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: focusedInput === 'name' ? colors.primary : '#c4bebe'},
          ]}
          placeholder="Full Name..."
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'email' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="example@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Description</Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'response' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="Tell us why you'd like to get involved..."
          value={userResponse}
          onChangeText={setUserResponse}
          multiline
          onFocus={() => setFocusedInput('response')}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  introText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
    marginTop: 15,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 15,
    marginTop: 5,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    flex: 1,
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    height: 240,
    borderWidth: 1,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OthersForm;
