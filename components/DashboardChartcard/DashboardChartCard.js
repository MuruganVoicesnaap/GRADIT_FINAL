import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from '../Card/card';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';
//import { DashboardDummyData } from '../.././screen/DashboardHome/index';
import {useNavigation} from '@react-navigation/core';
import AppConfig from '../../redux/app-config';
const DashboardChartComponent = ({
  descripton = '',
  title = '',
  date = '',
  time = '',
}) => {
  const navigation = useNavigation();
  return (
    <Card
      style={styles.card}
      onPress={() => {
        // console.log('kjbkbvdksbvlb');
        navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
      }}
    >
      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <Pill text={descripton} containerStyle={styles.attachmentStyle} />
          <View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <DateTime
            date={date + '    '}
            time={time}
            containerStyle={styles.dateAndTime}
            textStyle={styles.text}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
            }}
          >
            <View style={styles.roundBG}>
              <Icons
                name="chevron-right"
                size={20}
                color={Constants.WHITE_COLOR}
                alignSelf="center"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default DashboardChartComponent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 16,
    height: undefined,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    flex: 1,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.GREY091,
    marginTop: 12,
  },
  halfWidth: {
    width: '50%',
  },
  roundBG: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.SKY_BLUE_COLOR,
    width: 20,
    borderRadius: 40,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    bottom: 30,
  },
  dateAndTime: {
    flexDirection: 'row',
    top: 15,
    left: 3,
    justifyContent: 'flex-start',
  },
  text: {
    paddingVertical: 2,
    fontSize: 13,
  },

  titleContainer: {
    flex: 4,
    alignSelf: 'flex-start',
  },
  titleLine: {
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
    top: 5,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 13,
    color: Constants.DARK_COLOR,
    marginStart: 3,
    marginTop: 10,
  },
  attachmentStyle: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: Constants.GREY079,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
