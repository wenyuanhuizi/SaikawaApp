import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../utils/responsive';

interface DropdownProps {
  dropdownTitle?: string;
  dropdownOptions: string[];
  initSelected: string;
  onOptionSelection: (option: string) => void;
  style?: object;
}

const Dropdown: React.FC<DropdownProps> = ({
  dropdownTitle = 'undefined (not specified)',
  dropdownOptions,
  initSelected,
  onOptionSelection,
  style,
}) => {
  const {colors} = useTheme();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(initSelected);

  return (
    <View
      style={[
        styles.dropdownContainer,
        style,
        {backgroundColor: colors.background},
      ]}>
      {/* dropdown button */}
      <TouchableOpacity
        onPress={() => setDropdownOpen(!dropdownOpen)}
        style={styles.dropdownButton}>
        <View style={styles.buttonContent}>
          <Text style={[styles.dropdownText, {color: colors.primary}]}>
            {dropdownTitle !== 'undefined (not specified)'
              ? dropdownTitle
              : selected}
          </Text>
          <Icon
            name={dropdownOpen ? 'caret-up' : 'caret-down'}
            size={20}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      {/* dropdown menu */}
      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          {dropdownOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setDropdownOpen(!dropdownOpen);
                setSelected(option);
                onOptionSelection(option);
              }}
              style={styles.dropdownItem}>
              <Text style={[styles.dropdownText, {color: colors.primary}]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: moderateScale(150),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButton: {
    height: moderateScale(40),
    width: moderateScale(150),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dropdownMenu: {
    marginBottom: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    textAlign: 'center',
    fontSize: moderateScale(16),
  },
});

export default Dropdown;
