/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Card from '../Card/card';
import {Constants, FONT} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';

const PastExamCard = ({
  headerid = '',
  createdby = '',
  date = '',
  examname = '',
  examvenue = '',
  session = '',
  subjectname = '',
  syllabus = '',
  enddate = '',
  startdate = '',
  createdon = '',
  createdbyname = '',
  priority = '',
  onPress,
}) => {
  const navigation = useNavigation();
  const checkExams = () => {
    if (priority !== 'p4' && priority !== 'p5') {
      navigation.navigate('ExamListScreen', {
        examId: headerid,
        edit: false,
      });
    }
  };
  return (
    <Card
      style={{...styles.card, backgroundColor: Constants.WHITE_COLOR}}
      onPress={() => checkExams()}
    >
      {priority !== 'p4' && priority !== 'p5' && (
        <Pill text={createdbyname} containerStyle={styles.pillContainerStyle} />
      )}
      <View style={[styles.row, styles.margin]}>
        <View style={styles.titleContainer}>
          <View style={styles.titleLine}>
            <Text style={styles.title}>{examname}</Text>
          </View>
        </View>
        {priority !== 'p4' && priority !== 'p5' && (
          <DateTime date={createdon} />
        )}
      </View>

      <View
        style={{
          ...styles.row,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={[styles.row, {alignItems: 'center', marginTop: 4}]}>
          <Icons name="calendar-blank" size={16} color={Constants.DARK_COLOR} />
          <Text
            style={{
              fontWeight: Constants.FONT_WEI_BOLD,
              marginLeft: 5,
              color: Constants.DARK_COLOR,
            }}
          >
            {enddate ? startdate + '  to  ' + enddate : date}
          </Text>
        </View>
        {priority === 'p4' || priority === 'p5' ? (
          <TouchableOpacity
            style={{
              padding: '2%',
              backgroundColor: 'green',
              borderRadius: 25,
              paddingHorizontal: '3%',
            }}
            onPress={onPress}
          >
            <Text
              style={{
                ...styles.textnormal,
                fontWeight: Constants.FONT_WEI_MED,
                color: Constants.WHITE_COLOR,
              }}
            >
              View Marks
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Card>
  );
};

export default PastExamCard;

const styles = StyleSheet.create({
  textHead: {
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
  },
  margin: {
    marginVertical: 5,
  },
  pillContainerStyle: {
    backgroundColor: Constants.BLUE001,
    alignSelf: 'flex-start',
    height: 20,
    marginBottom: 8,
  },
  buttonSelected: {
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    padding: '2%',
  },
  buttonText: {
    fontSize: Constants.FONT_LOW,
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_MED,
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextBadge: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
  },
  button: {
    backgroundColor: Constants.BUTTON_NORMAL_COLOR,
    padding: '2%',
  },
  buttonNormalText: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_MED,
    color: Constants.DARK_COLOR,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  titleContainer: {
    flex: 2,
    alignSelf: 'flex-start',
  },
  titleLine: {
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 13,
    color: Constants.DARK_COLOR,
    marginStart: 8,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.TEXT_INPUT_COLOR,
    marginLeft: '4%',
    marginRight: '4%',
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '4%',
    marginBottom: '2%',
  },
});
