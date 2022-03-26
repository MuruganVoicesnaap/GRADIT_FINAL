/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, Alert} from 'react-native';
import Card from './card';
import Button from '../Button/button';
import {Constants, FONT} from '../../constants/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {Provider} from 'react-native-paper';
import {StudentSelect} from '../Modal/StudentList';
import {
  markAttendanceApi,
  checkAttendanceApi,
  editAttendanceApi,
} from '../../redux/actions/attendance';

import moment from 'moment';

const AttendanceCard = ({
  collegeid = '',
  courseid = '',
  coursename = '',
  departmentid = '',
  departmentname = '',
  yearid = '',
  yearname = '',
  sectionid = '',
  sectionname = '',
  semesterid = '',
  semestername = '',
  subjectid = '',
  subjectname = '',
  selectedDate = '',
  memberid = '',
  onPress = onPress,
  bottomSheetAction,
  totalCard,
  item,
  index,
  backendResponce = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [checkEdit, setCheckEdit] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const markAttendance = (
    selectStudents,
    unSelectedStudents,
    subjectItem,
    checkEdit,
  ) => {
    console.log(checkEdit, 'ubiusabifugbaukcbakubvduabuldyu');
    markAttendanceApi({
      sectionid: subjectItem.sectionid,
      subjectid: subjectItem.subjectid,
      userid: memberid,
      date: moment(selectedDate).format('DD/MM/YYYY'),
      processtype: !checkEdit ? 'add' : 'edit',
      presentlist: selectStudents,
      absentlist: unSelectedStudents,
    })
      .then(result => {
        console.log(result, 'attendance');
        backendResponce(result.Message);
        setCheckEdit(false);
        setStudentList([]);
      })
      .catch(result => {
        console.log(result, 'attendance');
        backendResponce(result.Message);
        setCheckEdit(false);
        setStudentList([]);
      });
  };
  const checkAttendanceTaken = () => {
    checkAttendanceApi({
      sectionid: sectionid,
      subjectid: subjectid,
      date: moment(selectedDate).format('DD/MM/YYYY'),
    })
      .then(data => {
        console.log(data.Message);
        if (data.Status === 0) {
          console.log('nott taken');
          setCheckEdit(false);
          setModalVisible(true);
        }
        if (data.Status === 1) {
          Alert.alert('Attendance Already Marked !!', 'Do you want to edit?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                editAttendance();
              },
            },
          ]);
        }
      })
      .catch(data => {
        // console.log(data);
      });
  };

  const editAttendance = () => {
    editAttendanceApi({
      sectionid: sectionid,
      subjectid: subjectid,
      userid: memberid,
      appid: '',
      date: moment(selectedDate).format('DD/MM/YYYY'),
    })
      .then(data => {
        let list = data?.data;
        setCheckEdit(true);
        if (list?.length) {
          list.forEach(element => {
            if (element.attendancetype === 'Present') {
              setStudentList(prevstate => [...prevstate, element.memberid]);
            }
          });
          // for (let j = 0; j < list.length; j++) {
          //   console.log('dddd', list[j]);

          //   if (list[j].attendancetype === 'Present') {
          //     console.log('check', list[j]);
          //     setStudentList(prevstate => [...prevstate, list[j].memberid]);
          //   }
          // }
          setModalVisible(true);
        }
      })
      .catch(data => {
        // console.log(data);
      });
  };
  console.log(studentList, 'element of students');
  const confirmAttendanceTaken = (
    selectStudents,
    unSelectedStudents,
    subjectItem,
  ) => {
    Alert.alert(
      'Total absent students : ' + unSelectedStudents.length,
      'Click ok to confirm',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            markAttendance(
              selectStudents,
              unSelectedStudents,
              subjectItem,
              checkEdit,
            );
            setModalVisible(!modalVisible);
          },
        },
      ],
    );
  };
  return (
    <View style={[styles.cardHeight]}>
      <Provider>
        <Card style={styles.card}>
          <Text
            style={[styles.textBold, {color: Constants.FACULTY_HEAD_COLOR}]}
          >
            {coursename}
          </Text>
          <View style={[styles.horizontalLine]} />
          
          <View style={styles.Row}>
            <Icon name="stars" size={16} color={Constants.GREEN003} />
            <Text style={[styles.textNormal]}>{sectionname}</Text>
          </View>
          <View style={styles.Row}>
            <Icon
              name="import-contacts"
              size={16}
              color={Constants.YELLOW000}
            />
            <View style={[styles.Row, {marginVertical: 0}]}>
              <Text style={[styles.textNormal]}>{yearname}</Text>
              <Text style={[styles.textNormal, styles.verLine]}>
                {semestername}
              </Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />
          <View style={styles.actionButtonContainer}>
            <Text style={[styles.textBold, styles.subText]}>{subjectname}</Text>
            <Button
              style={styles.attendanceButton}
              onPress={() => {
                checkAttendanceTaken();
              }}
            >
              <Text style={[styles.actionButtonText]}>Take Attendance</Text>
            </Button>
          </View>

          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={[styles.modalView, {padding: 5}]}>
                <StudentSelect
                  item={item}
                  collegeid={collegeid}
                  studentList={studentList}
                  onCloseModal={() => {
                    setModalVisible(!modalVisible);
                  }}
                  onSend={(selectStudents, unSelectedStudents, subjectItem) => {
                    // console.log(selectStudents, unSelectedStudents, subjectItem);
                    confirmAttendanceTaken(
                      selectStudents,
                      unSelectedStudents,
                      subjectItem,
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        </Card>
      </Provider>
    </View>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(AttendanceCard);

const styles = StyleSheet.create({
  cardHeight: {
    height: 220,
    paddingBottom: 10,
    
  },
  card: {
    backgroundColor: Constants.WHITE_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: 170,
    marginVertical: '2%',
    borderRadius: 5,
    // paddingBottom: 5
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Row: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  leftLine: {
    borderLeftWidth: 3,
    borderLeftColor: Constants.FACULTY_HEAD_COLOR,
    paddingHorizontal: '3%',
  },
  verLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.BLACK000,
    paddingHorizontal: '3%',
    marginLeft: 5,
  },
  reason: {
    fontSize: Constants.FONT_FULL_LOW,
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
    fontSize: Constants.FONT_ELEVEN,
    marginTop:10,
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '2%',
    marginBottom: '2%',
    opacity: 0.5,
  },
  attendanceButton: {
    marginTop:13,

    flexDirection: 'row',
    backgroundColor: Constants.GREEN003,
    width: 140,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    bottom: 5,
  },
  actionButtonText: {
    fontSize: Constants.FONT_THIRTEEN,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    height: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
