import React, {useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

function AppFeedbackPage() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bugReport, setBugReport] = useState('');
  const [experience, setExperience] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  interface BugReportData {
    name: string;
    email: string;
    bugReport: string;
    experience: string;
  }

  const handleSubmit = async () => {
    try {
      const payload: BugReportData = {
        name,
        email,
        bugReport,
        experience,
      };

      const response = await fetch(
        'https://saikawalab-427516.uc.r.appspot.com/api/v1/bug-form',
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
        Alert.alert('Success', 'Your bug has been reported!');
        setName('');
        setEmail('');
        setBugReport('');
        setExperience('');
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
      <View style={[styles.header, {borderBottomColor: '#ddd'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.primary}]}>
          App Feedback
        </Text>
      </View>

      <ScrollView>
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

        <Text style={[styles.label, {color: colors.primary}]}>
          Report a Bug
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'bugReport' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="freeze, crash, etc..."
          value={bugReport}
          onChangeText={setBugReport}
          multiline
          onFocus={() => setFocusedInput('bugReport')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>
          Share Your Experience
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'experience' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="What would make your experience better, please share your thoughts or pronblems..."
          value={experience}
          onChangeText={setExperience}
          multiline
          onFocus={() => setFocusedInput('experience')}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 15,
    marginTop: 20,
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
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    height: 150,
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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
export default AppFeedbackPage;
