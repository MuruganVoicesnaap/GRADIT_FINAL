/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Modal, Portal } from 'react-native-paper';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  VirtualizedList,
  TouchableOpacity,
} from 'react-native';
import Button from '../Button/button';
import { Constants, FONT } from '../../constants/constants';
import RecipientViewCard from '../Card/RecipientViewCard';
import { TextInput, List, Checkbox } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';

const StudentSelect = ({ item, collegeid, onSend, studentList, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [orgStudents, setOrgStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [visibleSend, setVisibleSend] = useState(false);
  const [selectedStudents, selectStudents] = useState(
    studentList === null ? [] : studentList,
  );

  useEffect(() => {
    if (search !== '') {
      const filteredList = orgStudents.filter(function (student) {
        return student.name.toLowerCase().includes(search.toLowerCase());
      });
      setStudents(filteredList);
      // console.log(filteredList);
    } else {
      setStudents(orgStudents);
    }
  }, [search]);

  useEffect(() => {
    getStudents(item, collegeid);
  }, [item, collegeid]);

  useEffect(() => {
    if (selectedStudents.length > 0) {
      setVisibleSend(true);
}
    else {
      setVisibleSend(false);

    }

  }, [selectedStudents]);

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
        const { Status, data } = result;
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

  const renderItem = ({ item }) => {
    return selectedStudents.includes(item.memberid) ? (
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

  return (
    <View
      style={{
        flexDirection: 'column',
        height: '100%',
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

          <View style={{ justifyContent: 'center' }}>

          {visibleSend ?
            (<Button
              style={styles.sendButton}
              onPress={() => {
                onSend(selectedStudents, item);
              }}
            >
              <Text style={{ ...styles.actionButtonText }}>SEND</Text>
            </Button>):null
          }
            <Button
              style={[
                styles.sendButton,
                { backgroundColor: Constants.RED003, marginTop: 5 },
              ]}
              onPress={() => {
                onCancel();
              }}
            >
              <Text
                style={{
                  ...styles.actionButtonText,
                  color: Constants.WHITE_COLOR,
                }}
              >
                Close
              </Text>
            </Button>
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
          <Spinner color="#3b5998" visible={loading} size="large" />
        ) : students.length !== 0 ? (
          <VirtualizedList
            data={students}
            initialNumToRender={5}
            getItem={(data, index) => data[index]}
            getItemCount={data => data.length}
            renderItem={renderItem}
            contentContainerStyle={[styles.viewLastCard]}
            keyExtractor={item => item.detailsid}
          />
        ) : students.length === 0 ? (
          <View style={styles.noData}>
            <Text
              style={[
                styles.title,
                { fontFamily: FONT.primaryRegular, color: Constants.DARK_COLOR },
              ]}
            >
              No data found
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const RecipientsList = ({
  visible,
  collegeid,
  data,
  onSelect,
  currentItem,
  studentList,
  studentListVisiable,
  onClose,
}) => {
  const [showSpecific, setShowSpecific] = useState(null);
  const [IstudentList, setIShowSpecific] = useState(null);

  useEffect(() => {
    if (studentListVisiable) {
      setIShowSpecific(studentList);
      setShowSpecific(currentItem);
    }
  }, [studentListVisiable, currentItem]);

  const renderItem = ({ item }) => {
    return (
      <RecipientViewCard
        key={item.detailsid}
        item={item}
        onSelect={onSelect}
        onSpecificSelect={item => {
          setIShowSpecific(null);
          setShowSpecific(item);
        }}
      />
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onRequestClose={onClose}
        contentContainerStyle={[
          styles.modalContainerStyle,
          { padding: showSpecific !== null ? 0 : 20 },
        ]}
      >
        <SafeAreaView>
          {showSpecific !== null ? (
            <StudentSelect
              item={showSpecific}
              collegeid={collegeid}
              studentList={IstudentList}
              onCancel={() => {
                setShowSpecific(null);
                onClose();
              }}
              onSend={(selectStudents, item) => {
                setShowSpecific(null);
                onSelect(item, false, selectStudents);
              }}
            />
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.heading}>Add Recipients</Text>
                <TouchableOpacity
                  style={styles.editButtonView}
                  onPress={onClose}
                >
                  <Text style={[styles.heading, styles.editButton]}>Close</Text>
                </TouchableOpacity>
              </View>
              <VirtualizedList
                data={data}
                initialNumToRender={5}
                getItem={(data, index) => data[index]}
                getItemCount={data => data.length}
                renderItem={renderItem}
                contentContainerStyle={styles.viewLastCard}
                keyExtractor={item => item.detailsid}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default RecipientsList;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: '50%',
  },
  noData: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: FONT.primaryBold,
    fontSize: 12,
  },

  editButton: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW_MED,
    color: Constants.WHITE_COLOR,
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

  editButtonView: {
    backgroundColor: Constants.RED003,
    width: '20%',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
