/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import Card from '../Card/card';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../Button/button';
import {
  subjectListForExamEdit,
  sectionWiseForExamEdit,
} from '../../redux/actions/exam';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
const ExamListCard = ({
  item = '',
  edit = false,
  examnm = '',
  startdate = '',
  enddate = '',
  courseid = '',
  coursename = '',
  clgdepartmentid = '',
  clgdepartmentname = ' ',
  yearid = '',
  yearname = '',
  semesterid = '',
  semestername = '',
  clgsectionid = '',
  clgsectionname = '',
  examheaderid = '',
  subjectdetails = [],
  onPress,
  onEditPress,
  colgid,
  memberid,
  getData = () => {},
}) => {
  // console.log(edit, clgsectionid);
  const navigation = useNavigation();
  const deleteConfirm = () =>
    Alert.alert('Delete Exam', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteSection()},
    ]);
  const deleteSection = () => {
    // console.log('jhvajyvcu', item, typeof item, memberid);
    sectionWiseForExamEdit({
      userid: memberid,
      colgid: colgid,
      departmentid: item.clgdepartmentid,
      examid: item.examheaderid,
      processtype: 'delete',
      sectionid: item.clgsectionid,
      subjectdetails: item.subjectdetails,
    })
      .then(data => {
        // console.log(data);
        getData();
        Toast.show('Deleted successfully', Toast.LONG);
      })
      .catch(data => {
        Toast.show('Failed to Fetch', Toast.LONG);
      });
  };
  return (
    <Card style={styles.card}>
      <Text style={[styles.textBold, {color: Constants.FACULTY_HEAD_COLOR}]}>
        {clgdepartmentname}
      </Text>
      <View style={[styles.horizontalLine]} />
      <View style={{...styles.leftLine}}>
        <Text style={styles.reason}>{examnm}</Text>
      </View>
      <View style={styles.Row}>
        <Icon name="import-contacts" size={16} color={Constants.YELLOW000} />
        <View style={[styles.Row, {marginVertical: 0}]}>
          <Text style={[styles.textNormal]}>{coursename}</Text>
          <Text style={[styles.textNormal, styles.verLine]}>{yearname}</Text>
          <Text style={[styles.textNormal, styles.verLine]}>
            {semestername}
          </Text>
        </View>
      </View>
      <View style={styles.Row}>
        <Icon name="stars" size={16} color={Constants.GREEN003} />
        <Text style={[styles.textNormal]}>{clgsectionname + '  Section'} </Text>
      </View>

      <View style={styles.horizontalLine} />
      <View style={styles.actionButtonContainer}>
        <View style={{flexDirection: 'row'}}>
          <Icons name="calendar-blank" size={16} color={Constants.DARK_COLOR} />
          <Text style={[styles.textBold, styles.subText]}>
            {startdate + '  to  ' + enddate}
          </Text>
        </View>
        {!edit && (
          <Button style={styles.deleteButton} onPress={onPress}>
            <Text style={[styles.actionButtonText]}>Get Subjects</Text>
          </Button>
        )}
      </View>
      {edit && (
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            {/* <Button style={styles.deleteButton} onPress={onPress}>
              <Text style={[styles.actionButtonText]}>Get Subjects</Text>
            </Button> */}
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Button style={styles.buttonBackground} onPress={onEditPress}>
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
    </Card>
  );
};

export default ExamListCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Constants.WHITE_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  Row: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  leftLine: {
    borderLeftWidth: 3,
    borderLeftColor: Constants.FACULTY_HEAD_COLOR,
    paddingHorizontal: '3%',
  },
  verLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.BLACK000,
    paddingHorizontal: '1%',
    marginLeft: 4,
  },
  reason: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  textBold: {
    fontWeight: Constants.FONT_WEI_BOLD,
    fontSize: Constants.FONT_BADGE,
  },
  textNormal: {
    fontSize: Constants.FONT_BADGE,
    fontFamily: Constants.primaryRegular,
    color: Constants.BLACK007,
    paddingLeft: '3%',
  },
  subText: {
    color: Constants.FACULTY_HEAD_COLOR,
    fontSize: 13,
    marginLeft: 10,
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '2%',
    marginBottom: '2%',
    opacity: 0.5,
  },
  deleteButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.GREEN003,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
