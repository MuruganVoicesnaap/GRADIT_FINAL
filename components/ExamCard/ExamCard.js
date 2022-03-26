/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Card from '../Card/card';
import {Constants, FONT} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/core';
import {Pill} from '../Pill/Pill';
import Button from '../Button/button';
import {createExamDetails} from '../../redux/actions/exam';
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {CommonDateTime} from '../DateTime/CommonDateTime';
const ExamCard = ({
  item = '',
  date = '',
  examname = '',
  examvenue = '',
  headerid = '',
  session = '',
  subjectname = '',
  syllabus = '',
  createdon = '',
  createdbyname = '',
  startdate = '',
  enddate = '',
  memberid = '',
  priority = '',
  onPress = onPress,
  getData = () => {},
  setBottomSheetData,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const navigation = useNavigation();
  const checkExams = () => {
    if (priority === 'p4' || priority === 'p5') {
      setExpandedView(!expandedView);
    } else {
      navigation.navigate('ExamListScreen', {
        examId: headerid,
        edit: false,
      });

      setBottomSheetData({hideSheet: true});
    }
  };
  const deleteConfirm = () =>
    Alert.alert('Delete Exam', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteExam()},
    ]);
  const deleteExam = () => {
    createExamDetails({
      collegeid: '',
      examid: headerid,
      examname: examname,
      staffid: memberid,
      startdate: '',
      enddate: '',
      processtype: 'delete',
      sectiondetails: [],
    })
      .then(data => {
        getData();
        Toast.show('Deleted successfully', Toast.LONG);
      })
      .catch(data => {
        Toast.show('Failed to Fetch', Toast.LONG);
      });
    console.log(headerid);
  };

  const getTimeSeperate = dateString => {
    return dateString.slice(-8);
  };
  const getDateSeperate = dateString => {
    return dateString.slice(0, 11);
  };
  return (
    <Card
      style={{
        ...styles.card,
        backgroundColor: expandedView
          ? Constants.BUTTON_SELECTED_COLOR
          : Constants.WHITE_COLOR,
      }}
      onPress={() => checkExams()}
    >
      {priority !== 'p4' && priority !== 'p5' && (
        <Pill text={createdbyname} containerStyle={styles.pillContainerStyle} />
      )}
      <View
        style={{
          ...styles.row,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            ...styles.textnormal,
            // color: expandedView
            //   ? Constants.CARD_SELECTED_TITLE_COLOR
            //   : Constants.BUTTON_SELECTED_COLOR,
            borderBottomWidth: 0.5,
            borderColor: Constants.TEXT_INPUT_COLOR,
            fontWeight: Constants.FONT_WEI_MED,
            maxWidth: '50%',
          }}
        >
          {examname}
        </Text>

        <View
          style={[
            {
              alignItems: 'flex-end',
              textAlign: 'right',
              bottom: priority !== 'p4' && priority !== 'p5' ? '9%' : null,
            },
          ]}
        >
          <CommonDateTime
            date={date ? date : getDateSeperate(createdon)}
            time={date ? null : getTimeSeperate(createdon)}
          />

          {priority === 'p4' || priority === 'p5' ? (
            <>
              <View
                style={{
                  ...styles.verticalLine,
                  borderLeftColor: expandedView
                    ? Constants.WHITE_COLOR
                    : Constants.DARK_COLOR,
                }}
              />
              <Text
                style={{
                  fontSize: Constants.FONT_FULL_LOW,
                  color: expandedView
                    ? Constants.WHITE_COLOR
                    : Constants.DARK_COLOR,
                }}
              >
                {session}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View
        style={{
          ...styles.verticalLineCard,
          borderLeftColor: expandedView
            ? Constants.CARD_SELECTED_TITLE_COLOR
            : Constants.BUTTON_SELECTED_COLOR,
          marginVertical: '3%',
        }}
      >
        <Text
          style={{
            fontWeight: Constants.FONT_WEI_BOLD,
            marginLeft: 5,
            color: expandedView ? Constants.WHITE_COLOR : Constants.DARK_COLOR,
          }}
        >
          {subjectname ? subjectname : startdate + '  to  ' + enddate}
        </Text>
      </View>
      {Number(item?.createdby) === memberid && (
        <View style={[styles.row]}>
          <View style={styles.flexFull} />
          <View style={[styles.flexFull, styles.row]}>
            <Button
              style={styles.buttonBackground}
              onPress={() => {
                navigation.navigate('ExamListScreen', {
                  examId: headerid,
                  edit: true,
                  createdbyId: item?.createdby,
                });

                setBottomSheetData({hideSheet: true});
              }}
            >
              <Icon
                name="edit"
                size={16}
                color={Constants.BUTTON_SELECTED_COLOR}
              />
              <Text style={styles.ButtonText}>Edit</Text>
            </Button>
            <Button
              style={[
                styles.buttonBackground,
                {borderColor: Constants.BUTTON_RED_COLOR},
              ]}
              onPress={() => {
                deleteConfirm();
              }}
            >
              <Icon
                name="delete"
                size={16}
                color={Constants.BUTTON_RED_COLOR}
              />
              <Text
                style={[styles.ButtonText, {color: Constants.BUTTON_RED_COLOR}]}
              >
                Delete
              </Text>
            </Button>
          </View>
        </View>
      )}
      {priority === 'p4' || priority === 'p5' ? (
        <View>
          <Text
            style={{
              fontSize: Constants.FONT_FULL_LOW,
              color: Constants.BUTTON_SELECTED_COLOR,
              fontWeight: Constants.FONT_WEI_MED,
              backgroundColor: Constants.BACKGROUND_MILD_BLUE,
              paddingHorizontal: '3%',
              paddingVertical: '1%',
              borderRadius: 20,
            }}
          >
            {examvenue}
          </Text>
        </View>
      ) : null}

      {expandedView ? (
        <>
          <View
            style={{...styles.horizontalLine, borderBottomColor: '#000000'}}
          />

          <Text
            style={{
              fontSize: Constants.FONT_FULL_LOW,
              color: Constants.WHITE_COLOR,
              fontWeight: Constants.FONT_WEI_MED,
            }}
          >
            Syllabus Details:
          </Text>
          <Text
            style={{
              ...styles.textnormal,
              fontSize: Constants.FONT_FULL_LOW,
              color: Constants.WHITE_COLOR,
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
const mapDispatchToProps = dispatch => {
  return {
    setBottomSheetData: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(ExamCard);

const styles = StyleSheet.create({
  textHead: {
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },

  pillContainerStyle: {
    backgroundColor: Constants.BLUE001,
    alignSelf: 'flex-start',
    height: 20,
    marginBottom: 8,
  },
  textnormal: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
  },
  flexFull: {flex: 1},
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
  buttonBackground: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    width: '50%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  // buttonBackgroundFull: {
  //   marginHorizontal: 3,
  //   flexDirection: 'row',
  //   backgroundColor: Constants.BUTTON_RED_COLOR,
  //   width: '50%',
  //   height: 32,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // ButtonTextWhite: {
  //   paddingLeft: 5,
  //   color: Constants.WHITE_COLOR,
  // },
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
});
