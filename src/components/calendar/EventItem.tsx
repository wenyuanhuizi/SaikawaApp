// EventItem.tsx
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CustomAgendaEntry} from './EventCalendar';
import React from 'react';

interface EventItemProps {
  item: CustomAgendaEntry & {date: string};
  initIsExpanded?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({
  item,
  initIsExpanded = false,
}) => {
  const {colors} = useTheme();

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <TouchableOpacity
      style={[styles.itemCard, {backgroundColor: colors.card}]}
      onPress={() => setIsExpanded(!isExpanded)}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemDate, {color: colors.primary}]}>
          {item.date}
        </Text>
        <Text style={[styles.itemTitle, {color: colors.primary}]}>
          {item.name}
        </Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.itemTime, {color: colors.text}]}>{item.time}</Text>
      {isExpanded && (
        <>
          <View style={styles.locationContainer}>
            <Icon name="location" size={20} color={colors.primary} />
            <Text style={[styles.itemLocation, {color: colors.text}]}>
              {item.location}
            </Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionLabel, {color: colors.primary}]}>
              Details:
            </Text>
            <Text style={[styles.itemDescription, {color: colors.text}]}>
              {item.description}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    padding: 20,
    marginBottom: 25,
    elevation: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 5, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  itemTime: {
    fontSize: 13,
    paddingBottom: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 30,
  },
  itemLocation: {
    fontSize: 14,
    marginTop: 5,
  },
  itemDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  descriptionContainer: {
    marginTop: 5,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EventItem;
