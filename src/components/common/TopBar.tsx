import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {moderateScale} from '../../utils/responsive';

const TopBar: React.FC = () => {
  const {colors} = useTheme();
  const handleWebsiteRedirect = () => {
    Linking.openURL('https://www.saikawalab.com/');
  };

  return (
    <View style={styles.topBar}>
      {/* Lab Logo */}
      <Image
        source={require('../../assets/images/labLogoWithoutText.png')}
        style={styles.logo}
      />
      {/* Title: SaikawaLab */}
      <Text style={[styles.title, {color: colors.primary}]}>Saikawa Lab</Text>
      {/* Globe Icon with link to web */}
      <TouchableOpacity onPress={handleWebsiteRedirect}>
        <Icon name="globe-outline" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  title: {
    fontSize: moderateScale(23),
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export default TopBar;
