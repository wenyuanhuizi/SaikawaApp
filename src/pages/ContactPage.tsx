import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TopBar from '../components/common/TopBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MAX_CONTENT_WIDTH, moderateScale} from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../NavigationManager'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

// Define the type for the navigation prop
type ContactPageNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ContactPage = () => {
    const navigation = useNavigation<ContactPageNavigationProp>(); 
    
    const handleGetInvolvedPress = () => {
      navigation.navigate('GetInvolvedFormPage');  
    };

    const handleAppFeedbackPress = () => {  
      navigation.navigate('AppFeedbackPage');  
    }

    const handleEnvReportPress = () => {  
      navigation.navigate('EnvReportPage');  
    }

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* Add the TopBar component */}
      <TopBar />
      <ScrollView style={styles.cardContainer}>
        <TouchableOpacity 
        style={[styles.card, styles.cardInvolved]}
        onPress={handleGetInvolvedPress}
        >
          <View style={styles.iconContainer}>
            <Icon name="people-outline" size={40} color="#000" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Get Involved</Text>
            <Text style={styles.description}>
              Show us your interest! lab projects, volunteering, and
              collaborations..
            </Text>
          </View>
          <Icon name="chevron-forward-outline" size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardReports]}
          onPress={handleEnvReportPress}
        >
          <View style={styles.iconContainer}>
            <Icon name="newspaper-outline" size={40} color="#000" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Environmental Reports</Text>
            <Text style={styles.description}>
              Noticed something off? Tell us about the environmental issues
              you're seeing or need help with..
            </Text>
          </View>
          <Icon name="chevron-forward-outline" size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardFeedback]}
            onPress={handleAppFeedbackPress}
         >
          <View style={styles.iconContainer}>
            <Icon name="bug-outline" size={40} color="#000" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>App Feedback</Text>
            <Text style={styles.description}>
              Help us make this app even better! Feedback on user experience,
              report bugs...
            </Text>
          </View>
          <Icon name="chevron-forward-outline" size={30} color="#000" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: 0, 
  },
  cardContainer: {
    flex: 1,
    padding: moderateScale(30),
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(20),
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardInvolved: {
    backgroundColor: '#f0f9da',
  },
  cardReports: {
    backgroundColor: '#e5f6f1',
  },
  cardFeedback: {
    backgroundColor: '#e0e0e0',
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  description: {
    fontSize: moderateScale(14),
    color: '#555',
  },
});

export default ContactPage;
