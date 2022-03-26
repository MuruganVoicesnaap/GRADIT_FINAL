/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  VirtualizedList,
  Alert,
} from 'react-native';
import Button from '../Button/button';
import {Constants, FONT} from '../../constants/constants';
import {TextInput, List} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';

export const StudentSelect = ({
  item,
  collegeid,
  onSend,
  studentList,
  onCloseModal,
}) => {
  // console.log(studentList, 'studentList');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [orgStudents, setOrgStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, selectStudents] = useState(
    studentList === null ? [] : studentList,
  );
  useEffect(() => {
    if (search !== '') {
      const filteredList = orgStudents.filter(function (student) {
        return student.name.toLowerCase().includes(search.toLowerCase());
      });
      setStudents(filteredList);
    } else {
      setStudents(orgStudents);
    }
  }, [search]);

  useEffect(() => {
    getStudents(item, collegeid);
  }, [item, collegeid]);

  const getStudents = (item, collegeid) => {
    setLoading(true);
    const request = {
      courseid: item.courseid,
      deptid: item.departmentid,
      yearid: item.yearid,
      sectionid: item.sectionid,
      collegeid: collegeid,
    };
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_STUDENT_LIST}`,
      'POST',
      false,
      request,
      result => {
        const {Status, data} = result;

        if (Status === 1) {
          setOrgStudents(data);
          setStudents(data);
          setLoading(false);
        }
      },
      result => {
        setOrgStudents([]);
        setStudents([]);
        setLoading(false);
      },
    );
  };

  const renderItem = ({item}) => {
    return selectedStudents?.includes(item.memberid) ? (
      <List.Item
        title={item.name}
        onPress={() => {
          selectStudents(selectedStudents.filter(e => e !== item.memberid));
        }}
        right={props => (
          <List.Icon
            {...props}
            icon="check-box-outline"
            color="#fff"
            style={{
              backgroundColor: '#3F6EE8',
            }}
          />
        )}
        style={{
          backgroundColor: '#3F6EE8',
          paddingVertical: 0,
        }}
        titleStyle={{
          color: Constants.WHITE_COLOR,
        }}
      />
    ) : (
      <List.Item
        title={item.name}
        onPress={() => {
          selectStudents([...selectedStudents, item.memberid]);
        }}
        right={props => (
          <List.Icon
            {...props}
            icon="checkbox-marked"
            color="#D9D9D9"
            style={{
              paddingRight: 3,
            }}
          />
        )}
        style={{
          paddingVertical: 0,
        }}
      />
    );
  };
  const processStudentList = () => {
    var unSelectedStudents = [];
    students.forEach(student => {
      if (!selectedStudents.includes(student.memberid)) {
        unSelectedStudents.push({absentmemberid: student.memberid});
      }
    });
    var seclectedStudentsList = [];
    selectedStudents?.forEach(student => {
      seclectedStudentsList.push({presentmemberid: student});
    });

    onSend(seclectedStudentsList, unSelectedStudents, item);
  };

  // const studentSelected =() =>{
  //   if (selectedStudents.length === 0 || selectedStudents.length === undefined || selectedStudents === null ){
  //     return (Alert.alert("Please select student"));
  //   }else{
  //     processStudentList(selectedStudents, item);
  //   }
  // }
  return (
    <View
      style={{
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <View>
        <View
          style={{
            padding: 20,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: 'row',
            backgroundColor: '#056986',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.topicStyle}>{item.departmentname}</Text>
            <Text style={styles.title}>{item.coursename}</Text>
            <Text
              style={styles.subTitle}
            >{`${item.yearname} | ${item.semestername} | ${item.sectionname}`}</Text>
          </View>

          <View style={{justifyContent: 'center'}}>
            <View>
              <Button
                style={styles.sendButton}
                onPress={() => {
                  //studentSelected();
                  processStudentList(selectedStudents, item);
                }}
              >
                <Text style={styles.actionButtonText}>Send</Text>
              </Button>
              <Button
                style={[
                  styles.sendButton,
                  {backgroundColor: Constants.RED003, marginTop: 5},
                ]}
                onPress={() => {
                  onCloseModal();
                }}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {color: Constants.WHITE_COLOR},
                  ]}
                >
                  Close
                </Text>
              </Button>
            </View>
          </View>
        </View>
        <TextInput
          mode="flat"
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a student"
          right={<TextInput.Icon name={'magnify'} />}
          style={{
            backgroundColor: '#F9F9F9',
            borderBottomColor: '#9F9F9F',
            borderBottomWidth: 0.8,
            height: 50,
          }}
        />
      </View>

      <View
        style={{
          padding: 10,
          flex: 1,
        }}
      >
        {loading ? (
          <View
            style={{
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner
              color="#3b5998"
              visible={loading}
              size="large"
              textStyle={styles.spinnerTextStyle}
            />
          </View>
        ) : students?.length !== undefined ||
          students?.length !== 0 ||
          students?.length !== null ? (
          <>
            {students?.length === undefined ||
            students?.length === 0 ||
            students?.length === null ? (
              <View
                style={{
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text>No data found</Text>
              </View>
            ) : null}
            <VirtualizedList
              data={students}
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data?.length}
              renderItem={renderItem}
              contentContainerStyle={[styles.viewLastCard]}
              keyExtractor={item => item.detailsid}
            />
          </>
        ) : (
          <View style={styles.noData}>
            <Text
              style={[
                styles.title,
                {fontFamily: FONT.primaryRegular, color: Constants.DARK_COLOR},
              ]}
            >
              No data found
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const StudentList = ({visible, item, collegeid, onSelect, studentList}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView>
          <StudentSelect
            item={item}
            collegeid={collegeid}
            studentList={studentList}
            onSend={(selectStudents, item) => {
              onSelect(item, selectStudents);
            }}
          />
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default StudentList;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: '90%',
    flex: 1,
  },
  heading: {
    fontFamily: FONT.primaryBold,
    fontSize: 12,
  },

  noData: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLastCard: {
    paddingVertical: '5%',
  },
  titleContainer: {
    flex: 1,
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 11,
    color: '#FFD128',
    marginTop: 3,
    paddingBottom: 2,
  },
  title: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    color: Constants.WHITE_COLOR,
  },
  subTitle: {
    fontFamily: FONT.primaryRegular,
    marginTop: 5,
    fontSize: 11,
    color: '#A9F5FF',
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: Constants.WHITE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: '#222222',
  },
});
