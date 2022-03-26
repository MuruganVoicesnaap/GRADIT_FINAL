/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Card from '../Card/card';
import {Constants, FONT} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Pill} from '../Pill/Pill';

const ExamSubCard = ({
  date = '',
  examname = '',
  examvenue = '',
  headerid = '',
  examsubjectid = '',
  session = '',
  subjectname = '',
  syllabus = '',
}) => {
  const [expandedView, setExpandedView] = useState(false);

  return (
    <Card
      style={{
        ...styles.card,
      }}
      onPress={() => setExpandedView(!expandedView)}
    >
      <View
        style={{
          ...styles.row,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            ...styles.textnormal,
            color: Constants.BLACK003,
            borderBottomWidth: 0.5,
            borderColor: Constants.TEXT_INPUT_COLOR,
            fontWeight: Constants.FONT_WEI_MED,
            width: '50%',
          }}
        >
          {examname}
        </Text>
        <View style={{...styles.row, alignSelf: 'center'}}>
          <Icons name="calendar-blank" size={15} color={Constants.BLACK003} />
          <Text
            style={{
              fontSize: Constants.FONT_BADGE,
              marginLeft: 3,
              color: Constants.BLACK003,
            }}
          >
            {date}
          </Text>
          <>
            <View
              style={{
                ...styles.verticalLine,
              }}
            />
            <Text
              style={{
                fontSize: Constants.FONT_BADGE,
                color: Constants.BLACK003,
              }}
            >
              {session.toUpperCase()}
            </Text>
          </>
        </View>
      </View>

      <View
        style={{
          ...styles.verticalLineCard,
          marginVertical: '3%',
        }}
      >
        <Text
          style={{
            ...styles.textnormal,
            fontWeight: Constants.FONT_WEI_BOLD,
            marginLeft: 5,
            color: Constants.BLACK003,
          }}
        >
          {subjectname}
        </Text>
      </View>
      <View>
        <Pill
          text={examvenue}
          containerStyle={styles.attachmentStyle}
          textStyle={[styles.textPill]}
        />
      </View>

      {expandedView ? (
        <>
          <View
            style={{...styles.horizontalLine, borderBottomColor: '#000000'}}
          />

          <Text
            style={{
              fontSize: Constants.FONT_FULL_LOW,
              color: Constants.BLACK003,
              fontWeight: Constants.FONT_WEI_MED,
            }}
          >
            Syllabus Details:
          </Text>
          <Text
            style={{
              ...styles.textnormal,
              fontSize: Constants.FONT_FULL_LOW,
              color: Constants.BLACK002,
              marginVertical: '2%',
            }}
          >
            {syllabus}
          </Text>
        </>
      ) : null}
    </Card>
  );
};

export default ExamSubCard;

const styles = StyleSheet.create({
  textHead: {
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  textnormal: {
    fontFamily: FONT.primaryMedium,
  },
  attachmentStyle: {
    backgroundColor: 'transparent',
    minHeight: 24,
    height: 'auto',
    // width: 'auto',
    paddingVertical: 2,
    justifyContent: 'flex-start',
  },
  textPill: {

    backgroundColor: Constants.BACKGROUND_MILD_BLUE,
    fontFamily: FONT.primaryBold,
    textAlign: 'left',
    padding: 5,
    borderRadius: 5,
    fontSize: Constants.FONT_BADGE,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  pillContainerStyle: {
    backgroundColor: Constants.BLUE001,
    height: 20,
    marginBottom: 8,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
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
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.TEXT_INPUT_COLOR,
    marginLeft: '4%',
    marginRight: '4%',
  },
  verticalLineCard: {
    borderLeftWidth: 2,
    borderColor: Constants.BLACK007,
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '4%',
    marginBottom: '2%',
  },
  postedName: {
    color: Constants.BLACK000,
    fontSize: 10,
    lineHeight: 12,
    fontFamily: FONT.primaryRegular,
  },
  footer: {
    paddingTop: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  extraAttachmentStyle: {
    backgroundColor: '#E8E8E8',
    marginLeft: 5,
    fontSize: Constants.FONT_FULL_LOW,
  },
});
