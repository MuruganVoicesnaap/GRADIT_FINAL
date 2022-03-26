import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  Constants,
  FONT,
  UPCOMING_EXAM_CARD_COLORS,
} from '../../constants/constants';
import {Pill} from '../Pill/Pill';
import {DateTime} from '../DateTime/DateTime';

export const UpcomingExamCard = ({
  cardColor = UPCOMING_EXAM_CARD_COLORS[0],
  title = 'First Revision Test',
  course = 'Data Structures With C/C++ Laboratory',
  date = '23rd April, 2021',
  time = '7.00pm',
  block = 'MCA Block - 234',
}) => {
  return (
    <View
      style={[
        styles.container,
        cardColor ? {backgroundColor: cardColor.bgColor} : null,
      ]}>
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            cardColor ? {color: cardColor.titleColor} : null,
          ]}>
          {title}
        </Text>
      </View>
      <Text style={styles.course} numberOfLines={2}>
        {course}
      </Text>
      <DateTime date={date} time={time} textStyle={styles.dateTime} />
      <Pill
        text={block}
        containerStyle={styles.block}
        textStyle={styles.blockText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 159,
    height: 168,
    padding: 16,
    borderRadius: 6,
    marginEnd: 12,
  },
  titleContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Constants.BLACK000,
    paddingBottom: 4,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT.primaryMedium,
  },
  course: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
    fontFamily: FONT.primaryBold,
  },
  dateTime: {
    marginTop: 8,
    marginBottom: 0,
  },
  block: {
    backgroundColor: Constants.WHITE_COLOR,
    marginTop: 12,
  },
  blockText: {
    fontSize: 11,
    lineHeight: 13,
    color: Constants.BLUE000,
    fontFamily: FONT.primaryMedium,
  },
});
