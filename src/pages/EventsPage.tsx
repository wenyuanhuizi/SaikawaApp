import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {useTheme} from '@react-navigation/native';
import moment from 'moment-timezone';
import EventCalendar, {AgendaItem} from '../components/calendar/EventCalendar';

interface MarkedDate {
  marked: boolean;
  dotColor: string;
}

interface MarkedDates {
  [date: string]: MarkedDate;
}

const EventsPage: React.FC = () => {
  const {colors} = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [showAllEvents, setShowAllEvents] = React.useState<boolean>(true);
  const toggleShowAll = () => setShowAllEvents(!showAllEvents);

  useEffect(() => {
    console.log('Component mounted. Starting to fetch items...');
    loadItems();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, items, showAllEvents, selectedDate]);

  useEffect(() => {
    const filtered = items.filter(item => item.title === selectedDate);
    setFilteredItems(filtered.length > 0 ? filtered : []);
  }, [selectedDate]);

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    setShowAllEvents(false);
  };

  const loadItems = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to fetch events...');
      const response = await axios.get(
        'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/calendar/events',
      );
      // console.log('Events fetched successfully:', response.data);

      // format the  events data
      // make sure times are shown in the user's local time zone
      const events = response.data.map((event: any, index: number) => {
        // Assuming the server returns the date-time in New York time zone ('America/New_York')
        const startTime = moment.tz(event.start.dateTime, 'America/New_York');
        const endTime = moment.tz(event.end.dateTime, 'America/New_York');

        // Convert these times to the user's local time zone
        const localStartTime = startTime.clone().tz(moment.tz.guess());
        const localEndTime = endTime.clone().tz(moment.tz.guess());

        return {
          title: localStartTime.format('YYYY-MM-DD'), // YYYY-MM-DD
          data: [
            {
              id: index,
              name: event.summary,
              time: `${localStartTime.format('h:mm A')} - ${localEndTime.format('h:mm A')}`,
              location: event.location || '(No location specified)',
              description: event.description || '(No description added)',
              isExpanded: false,
            },
          ],
        };
      });

      // Set marked dates for calendar
      const newMarkedDates = events.reduce(
        (acc: MarkedDates, curr: AgendaItem) => {
          acc[curr.title] = {marked: true, dotColor: colors.primary};
          return acc;
        },
        {} as MarkedDates,
      );

      setItems(events);
      setFilteredItems(events);
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    const trimmedText = searchQuery.trim().toLowerCase();
    let filteredData = items;

    if (trimmedText.length > 0) {
      filteredData = items
        .map(agenda => ({
          ...agenda,
          data: agenda.data.filter(item => {
            const nameMatches = item.name.toLowerCase().includes(trimmedText);
            const descriptionMatches =
              item.description !== 'No description' &&
              item.description?.toLowerCase().includes(trimmedText);
            const locationMatches =
              item.location !== 'No location provided' &&
              item.location?.toLowerCase().includes(trimmedText);
            return nameMatches || descriptionMatches || locationMatches;
          }),
        }))
        .filter(agenda => agenda.data.length > 0);
    }

    if (!showAllEvents) {
      filteredData = filteredData.filter(item => item.title === selectedDate);
    }

    setFilteredItems(filteredData);
  };

  return (
    // <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TextInput
            style={[styles.searchInput, {backgroundColor: colors.card}]}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <EventCalendar
          filteredItems={filteredItems}
          onDateChange={onDateChange}
          isLoading={isLoading}
          showAllEvents={showAllEvents}
          toggleShowAllEvents={toggleShowAll}
          markedDates={markedDates}
        />
      </SafeAreaView>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  section: {
    backgroundColor: '#f0f4f7',
  },
});

export default EventsPage;
