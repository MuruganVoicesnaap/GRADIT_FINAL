/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import {Provider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import Advertisement from '../../../components/Advertisement';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {subjectListData} from '../../../redux/actions/subjectListSection';
import {connect} from 'react-redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import SubExamCard from './ExamAccordion';
import {
  addSectionForExamEdit,
  createExamDetails,
  sectionWiseForExamEdit,
} from '../../../redux/actions/exam';
import FeedbackModal from '../../../components/Modal/Feedback';
import AppConfig from '../../../redux/app-config';
import {useNavigation} from '@react-navigation/native';
import {INIT_EXAM_CREATION_LIST} from '../../../context/types';
import {bindActionCreators} from 'redux';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const CreateExam = ({
  collegeId,
  memberid,
  priority,
  setBottomSheetData,
  subjectListSaved,
  clearExamData,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const [subjectList] = useState(route.params.filteredDataSub);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [closeGone, setCloseGone] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    if (route.params.edit) {
      route.params.subjectdetails.forEach(
        element => delete element.examsubjectname,
      );
      route.params.subjectdetails.forEach(element =>
        Object.assign(element, {clgsectionid: route.params.clgsectionid}),
      );
      clearExamData(route.params.subjectdetails);
    } else {
      clearExamData([]);
    }
  }, []);
  const goBack = () => {
    setBottomSheetData({hideSheet: true});
    navigation.goBack();
  };
  const validate = () => {
    if (subjectListSaved.length === 0) {
      Alert.alert('Enter Subject Details');
      return false;
    }
    return true;
  };
  const confirmSubmit = () => {
    Alert.alert('Hold on!', 'Are you sure you want to submit ?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          !route.params.edit && !route.params.addSection
            ? onConfirm()
            : route.params.edit && !route.params.addSection
            ? onConfirmEdit()
            : onAddSectionConfirm();
        },
      },
    ]);
    return true;
  };
  const onConfirmEdit = () => {
    console.log('onConfirmEdit');

    if (validate()) {
      subjectListSaved.forEach(element =>
        Object.assign(element, {clgsubjectid: element.examsubjectid}),
      );
      subjectListSaved.forEach(element => delete element.examsubjectid);
      setLoading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      sectionWiseForExamEdit({
        examid: route.params.examheaderid,
        colgid: collegeId,
        departmentid: route.params.clgdepartmentid,
        userid: memberid,
        sectionid: route.params.clgsectionid,
        processtype: 'edit',
        subjectdetails: subjectListSaved,
      })
        .then(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(true);
          clearExamData([]);
          setCloseGone(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({hideSheet: false});
            navigation.navigate('UpcomingExam');
          });
        })
        .catch(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          setCloseGone(true);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };
  const onConfirm = () => {
    console.log('onConfirm');
    if (validate()) {
      setLoading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      const groupedSubjectList = [];
      subjectListSaved.forEach(element => {
        if (groupedSubjectList[element.clgsectionid]) {
          groupedSubjectList[element.clgsectionid].push(element);
        } else {
          groupedSubjectList[element.clgsectionid] = [element];
        }
      });
      const sectionDetailsApiReqData = subjectList.map(item => {
        if (groupedSubjectList[item.sectionid]) {
          return {
            clgdepartmentid: route.params.deptValue,
            clgsectionid: item.sectionid,
            Subjectdetails: groupedSubjectList[item.sectionid],
          };
        } else {
          return false;
        }
      });
      // console.log(JSON.stringify(sectionDetailsApiReqData));
      createExamDetails({
        collegeid: collegeId,
        examid: '0',
        examname: route.params.examName,
        staffid: memberid,
        startdate: route.params.startDate,
        enddate: route.params.endDate,
        processtype: 'add',
        sectiondetails: sectionDetailsApiReqData.filter(Boolean),
      })
        .then(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(true);
          clearExamData([]);
          setCloseGone(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({hideSheet: false});
            navigation.navigate('UpcomingExam');
          });
        })
        .catch(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          setCloseGone(true);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };
  const onAddSectionConfirm = () => {
    console.log('onAddSectionConfirm');
    setCloseGone(true);
    if (validate()) {
      setLoading(true);
      setfeedbackModalVisible(true);
      isSaving(true);
      const groupedSubjectList = [];
      subjectListSaved.forEach(element => {
        if (groupedSubjectList[element.clgsectionid]) {
          groupedSubjectList[element.clgsectionid].push(element);
        } else {
          groupedSubjectList[element.clgsectionid] = [element];
        }
      });
      const sectionDetailsApiReqData = subjectList.map(item => {
        if (groupedSubjectList[item.sectionid]) {
          return {
            clgdepartmentid: route.params.deptValue,
            clgsectionid: item.sectionid,
            Subjectdetails: groupedSubjectList[item.sectionid],
          };
        } else {
          return false;
        }
      });
      console.log(JSON.stringify(sectionDetailsApiReqData));
      addSectionForExamEdit({
        examid: route.params.examheaderid,
        colgid: collegeId,
        userid: memberid,
        processtype: 'add',
        sectiondetails: sectionDetailsApiReqData.filter(Boolean),
      })
        .then(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(true);
          clearExamData([]);
          setCloseGone(false);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({hideSheet: false});
            navigation.navigate('UpcomingExam');
          });
        })
        .catch(result => {
          // debugger;
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          setCloseGone(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => goBack()},
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const renderItem = ({item}) => {
    return (
      <SubExamCard
        sectionData={item}
        // onPress
        differenceCheck={
          route.params?.difference !== undefined ? route.params?.difference : ''
        }
        editSubjectOnly={route.params?.editSubjectOnly ? true : false}
        editSectionid={
          route.params?.editSectionid ? route.params?.editSectionid : null
        }
        startdate={route.params.startingDate}
        enddate={route.params.endingDate}
      />
    );
  };
  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={saving}
        state={submitState}
        message={feedbackMessage}
      />
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />

        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
            style={{
              width: 30,
              height: 30,
              borderRadius: 60,
              justifyContent: 'center',
            }}
          >
            <Icons name="arrow-left" size={18} color={Constants.WHITE_COLOR} />
          </TouchableOpacity>
          <Text style={styles.pageHeaderText}>
            {route?.params?.editSubjectOnly ? 'Edit' : 'Create'} Examination
          </Text>
        </View>

        <FlatList
          data={subjectList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.viewLastCard}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        />
        <View style={styles.footer}>
          <Button
            style={[styles.actionButton, {backgroundColor: Constants.GREEN002}]}
            onPress={confirmSubmit}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
};
const mapStatetoProps = ({app}) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  subjectListSaved: app?.ExamCreateData,
});

const initExamState = data => dispatch =>
  dispatch({type: INIT_EXAM_CREATION_LIST, payload: data});

const mapDispatchToProps = dispatch => {
  return {
    clearExamData: bindActionCreators(initExamState, dispatch),
    setBottomSheetData: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(CreateExam);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  row: {
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-between',
  },
  pageHeader: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    paddingLeft: 10,
  },
  mainView: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
    // height: 400,
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.WHITE_COLOR,
  },
  actionButton: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
});
