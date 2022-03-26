import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Constants, FONT, ICON} from '../../constants/constants';
import {Pill} from '../Pill/Pill';
//import { DashboardDummyData } from '../.././screen/DashboardHome/index';
const DashboardAttendanceComponent = ({
  attendancetype = '',
  subjectname = '',
  attendancedate = '',
}) => {
  return (
    <View style={styles.item}>
    
      <Pill
        text={attendancedate}
        icon={ICON.CALENDAR}
        iconSize={16}
        containerStyle={styles.containerStyle}
        textStyle={styles.textStyle}
      />
      <View style={styles.AttendaceSubView}>
        <View
          style={[
            styles.AbsentView,
            {
              backgroundColor:
                attendancetype === 'Present'
                  ? Constants.GREEN003
                  : Constants.RED003,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {attendancetype === 'Present' ? 'P' : 'Ab'}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={[styles.buttonNormalText, {marginLeft: 5}]}
        >
          {subjectname}
        </Text>
      </View>
    </View>
  );
};

export default DashboardAttendanceComponent;

const styles = StyleSheet.create({
  item: {
    backgroundColor: Constants.WHITE_COLOR,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Constants.BLACK003,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  containerStyle: {
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    width: 94,
    marginLeft: 10,
    marginTop: 5,
  },
  textStyle: {
    color: Constants.WHITE_COLOR,
  },
  AttendaceSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '2%',
  },
  AbsentView: {
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },

  buttonText: {
    fontSize: Constants.FONT_LOW,
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_MED,
    fontFamily: FONT.primaryMedium,
  },

  buttonNormalText: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_MED,
    color: Constants.DARK_COLOR,
    fontFamily: FONT.primaryMedium,
    maxWidth: '90%',
  },
});
