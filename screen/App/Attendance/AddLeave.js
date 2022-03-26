/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import Advertisement from '../../../components/Advertisement';
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  leaveApplicationApi,
  leaveApplicatioTypenApi,
} from '../../../redux/actions/attendance';
import {connect} from 'react-redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import {TextArea} from '../../../components/TextArea/TextArea';
import DropDownPicker from 'react-native-dropdown-picker';
import {CalendarView} from '../../../components/Calendar';
import moment from 'moment';
import FeedbackModal from '../../../components/Modal/Feedback';
import {Provider} from 'react-native-paper';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const getLeavetems = data => {
  return data.map(({leavetypeid, leavetypename}) => {
    return {
      label: leavetypename,
      value: leavetypeid,
    };
  });
};

const AddLeave = ({
  navigation,
  collegeId,
  memberid,
  sectionid,
  setBottomSheetData,
  route,
}) => {
  const [description, setDescription] = useState(route?.params?.describe);
  const [loading, setLoading] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveValue, setLeaveValue] = useState(null);
  const [leaveItems, setLeaveItems] = useState([]);
  const toggleModal = () => setModalVisible(prevState => !prevState);
  const toggleModalTo = () => setModalVisibleTo(prevState => !prevState);
  const [saving, isSaving] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTo, setModalVisibleTo] = useState(false);
  const [noOfDays, setDays] = useState(route?.params?.totalDays);

  const [startDate, setStartDate] = useState(route?.params?.fromDate);
  const [endDate, setEndtDate] = useState(route?.params?.toDate);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const [startDateCheck, setStartDateCheck] = useState(
    route?.params?.fromDateDiff,
  );
  const [endtDateCheck, setEndtDateCheck] = useState(route?.params?.toDateDiff);
  useEffect(() => {
    return () => setBottomSheetData({hideSheet: false});
  }, []);
  const goBack = () => {
    navigation.goBack();
  };
  const titleMaxLength = 100;

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

  useEffect(() => {
    if (startDateCheck && endtDateCheck) {
      if (dateValidation()) {
        var date1 = new Date(startDateCheck);
        var date2 = new Date(endtDateCheck);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        // To calculate the no. of days between two dates
        const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (date1 < date2) {
          setDays((Difference_In_Days + 1).toString());
        } else if ((date1 = date2)) {
          setDays('1');
        } else {
          setDays(null);
        }
      }
    }
  }, [startDateCheck, endtDateCheck]);
  useEffect(() => {
    if (memberid) {
      getData();
    }
  }, [memberid, getData]);

  var today = new Date().toISOString().slice(0, -14);

  const fieldValidation = () => {
    if (leaveValue === null) {
      Alert.alert('Please fill the leave type');
      setLoading(false);
      return false;
    } else if (
      startDate === null ||
      startDate === undefined ||
      startDate === ''
    ) {
      Alert.alert('Please fill the start date');
      setStartDate(null);
      // Difference_In_Days=null;
      setLoading(false);
      return false;
    } else if (endDate === null || endDate === undefined || endDate === '') {
      Alert.alert('Please fill the end date');
      // Difference_In_Days = null;
      setEndtDate(null);
      setLoading(false);
      return false;
    } else if (description === null || description === undefined) {
      Alert.alert('Please fill the valid reason');
      setLoading(false);
      return false;
    }
    setLoading(true);
    return true;
  };
  const getData = useCallback(() => {
    const request = {
      appid: '2',
      userid: memberid,
    };
    leaveApplicatioTypenApi({
      request,
    }).then(({data}) => {
      setLeaveItems(getLeavetems(data));
    });
  });
  const confirmAdd = () => {
    if (fieldValidation()) {
      setfeedbackModalVisible(true);
      isSaving(true);
      leaveApplicationApi({
        colgid: collegeId,
        memberid: memberid,
        applicationid: route?.params?.id ? route?.params?.id : '0',
        leavetypeid: leaveValue,
        leavefromdate: startDate,
        leavetodate: endDate,
        numofdays: noOfDays,
        clgsectionid: sectionid,
        leavereason: description,
        processtype: route?.params?.edit ? route?.params?.edit : 'add',
      })
        .then(result => {
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            setBottomSheetData({hideSheet: false});
            navigation.goBack();
          });
        })
        .catch(result => {
          console.log(result, 'message');
          setFeedbackMessage(result.Message);
          setLoading(false);
          isSaving(false);
          setSubmitState(false);
          wait(1000).then(() => {
            setfeedbackModalVisible(false);
          });
        });
    }
  };

  const setDateFormat = date => {
    const dateStart = moment(date).format('DD/MM/YYYY');
    const dateCheck = moment(date).format('MM/DD/YYYY');
    setStartDate(dateStart);
    setStartDateCheck(dateCheck);
  };
  const setToDateFormat = date => {
    const dateStart = moment(date).format('DD/MM/YYYY');
    const dateCheck = moment(date).format('MM/DD/YYYY');
    setEndtDate(dateStart);
    setEndtDateCheck(dateCheck);
  };
  const dateValidation = () => {
    if (startDate <= endDate) {
      return true;
    } else {
      Alert.alert('Invalid dates you chosen!', '', [
        {
          text: 'Cancel',
          onPress: () => changeToInitial(),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => changeToInitial()},
      ]);
      // Alert.alert('Invalid dates you chosen!');
      // setStartDate(null);
      // setEndtDate(null);
      // setEndtDateCheck(null);
      // setStartDateCheck(null);
      // setDays(null);
      return false;
    }
  };
  const changeToInitial = () => {
    setStartDate(null);
    setEndtDate(null);
    setEndtDateCheck(null);
    setStartDateCheck(null);
    setDays(null);
  };
  const selectStartDate = () => {
    Alert.alert('Please select "From date"');
  };
  const marginDescribe = description?.length >= 100;
  const confirmSubmit = () => {
    Alert.alert('Hold on!', 'Are you sure you want to submit ?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Ok', onPress: () => confirmAdd()},
    ]);
    return true;
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

        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>Apply Leaves</Text>
          </View>
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.mainView}>
            <Text style={styles.title}>Leave Type</Text>
            <DropDownPicker
              placeholder={'Select type of leave'}
              open={leaveOpen}
              value={leaveValue}
              items={leaveItems}
              setOpen={setLeaveOpen}
              setValue={setLeaveValue}
              style={styles.dropDownStyle}
              containerStyle={styles.containerStyle}
              dropDownContainerStyle={styles.cardMargin}
              listMessageContainerStyle={styles.cardMargin}
              listMode="SCROLLVIEW"
            />
            <View style={styles.dateSelect}>
              <View style={styles.dateSelectContainer}>
                <Text style={styles.title}>From</Text>

                <TouchableOpacity
                  style={styles.dateLayout}
                  onPress={toggleModal}
                >
                  <TextInput
                    style={styles.inputDateStyle}
                    placeholder="dd/mm/yyyy"
                    value={startDate}
                    fontSize={Constants.FONT_BADGE}
                    fontFamily={FONT.primaryRegular}
                    editable={false}
                  />
                  <Icons name="calendar" />
                </TouchableOpacity>
              </View>
              <View style={styles.dateSelectContainer}>
                <Text style={styles.title}>To</Text>
                <TouchableOpacity
                  style={styles.dateLayout}
                  onPress={() => {
                    startDateCheck ? toggleModalTo() : selectStartDate();
                  }}
                >
                  <TextInput
                    style={styles.inputDateStyle}
                    placeholder="dd/mm/yyyy"
                    value={endDate}
                    fontSize={Constants.FONT_BADGE}
                    fontFamily={FONT.primaryRegular}
                    editable={false}
                  />
                  <Icons name="calendar" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.title}>No of days</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="No of days"
              value={noOfDays ? '  ' + noOfDays + '  days' : ''}
              fontSize={Constants.FONT_BADGE}
              fontFamily={FONT.primaryRegular}
              editable={false}
            />

            <Text style={styles.title}>Reason</Text>
            <TextArea
              onChangeText={setDescription}
              value={description}
              numberOfLines={1}
              count={description ? description.length : '0'}
              // style={{bottom: marginDescribe ? 0 : 30}}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <CalendarView
          visible={modalVisible}
          toggleModal={toggleModal}
          setStartDate={x => setDateFormat(x.dateString)}
          startDate={true}
          minDate={today}
        />
        <CalendarView
          visible={modalVisibleTo}
          toggleModalTo={toggleModalTo}
          setEndtDate={x => setToDateFormat(x.dateString)}
          startDate={false}
          minDate={startDateCheck}
        />
        <View style={styles.footer}>
          <Button
            onPress={() => {
              backAction();
            }}
            style={[styles.actionButton, {backgroundColor: Constants.GREY004}]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>
          <Button
            style={[styles.actionButton, {backgroundColor: Constants.GREEN002}]}
            onPress={confirmSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Uploading..' : 'Confirm'}
            </Text>
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
  sectionid: app?.maindata?.sectionid,
});

export default connect(mapStatetoProps, {
  leaveApplicationApi,
  setBottomSheetData,
})(AddLeave);

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
    flex: 1,
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.WHITE_COLOR,
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 12,
    color: Constants.DARK_COLOR,
  },
  actionButton: {
    height: 40,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  containerStyle: {
    paddingBottom: 15,
    borderWidth: 0,
  },
  cardMargin: {
    marginVertical: 15,
  },
  dropDownStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: '100%',
  },
  dateSelect: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  dateSelectContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Constants.GREY004,
    // flex: 1,
    width: '49%',
    marginRight: 5,
  },
  inputDateStyle: {
    // marginBottom: -30,
    color: Constants.DARK_COLOR,
    // marginTop: 20,
  },
  iconPlace: {
    marginBottom: 10,
    alignSelf: 'flex-end',
    paddingRight: 5,
  },
  dateLayout: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
});
