/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Card from '../../../../components/Card/card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT} from '../../../../constants/constants';
import {TextArea} from '../../../../components/TextArea/TextArea';
import {CalendarView} from '../../../../components/Calendar';
import moment from 'moment';
import {connect} from 'react-redux';
import {
  EXAM_CREATION_LIST,
  REMOVE_EXAM_CREATION_LIST,
} from '../../../../context/types';
import DropDown from '../component/DropDown';
import Toast from 'react-native-simple-toast';
import capitializeFirstChar from '../../../DashboardHome/util/capitializeFirstChar';
const SubCard = ({
  subjectListSaved,
  removeExamData,
  sectionData,
  item,
  saveExamData,
  startingdate = '',
  endingdate = '',
}) => {
  const [expandable, setExpandable] = useState(false);
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const toggleModal = () => setModalVisible(prevState => !prevState);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [semOpen, setSemOpen] = useState(false);
  const [semValue, setSemValue] = useState(null);
  const [semItems, setSemItems] = useState([]);
  const [saveGone, setSaveGone] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const isSaved = useMemo(
    () =>
      subjectListSaved.find(
        a =>
          a.clgsectionid === sectionData.sectionid &&
          a.examsubjectid === item.subjectid,
      ),
    [item.subjectid, sectionData.sectionid, subjectListSaved],
  );

  useEffect(() => {
    // console.log(subjectListSaved);
    const index = subjectListSaved.findIndex(
      x =>
        x.clgsectionid === sectionData.sectionid &&
        x.examsubjectid === item.subjectid,
    );
    if (isSaved) {
      setVenue(subjectListSaved[index].examvenue);
      setDescription(subjectListSaved[index].examsyllabus);
      setStartDate(subjectListSaved[index].examdate);
      setSemValue(subjectListSaved[index].examsession);
    } else if (!isSaved) {
      setVenue('');
      setDescription('');
      setStartDate('');
      setSemValue('');
    }
  }, [subjectListSaved, isSaved, sectionData.sectionid, item.subjectid]);

  useEffect(() => {
    // console.log(subjectListSaved);
    const sameDateExamSaved = subjectListSaved.find(
      x => x.examdate === startDate && x.examsubjectid !== item.subjectid,
    );

    if (sameDateExamSaved) {
      if (sameDateExamSaved.examsession === 'fn') {
        setSemItems([
          {
            label: 'AN',
            value: 'an',
          },
        ]);
      } else {
        setSemItems([
          {
            label: 'FN',
            value: 'fn',
          },
        ]);
      }
    } else {
      setSemItems([
        {
          label: 'FN',
          value: 'fn',
        },
        {
          label: 'AN',
          value: 'an',
        },
      ]);
    }
  }, [item.subjectid, startDate, subjectListSaved]);

  useEffect(() => {
    const groupedSubjectList = [];
    subjectListSaved.forEach(element => {
      if (groupedSubjectList[element.clgsectionid]) {
        groupedSubjectList[element.clgsectionid].push(element);
      } else {
        groupedSubjectList[element.clgsectionid] = [element];
      }
    });

    const currentSection = groupedSubjectList[sectionData.sectionid];

    if (currentSection) {
      const dates = [];
      currentSection.forEach(element => {
        if (dates[element.examdate]) {
          dates[element.examdate].push(element);
        } else {
          dates[element.examdate] = [element];
        }
      });

      const tmpMarkedDates = [];
      const optMarkedDates = [];
      Object.keys(dates).forEach(date => {
        if (dates[date].length > 1) {
          tmpMarkedDates.push(date);
        } else {
          optMarkedDates.push(date);
        }
      });

      const finalMarkedDates = {};
      tmpMarkedDates.forEach(a => {
        finalMarkedDates[moment(a, 'DD/MM/YYYY').format('YYYY-MM-DD')] = {
          dots: [
            {key: `selected-${a}-0`, color: Constants.GREY003},
            {key: `selected-${a}-1`, color: Constants.GREY003},
          ],
          selected: true,
          selectedColor: Constants.VIOLET000,
          disabled: true,
          disableTouchEvent: true,
        };
      });

      const preSelectedMarkedDates = {};
      optMarkedDates.forEach(a => {
        preSelectedMarkedDates[moment(a, 'DD/MM/YYYY').format('YYYY-MM-DD')] = {
          dots: [{key: `selected-${a}`, color: Constants.GREEN001}],
          // selectedColor: Constants.VIOLET000,
          // selected: true,
        };
      });

      setMarkedDates({...finalMarkedDates, ...preSelectedMarkedDates});
    }
  }, [item.subjectid, sectionData.sectionid, startDate, subjectListSaved]);

  useEffect(() => {
    setSemItems([
      {
        label: 'FN',
        value: 'fn',
      },
      {
        label: 'AN',
        value: 'an',
      },
    ]);
  }, []);

  const setDateFormat = date => {
    const dateStart = moment(date).format('DD/MM/YYYY');
    setStartDate(dateStart);
    setSemValue('');
  };

  const validate = () => {
    if (startDate === '') {
      Alert.alert('Select Exam Date');
      return false;
    } else if (venue === '') {
      Alert.alert('Enter Exam name');
      return false;
    } else if (description === '') {
      Alert.alert('Enter syllabus');
      return false;
    } else if (semValue === '' || semValue === null) {
      Alert.alert('Select session');
      return false;
    }
    return true;
  };
  const alertRemoveSubDetails = () => {
    const subjectname = capitializeFirstChar(item?.subjectname);
    Alert.alert(`${subjectname} Already Marked !!`, 'Do you want to delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          removeSubDetails();
        },
      },
    ]);
  };
  const removeSubDetails = () => {
    removeExamData({
      clgsectionid: sectionData.sectionid,
      examsubjectid: item.subjectid,
    });
    setExpandable(!expandable);
  };

  const saveSubDetails = () => {
    if (validate()) {
      setSaveGone(false);
      saveExamData({
        clgsectionid: sectionData.sectionid,
        examsubjectid: item.subjectid,
        examdate: startDate,
        examsyllabus: description,
        examvenue: venue,
        examsession: semValue,
      });
      Toast.show(item.subjectname + ' added succesful', Toast.LONG);
      setExpandable(!expandable);
      // Alert.alert(item.subjectname + ' added succesful', '', [
      //   {
      //     text: '',
      //     onPress: () => console.log('Cancel Pressed'),
      //   },
      //   {text: 'OK', onPress: () => setExpandable(!expandable)},
      // ]);
    }
  };

  const marginDescribe = description?.length >= 100;
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.header}
          onPress={() => {
            setExpandable(!expandable);
            setSaveGone(true);
          }}
        >
          <View style={[styles.header, styles.leftView]}>
            <Icons
              name="check-circle"
              size={16}
              style={{
                color:
                  expandable || isSaved
                    ? Constants.GREEN002
                    : Constants.BLACK000,
              }}
            />
            <Text style={styles.textHeader}>
              {capitializeFirstChar(item?.subjectname)}
            </Text>
          </View>

          <View style={{flex: 1}}>
            <Icon
              name={!expandable ? 'arrow-drop-down' : 'arrow-drop-up'}
              size={25}
              style={styles.iconRight}
            />
          </View>
        </TouchableOpacity>

        {expandable ? (
          <View style={styles.innerView}>
            <TextInput
              style={styles.inputStyle}
              value={venue}
              onChangeText={setVenue}
              placeholder="Venue"
              fontSize={Constants.FONT_BADGE}
              fontFamily={FONT.primaryRegular}
            />

            <View style={styles.describeStyle}>
              <ScrollView>
                <TextArea
                  onChangeText={setDescription}
                  numberOfLines={4}
                  placeholder="Syllabus"
                  count={description?.length}
                  value={description}
                  style={{bottom: marginDescribe ? 0 : 30}}
                />
              </ScrollView>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 5,
              }}
            >
              <TouchableOpacity onPress={toggleModal} style={styles.left}>
                <TextInput
                  style={styles.inputDateStyle}
                  placeholder="Exam Date"
                  value={startDate}
                  fontSize={Constants.FONT_BADGE}
                  fontFamily={FONT.primaryRegular}
                  editable={false}
                />
                <Icons name="calendar" style={styles.iconPlace} />
              </TouchableOpacity>
              {modalVisible ? null : (
                <View
                  style={{
                    width: '40%',
                    marginTop: -20,
                  }}
                >
                  <DropDown
                    label="Session"
                    mode="flat"
                    value={semValue}
                    setValue={setSemValue}
                    list={semItems}
                    visible={semOpen}
                    showDropDown={() => setSemOpen(true)}
                    onDismiss={() => setSemOpen(false)}
                  />
                  {/* <DropDownPicker
                    placeholder={'Session'}
                    open={semOpen}
                    value={semValue}
                    items={semItems}
                    setOpen={setSemOpen}
                    setValue={setSemValue}
                    style={styles.dropDownStyle}
                    containerStyle={styles.containerStyle}
                    dropDownContainerStyle={styles.cardMargin}
                    listMessageContainerStyle={styles.cardMargin}
                    listMode="SCROLLVIEW"
                  /> */}
                </View>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              {isSaved ? (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    alertRemoveSubDetails();
                  }}
                >
                  <Text style={{color: Constants.RED003}}>Delete</Text>
                </TouchableOpacity>
              ) : null}
              {saveGone ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    saveSubDetails();
                  }}
                >
                  <Text style={{color: Constants.WHITE_COLOR}}>Save</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}
        <CalendarView
          visible={modalVisible}
          toggleModal={toggleModal}
          setStartDate={x => setDateFormat(x.dateString)}
          startDate={true}
          minDate={startingdate}
          maxDate={endingdate}
          markedDates={markedDates}
        />
      </Card>
    </View>
  );
};

const mapStatetoProps = ({app}) => ({
  subjectListSaved: app.ExamCreateData,
});

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    saveExamData: data => dispatch({type: EXAM_CREATION_LIST, payload: data}),
    removeExamData: data =>
      dispatch({type: REMOVE_EXAM_CREATION_LIST, payload: data}),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(SubCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 0,
    marginHorizontal: 0,
    backgroundColor: Constants.WHITE_COLOR,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  reasonStyle: {
    top: -30,
  },
  leftView: {flex: 2, marginLeft: 5},
  textHeader: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_THIRTEEN,
    marginLeft: 10,
  },
  iconRight: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  innerView: {
    backgroundColor: Constants.BRIGHT_COLOR,
    margin: 10,
    shadowColor: Constants.BLACK003,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  inputStyle: {
    height: 40,
    borderWidth: 0.5,
    borderColor: Constants.GREY004,
    borderRadius: 5,
    margin: 12,
  },
  describeStyle: {
    borderWidth: 0.5,
    borderColor: Constants.GREY004,
    borderRadius: 5,
    margin: 12,
    height: 100,
  },
  iconPlace: {
    marginTop: -22,
    alignSelf: 'flex-end',
    paddingRight: 5,
    paddingBottom: 10,
  },
  left: {
    flex: 1,
    borderWidth: 0.5,
    margin: 12,
    borderColor: Constants.GREY004,
    borderRadius: 5,
    height: 36,
    alignItems: 'center',
  },
  dropDownStyle: {
    height: 36,

    borderColor: Constants.GREY004,
  },
  containerStyle: {
    padding: 15,
    borderWidth: 0,
    borderColor: Constants.GREY004,
  },
  cardMargin: {
    margin: 15,
  },
  addButton: {
    height: 34,
    width: 91,
    alignSelf: 'flex-start',
    backgroundColor: Constants.GREEN002,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  removeButton: {
    height: 34,
    width: 91,
    alignSelf: 'flex-start',
    borderColor: Constants.RED003,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.WHITE_COLOR,
  },
  inputDateStyle: {
    marginBottom: -5,
    marginLeft: 5,
    alignSelf: 'flex-start',
    fontFamily: FONT.primaryMedium,
    color: Constants.DARK_COLOR,
  },
});
