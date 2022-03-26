/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Constants, FONT} from '../constants/constants';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
export const CalendarView = ({
  visible,
  toggleModal = () => null,
  toggleModalTo = () => null,
  setStartDate,
  setEndtDate,
  startDate = '',
  minDate = '',
  maxDate = '',
  markedDates = {},
}) => {
  const lowDate = moment(minDate).format('YYYY-MM-DD');
  const maximumDate = moment(maxDate).format('YYYY-MM-DD');
  // console.log(minDate, maxDate, lowDate, maximumDate);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => {
              startDate ? toggleModal() : toggleModalTo();
            }}
            style={styles.close}
          >
            <Icons name="close-circle" size={22} color={'red'} />
          </TouchableOpacity>
          <Text style={styles.title}>Select date</Text>
          <Calendar
            // Initially visible month. Default = Date()
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={minDate ? lowDate : '2020-12-30'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={maxDate ? maximumDate : '2040-12-30'}
            onDayPress={day => {
              startDate ? setStartDate(day) : setEndtDate(day);
              startDate
                ? (toggleModal(), setStartDate(day))
                : (toggleModalTo(), setEndtDate(day));
            }}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={true}
            style={{width: 300}}
            markingType={'multi-dot'}
            markedDates={markedDates || {}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },

  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    height: '60%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },
  close: {
    // alignSelf: 'flex-end',
    padding: 5,
    left: '40%',
    top: -7,
  },
});
