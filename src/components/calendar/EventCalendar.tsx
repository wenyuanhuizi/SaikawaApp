// EventCalendar.tsx
import React, { useState, useRef, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import EventItem from './EventItem';
import { useTheme } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export interface CustomAgendaEntry {
  id: number;
  name: string;
  time: string;
  location: string; // zoom link or physical address
  description: string;
}

export interface AgendaItem {
  title: string; // date in YYYY-MM-DD
  data: CustomAgendaEntry[];
}

interface EventCalendarProps {
  filteredItems: AgendaItem[];
  onDateChange: (date: string) => void;
  isLoading: boolean;
  showAllEvents: boolean;
  toggleShowAllEvents: () => void;
  markedDates: any;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  filteredItems,
  onDateChange,
  isLoading,
  showAllEvents,
  toggleShowAllEvents,
  markedDates,
}) => {
  const { colors } = useTheme();
  const swiper = useRef<Swiper | null>(null);
  const [week, setWeek] = useState(0);
  const [value, setValue] = useState(new Date()); // track selected date

  const weeks = useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');
    return [-1, 0, 1].map(adj => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');
        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const renderItem = ({ item }: { item: CustomAgendaEntry & { date: string } }) => (
    <EventItem item={item} />
  );

  const currentMonth = moment(value).format('MMMM YYYY');

  const goToToday = () => {
    const today = new Date();
    setValue(today);
    onDateChange(moment(today).format('YYYY-MM-DD'));
    setWeek(0);
    if (swiper.current) {
      swiper.current.scrollTo(1, false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.monthText, { color: colors.primary }]}>{currentMonth}</Text>
      <View style={styles.picker}>
        <Swiper
          index={1} // current week
          ref={swiper}
          loop={false}
          showsPagination={false}
          onIndexChanged={ind => {
            if (ind === 1) { 
              return;
            }
            setTimeout(() => {
              const newIndex = ind - 1;
              const newWeek = week + newIndex;
              setWeek(newWeek);
              setValue(moment(value).add(newIndex, 'week').toDate());
              onDateChange(moment(value).add(newIndex, 'week').format('YYYY-MM-DD'));
              if (swiper.current) {
                swiper.current.scrollTo(1, false);
              }
            }, 100);
          }}>
          {weeks.map((dates, index) => (
            <View style={styles.itemRow} key={index}>
              {dates.map((item, dateIndex) => {
                const dateString = moment(item.date).format('YYYY-MM-DD');  // Convert the date to string
                const isActive = value.toDateString() === item.date.toDateString();
                const isMarked = markedDates[dateString];  // Check if the date is in markedDates

                return (
                  <TouchableWithoutFeedback
                    key={dateIndex}
                    onPress={() => {
                      setValue(item.date);
                      onDateChange(moment(item.date).format('YYYY-MM-DD'));
                    }}>
                    <View
                      style={[
                        styles.item,
                        isMarked && { borderColor: isMarked.dotColor },  
                        isActive && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.itemWeekday,
                          { color: isActive ? colors.card : colors.text },
                        ]}>
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.itemDate,
                          { color: isActive ? colors.card : colors.text },
                        ]}>
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ))}
        </Swiper>
      </View>

    <View style={styles.listContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={toggleShowAllEvents}>
        <Icon
          name={showAllEvents ? 'navigate-circle-outline' : 'eye'}
          size={30}
          color={colors.primary}
        />
        <Text style={[styles.iconButtonText, { color: colors.primary }]}>
          {showAllEvents ? 'Show Only for Selected Date' : 'Show All Events'}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems.flatMap(section =>
            section.data.map(item => ({ ...item, date: section.title })),
          )}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          extraData={filteredItems}
        />
      ) : (
        <View style={styles.noEventsView}>
          <Text style={[styles.noEventsText, { color: colors.primary }]}>
            No events found...
          </Text>
          <Icon name="sad-outline" size={40} color={colors.primary} />
          <Text style={[styles.recommendedKeywordsText, { color: colors.text }]}>
            Recommended keywords:{'\n'}
            1. soil shop{'\n'}
            2. climate talk
          </Text>
        </View>
      )}
      </View>

      <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
        <Icon name="today" size={20} color={colors.primary} />
        <Text style={[styles.todayButtonText, { color: colors.primary }]}>Today</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { // calendar containder 
    flex: 1,
    paddingVertical: 3,
  },
  listContainer: { // event list container 
    flex: 1, 
    zIndex: 0, 
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
    marginTop: 5,
  },
  iconButtonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  noEventsView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noEventsText: {
    fontSize: 20,
    lineHeight: 50,
    textAlign: 'center',
    fontWeight: '500',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  recommendedKeywordsText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 10,
  },
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  todayButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    padding: 10,
    borderRadius: 35,
    backgroundColor: '#d5d6d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default EventCalendar;
