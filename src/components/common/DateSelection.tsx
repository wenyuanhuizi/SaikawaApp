import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface DateSelectionProps {
  title: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  style?: object;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  title,
  style,
  selectedDate,
  setSelectedDate,
}) => {
  const {colors} = useTheme();
  const [dateSelectorOpen, setDateSelectorOpen] = React.useState(false);

  return (
    <View style={[styles.selectionContainer, style]}>
      <Text style={[styles.text, {color: colors.primary}]}>{title}</Text>
      <TouchableOpacity
        onPress={() => setDateSelectorOpen(!dateSelectorOpen)}
        style={styles.dropdownButton}>
        <View style={styles.buttonContent}>
          <Text style={[styles.text, {color: colors.primary}]}>
            {selectedDate.toDateString()}
          </Text>
          <Icon
            name={dateSelectorOpen ? 'caret-up' : 'caret-down'}
            size={20}
            color={colors.primary}
          />
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        mode="date"
        open={dateSelectorOpen}
        date={selectedDate}
        onDateChange={date => {
          console.log(date);
        }}
        onConfirm={date => {
          setDateSelectorOpen(false);
          setSelectedDate(date);
        }}
        onCancel={() => setDateSelectorOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  dropdownButton: {
    height: 30,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DateSelection;
