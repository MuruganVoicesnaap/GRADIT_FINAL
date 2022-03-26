/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, { useState, useEffect, useFocusEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import RecipientViewCard from '../../../components/Card/RecipientViewCard';
import Advertisement from '../../../components/Advertisement';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { setBottomSheetData } from '../../../redux/actions/setBottomSheetData';
import DropDownPicker from 'react-native-dropdown-picker';
import { CalendarView } from '../../../components/Calendar';

import moment from 'moment';
import {
  getCourseList,
  // getYearList,
  getDivisionList,

  getDepartmentByDivisionList,
  getSemAndSubList,
} from '../../../redux/actions/getCourseList';
import { subjectListData } from '../../../redux/actions/subjectListSection';
import DropDown from './component/DropDown';
import { Provider } from 'react-native-paper';
import AppConfig from '../../../redux/app-config';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import { Colors } from 'react-native/Libraries/NewAppScreen';



import Spinner from "react-native-loading-spinner-overlay";
import Icon from "react-native-vector-icons/MaterialIcons";


const getCourseDepartment = (request) => {
  console.log("ExamCourseDeptRequest", request);

  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_COURSE_DEPARTMENT}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
        console.log("CourseLDeptist", data);
        console.log("CourseDeptListStatus", Status);

        if (Status === 1) {
          res(data);
        } else {
          rej(Message || "Something went wrong... Please try again later");
        }
      },
      () => {
        rej("Something went wrong... Please try again later");
      }
    );
  });
};


const getCourseItems = data => {
  return data.map(({ course_id, course_name }) => {
    return {
      label: course_name,
      value: course_id,
    };
  });
};

const getDivisionItems = data => {
  return data.map(({ division_id, division_name }) => {
    return {
      label: division_name,
      value: division_id,
    };
  });
};
const getDeptItems = data => {
  return data.map(({ department_id, department_name }) => {
    return {
      label: department_name,
      value: department_id,
    };
  });
};


const getYearItems = data => {
  return data.map(({ yearid, yearname }) => {
    return {
      label: yearname,
      value: yearid,
    };
  });
};

const getSecItems = data => {
  return data.map(({ sectionid, sectionname }) => {
    return {
      label: sectionname,
      value: sectionid,
    };
  });
};

const getSemItems = data => {
  return data.map(({ clgsemesterid, semestername }) => {
    return {
      label: semestername,
      value: clgsemesterid,
    };
  });
};
const AddExamScreen = ({
  navigation,
  collegeId,
  memberid,
  priority,
  departmentId,
  setBottomSheetData,
  getCourseList,
  getDivisionList,
  getDepartmentByDivisionList,

  courseData,
  divisionData,
  departmentData,
}) => {
  const [subjectYearData, setSubjectYearData] = useState([]);

  useEffect(() => {
    getSubjectList();
  }, []);

  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeId,
    };
    console.log('SubjectRequest', request)
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SUBJECT_LIST}`,
      "POST",
      false,
      request,
      (result) => {
        const { Status, data } = result;
        if (Status === 1) {
          setSubjectYearData(data);
        }
      },
      (result) => { }
    );
  };





  const [examName, setExamName] = useState('');
  const toggleModal = () => setModalVisible(prevState => !prevState);
  const toggleModalTo = () => setModalVisibleTo(prevState => !prevState);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTo, setModalVisibleTo] = useState(false);
  const [request, setRequest] = useState(null)

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndtDate] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [endingDate, setEndingtDate] = useState('');

  const [divisionOpen, setdivisionOpen] = useState(false);
  const [divisionValue, setdivisionValue] = useState(null);
  const [divisionItems, setdivisionItems] = useState([]);

  const [courseOpen, setCourseOpen] = useState(false);
  const [courseValue, setCourseValue] = useState(null);
  const [courseItems, setCourseItems] = useState([]);

  const [deptOpen, setDeptOpen] = useState(false);
  const [deptValue, setDeptValue] = useState(null);
  const [deptItems, setDeptItems] = useState([]);

  const [yearOpen, setYearOpen] = useState(false);
  const [yearValue, setYearValue] = useState(null);
  const [yearItems, setYearItems] = useState([]);

  const [secOpen, setSecOpen] = useState(false);
  const [secValue, setSecValue] = useState(null);
  const [secItems, setSecItems] = useState([]);

  const [semOpen, setSemOpen] = useState(false);
  const [semValue, setSemValue] = useState(null);
  const [selectedId, setSelectedID] = useState(null);
  const [semItems, setSemItems] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDept, setShowDep] = useState(false);
  const [showDivsion, setShowDivision] = useState(false);

  const [showYear, setShowYear] = useState(false);
  const [showSem, setShowSem] = useState(false);
  const [showSec, setShowSec] = useState(false);

  const [subListItems, setSubListItems] = useState([]);
  const [categoryOpen, setcategoryOpen] = useState(false);
  const [categoryValue, setcategoryValue] = useState(null);
  const [categoryItems, setcategoryItems] = useState(
    priority === "p2"
      ? [
        { catName: "My Department", catId: "Department" },
        { catName: "Classes I handle", catId: "Classes" },

      ]
      : [

      ]
  );

  const getYearList = (request) => {
    console.log("YearRequest", request);

    return new Promise((res, rej) => {
      triggerSimpleAjax(
        `${AppConfig.API_URL}${AppConfig.API.GET_YEAR_LIST}`,
        "POST",
        false,
        request,
        (res) => {
          const { Status, Message, data } = res;
          console.log("YearLDeptist", data);


          if (Status === 1) {

            setYearItems(getYearItems(data));

          } else {
            rej(Message || "Something went wrong... Please try again later");
          }
        },
        () => {
          rej("Something went wrong... Please try again later");
        }
      );
    });
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item.semesterid === semValue ? "#b7e6f7" : "#f2f4f5";
    const color = item.semesterid === semValue ? 'white' : 'black';

    return (

      <>
        <Item
          item={item}
          onPress={() => setSemValue(item.semesterid)}
          backgroundColor={{ backgroundColor }}
          textColor={{ color }}
        />

      </>
    );
  };

  const StaffrenderItem = ({ item }) => {
    const backgroundColor = item.sectionid === selectedId ? "#b7e6f7" : "#f2f4f5";
    const color = item.sectionid === selectedId ? 'white' : 'black';

    console.log('semesterId',item.semesterid)

    setSemValue(item.semesterid)

    return (

      <>
        <Item
          item={item}
          onPress={() => setSelectedID(item.sectionid)}
          backgroundColor={{ backgroundColor }}
          textColor={{ color }}
        />

      </>
    );
  };

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <View style={styles.row}>
        <Icon
          style={styles.fileIcon}
          name={"import-contacts"}
          size={30}
          color="#45a9bf"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.coursename}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.yearname} | ${item.semestername} | ${item.sectionname}`}</Text>
          {/* <Text style={styles.topicStyle}>{item.subjectname}</Text> */}
        </View>
      </View>



      <Text style={[styles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
  );


  useEffect(() => {

    // setDeptItems(getDeptItems(departmentData));
    console.log('semValue', semValue)

  }, [semValue]);

  useEffect(() => {


    getDivisionList({
      user_id: memberid,
      college_id: collegeId,
    });



    return () => {
      setBottomSheetData({ hideSheet: false });
    };
  }, []);



  useEffect(() => {

    setdivisionItems(getDivisionItems(divisionData));
  }, [divisionData]);


  useEffect(() => {

    setDeptItems(getDeptItems(departmentData));
    console.log('depUse', departmentData)

  }, [departmentData]);

  useEffect(() => {
    setCourseItems(getCourseItems(courseData));
    console.log('CourseUse', courseData)
  }, [courseData]);


  useEffect(() => {

    if (priority == 'p1') {
      if (
        divisionValue &&
        divisionItems.length !== 0
      ) {

        getDepartmentByDivisionList({
          user_id: memberid,
          college_id: collegeId,
          div_id: divisionValue,
        })
        setDeptItems(getDeptItems(courseData, courseValue, divisionData, departmentData, divisionValue));

      }
    }
  }, [divisionValue]);
  // useEffect(() => {

  //   setDeptValue(null);
  //   setYearValue(null);
  //   setSemValue(null);
  //   setSecValue(null);
  //   // setDeptItems(getDeptItems(divisionData, divisionValue, departmentData, deptValue));
  //   console.log('common', deptValue)
  // }, [courseValue, divisionValue, deptValue]);

  useEffect(() => {
    if (priority == 'p1') {


      if (deptValue) {
        getCourseList({
          user_id: memberid,
          college_id: collegeId,
          dept_id: deptValue
        });
        setCourseItems(getCourseItems(courseData));
      }
    }
  }, [divisionValue, deptValue]);
  useEffect(() => {
    if (divisionValue && deptValue && courseValue) {
      setYearValue(null);
      setSemValue(null);
      setSecValue(null);
      console.log('testYear', divisionValue)
      console.log('testYear123', deptValue)
      console.log('testYear12', courseValue)

      getFullData();
    }
  }, [divisionValue, deptValue, courseValue]);

  const titleMaxLength = 100;

  const getFullData = () => {

    console.log('useCallback', courseValue)

    if (priority == 'p1') {

      getYearList({
        idcollege: collegeId,
        idcourse: courseValue,
        iddept: deptValue,
        clgprocessby: memberid,
      })
    } else if (priority == 'p2') {
      getYearList({
        idcollege: collegeId,
        idcourse: courseValue,
        iddept: departmentId,
        clgprocessby: memberid,
      })

    }

  }



  useEffect(() => {
    if (priority == 'p2') {
      if (courseValue) {
        getFullData()
      }
    }
  }, [courseValue]);

  useEffect(() => {
    if (yearValue) {
      setSemValue(null);
      setSecValue(null);
      getSecAndSemData();
    }
  }, [yearValue]);

  const getSecAndSemData = useCallback(() => {
    const request = { yearid: yearValue };
    getSemAndSubList({
      request,
    }).then(({ data }) => {
      setSemItems(getSemItems(data));
    });
  });

  useEffect(() => {
    if (semValue) {
      setSecValue(null);
      getSubjectListData();
    }
  }, [semValue]);
  const getSubjectListData = useCallback(() => {
    const request = {
      userid: memberid,
      appid: '1',
      semesterid: semValue,
    };

    console.log('SubjectReq',request)
    subjectListData({
      request,
    }).then(({ data }) => {
      setSubListItems(data);
      setSecItems(getSecItems(data));
    });
  });
  useEffect(() => {
    if (priority === 'p2') {
      console.log("prioritytest", priority);
      getCourseDepartment({
        user_id: memberid,
        college_id: collegeId,
        dept_id: departmentId,
      })
        .then((respose) => {
          const { Status, data } = respose;

          if (Status === 1) {
            setCourseItems(getCourseItems(data));

          }
        })

        .catch(() => {

        });
    }
  }, [priority]);
  const setDateFormat = date => {
    const dateStart = moment(date).format('DD/MM/YYYY');
    setStartDate(dateStart);
    setStartingDate(date);
    console.log(date, dateStart);
  };
  const setToDateFormat = date => {
    const dateStart = moment(date).format('DD/MM/YYYY');
    setEndtDate(dateStart);
    setEndingtDate(date);
  };
  const goBack = () => {
    navigation.goBack();
  };

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => goBack() },
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {

    console.log('categoryValue', categoryValue)
  }, [categoryValue]);

  const validate = () => {
    const date1 = moment(startDate, 'DD/MM/YYYY');
    const date2 = moment(endDate, 'DD/MM/YYYY');

    if (priority == 'p1') {
      if (startDate === '') {
        Alert.alert('Select startDate');
        return false;
      } else if (examName === '') {
        Alert.alert('Enter Exam name');
        return false;
      } else if (endDate === '') {
        Alert.alert('Select End Date');
        return false;
      } else if (date1 > date2) {
        Alert.alert('From date must greater than To date');
        return false;

      }
      else if (divisionValue === '' || divisionValue === null) {
        Alert.alert('Select Division');
        return false;
      }

      else if (courseValue === '' || courseValue === null) {
        Alert.alert('Select Course');
        return false;
      } else if (deptValue === '' || deptValue === null) {
        Alert.alert('Select Department');
        return false;
      } else if (yearValue === '' || yearValue === null) {
        Alert.alert('Select year');
        return false;
      } else if (semValue === '' || semValue === null) {
        Alert.alert('Select semester');
        return false;

      }
    } else if (priority == 'p2') {
      console.log('test', priority)

      if (categoryValue === "Department") {


        if (startDate === '') {
          Alert.alert('Select startDate');
          return false;
        } else if (examName === '') {
          Alert.alert('Enter Exam name');
          return false;
        } else if (endDate === '') {
          Alert.alert('Select End Date');
          return false;
        } else if (date1 > date2) {
          Alert.alert('From date must greater than To date');
          return false;

        }
        else if (courseValue === '' || courseValue === null) {
          Alert.alert('Select Course');
          return false;
        } else if (yearValue === '' || yearValue === null) {
          Alert.alert('Select year');
          return false;
        } else if (semValue === '' || semValue === null) {
          Alert.alert('Select semester');
          return false;

        }

      } else if (categoryValue === "Classes") {
        if (startDate === '') {
          Alert.alert('Select startDate');
          return false;
        } else if (examName === '') {
          Alert.alert('Enter Exam name');
          return false;
        } else if (endDate === '') {
          Alert.alert('Select End Date');
          return false;
        } else if (date1 > date2) {
          Alert.alert('From date must greater than To date');
          return false;

        }
        else if (semValue === '' || semValue === null) {
          Alert.alert('Select Any One Class');
          return false;
        }

      }
    }

    else if (priority == 'p3') {
      if (startDate === '') {
        Alert.alert('Select startDate');
        return false;
      } else if (examName === '') {
        Alert.alert('Enter Exam name');
        return false;
      } else if (endDate === '') {
        Alert.alert('Select End Date');
        return false;
      } else if (date1 > date2) {
        Alert.alert('From date must greater than To date');
        return false;

      }
      else if (semValue === '' || semValue === null) {
        Alert.alert('Select Any One Class');
        return false;
      }
    }




    return true;
  };

  var today = new Date().toISOString().slice(0, -14);

  const checkAllData = () => {
    if (validate()) {
      navigation.navigate('CreateExam', {
        semValue,
        divisionValue,
        courseValue,
        deptValue,
        yearValue,
        secValue,
        examName,
        startDate,
        endDate,
        startingDate,
        endingDate,
        filteredDataSub: subListItems,
      });
    }
  };
  return (
    <Provider>
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
          <Text style={styles.pageHeaderText}>Create Examination</Text>
        </View>
        <ScrollView 
        contentContainerStyle={styles.mainView}>
          <View style={{ marginHorizontal: '6%' }}>
            <Text style={styles.title}>Exam Name</Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter the exam name"
              onChangeText={setExamName}
              value={examName}
              maxLength={titleMaxLength}
              fontSize={Constants.FONT_BADGE}
              fontFamily={FONT.primaryRegular}
            />
            <View style={styles.dateSelect}>
              <View style={styles.dateSelectContainer}>
                <Text style={styles.title}>From</Text>

                <TouchableOpacity onPress={toggleModal}>
                  <TextInput
                    style={styles.inputDateStyle}
                    placeholder="dd/mm/yyyy"
                    value={startDate}
                    fontSize={Constants.FONT_BADGE}
                    fontFamily={FONT.primaryRegular}
                    editable={false}
                  />
                  <Icons name="calendar" style={styles.iconPlace} />
                </TouchableOpacity>
              </View>
              <View style={styles.dateSelectContainer}>
                <Text style={styles.title}>To</Text>
                <TouchableOpacity onPress={toggleModalTo}>
                  <TextInput
                    style={styles.inputDateStyle}
                    placeholder="dd/mm/yyyy"
                    value={endDate}
                    fontSize={Constants.FONT_BADGE}
                    fontFamily={FONT.primaryRegular}
                    editable={false}
                  />
                  <Icons name="calendar" style={styles.iconPlace} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 
          <View
            style={{
              marginTop: 10,
              height: 1000, paddingHorizontal: 20,

            }}

          > */}

          {
            priority === 'p1' ? (
              <>
                <View
                style ={{marginHorizontal:15,marginVertical:5}}
                >
                  <DropDown
                    label={'Select Division'}
                    mode={'flat'}
                    value={divisionValue}
                    setValue={setdivisionValue}
                    list={divisionItems}
                    visible={showDivsion}
                    showDropDown={() => setShowDivision(true)}
                    onDismiss={() => setShowDivision(false)}
                    iconName="menu-down"
                  />
                </View>


                <View style={{ height: 60 }}>

                  {divisionValue && !divisionOpen ? (
                    <DropDown
                      label={'Select Department'}
                      mode={'flat'}
                      value={deptValue}
                      setValue={setDeptValue}
                      list={deptItems}
                      visible={showDept}
                      showDropDown={() => setShowDep(true)}
                      onDismiss={() => setShowDep(false)}
                      iconName="menu-down"
                    />

                  ) : null}
                </View>

                {deptValue && !deptOpen ? (
                  <DropDown
                    label={'Select Course'}
                    mode={'flat'}
                    value={courseValue}
                    setValue={setCourseValue}
                    list={courseItems}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    iconName="menu-down"
                  />
                ) : null}

                <View style={[styles.row, { marginTop: -10 }]}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    {!divisionOpen && !courseOpen && !deptOpen && (
                      <DropDown
                        label={'Select Year'}
                        mode={'flat'}
                        value={yearValue}
                        setValue={setYearValue}
                        list={yearItems}
                        visible={showYear}
                        showDropDown={() => setShowYear(true)}
                        onDismiss={() => setShowYear(false)}
                        iconName="menu-down"
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    {!courseOpen && !deptOpen && (
                      <DropDown
                        label={'Select Semester'}
                        mode={'flat'}
                        value={semValue}
                        setValue={setSemValue}
                        list={semItems}
                        visible={showSem}
                        showDropDown={() => setShowSem(true)}
                        onDismiss={() => setShowSem(false)}
                        iconName="menu-down"
                      />
                    )}
                  </View>

                </View>

              </>

            ) : priority === 'p2' ? (
              <>

                <View style={{ flex: 1, marginHorizontal: 15, marginVertical: 1 }}>
                  <DropDownPicker
                    placeholder={'-- Select Department --'}

                    open={categoryOpen}
                    value={categoryValue}
                    items={categoryItems?.map((item) => ({
                      label: item.catName,
                      value: item.catId,
                    }))}

                    showTickIcon={false}
                    setOpen={(x) => {
                      setcategoryOpen(x);

                    }}
                    setValue={(x) => {
                      setcategoryValue(x);
                    }}
                    setItems={(x) => {
                      setcategoryItems(x);
                    }}
                    containerProps={{
                      height: categoryOpen ? 150 : undefined,
                    }}

                    containerStyle={{ margin: 1 }}
                    dropDownContainerStyle={{ margin: 1 }}
                    listMessageContainerStyle={{ margin: 15, marginBottom: 0 }}
                    listMode="SCROLLVIEW"
                    ListEmptyComponent={({ }) => (
                      <Text style={{ alignSelf: 'center' }}>No Data found</Text>
                    )}
                  />

                  {
                    categoryValue && categoryValue === "Department" ? (
                      <>
                        <View
                          style={{ height: 100 }
                          }>
                          <DropDown
                            label={'Select Course'}
                            mode={'flat'}
                            value={courseValue}
                            setValue={setCourseValue}
                            list={courseItems}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            iconName="menu-down"
                          />


                        </View>

                        <View style={[styles.row, { marginTop: -10 }]}>
                          <View style={{ flex: 1, paddingRight: 10 }}>
                            {!divisionOpen && !courseOpen && !deptOpen && (
                              <DropDown
                                label={'Select Year'}
                                mode={'flat'}
                                value={yearValue}
                                setValue={setYearValue}
                                list={yearItems}
                                visible={showYear}
                                showDropDown={() => setShowYear(true)}
                                onDismiss={() => setShowYear(false)}
                                iconName="menu-down"
                              />
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            {!courseOpen && !deptOpen && (
                              <DropDown
                                label={'Select Semester'}
                                mode={'flat'}
                                value={semValue}
                                setValue={setSemValue}
                                list={semItems}
                                visible={showSem}
                                showDropDown={() => setShowSem(true)}
                                onDismiss={() => setShowSem(false)}
                                iconName="menu-down"
                              />
                            )}
                          </View>

                        </View>

                      </>

                    ) : categoryValue && categoryValue === "Classes" ? (

                      <View style={{ flex: 1, marginTop: 15 }}>

                        <SafeAreaView >

                          <FlatList
                            data={subjectYearData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.semesterid}
                            extraData={semValue}
                          />

                        </SafeAreaView>
                      </View>

                    ) : null
                  }

                </View>
              </>

            ) : priority === 'p3' ? (
              <SafeAreaView styles={{
                height: 500, width: 200,
                flex: 1, alignItems: 'center'
              }}>
                <FlatList
                  data={subjectYearData}
                  renderItem={StaffrenderItem}
                  keyExtractor={(item) => item.sectionid}
                  extraData={selectedId}
                />
              </SafeAreaView>

            ) : null}



        </ScrollView>
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
          minDate={startingDate}
        />
        <View style={styles.footer}>
          <Button
            style={[styles.actionButton, { backgroundColor: Constants.GREEN002 }]}
            onPress={() => checkAllData()}
          >
            <Text style={styles.buttonText}>Get Section / Subject</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Provider >
  );
};
const mapStatetoProps = ({ app }) => {
  const { courseData = [] } = app;
  const { divisionData = [] } = app;
  const { departmentData = [] } = app;

  return {
    collegeId: app?.maindata?.colgid,
    priority: app?.maindata?.priority,
    memberid: app?.maindata?.memberid,
    departmentId: app?.maindata?.deptid,
    courseData,
    divisionData,
    departmentData,
  };
};


export default connect(mapStatetoProps, { getCourseList, getDivisionList, getDepartmentByDivisionList, setBottomSheetData })(
  AddExamScreen,
);
const styles = StyleSheet.create({

  specificButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 8,

    borderWidth: 1,

    marginVertical: 18,
    marginHorizontal: 2,
    borderColor: Constants.MILD_BLACK_COLOR,
    color: Constants.MILD_BLACK_COLOR,
    width: "95%",
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
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
    marginTop: 5,
  },
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 12,
    color: 'black',
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
  dropDownStyle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    width: '100%',
  },
  containerStyle: {
    padding: 15,
    borderWidth: 0,
  },
  cardMargin: {
    margin: 15,
  },
  dateSelect: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateSelectContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flex: 1,
    marginRight: 5,
  },
  inputDateStyle: {
    marginBottom: -30,
    paddingVertical:10,
    marginTop:10,
    color: Constants.DARK_COLOR,
  },
  iconPlace: {
    marginBottom: 10,
    alignSelf: 'flex-end',
    paddingRight: 5,
  },
  pickerStyle: {
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomColor: Constants.BLACK000,
    borderBottomWidth: 1,
  },

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: undefined,
    marginVertical: 10,
    marginHorizontal: 1,
    borderRadius: 2,
    flex: 1,
  },
  fileIcon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 2,
    alignSelf: "flex-start",
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    color: Constants.DARK_COLOR,
    marginTop: 3,
    paddingBottom: 2,
  },
  submitted: {
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
    color: "#229557",
    marginBottom: 5,
    alignSelf: "flex-end",
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 14,
    color: Constants.DARK_COLOR,
  },
  subTitle: {
    marginTop: 5,
    fontSize: 15,
    color: Constants.STAFF_HEADER,
  },
  specificButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1B82E1",
    color: "#1B82E1",
    width: "90%",
  },
  entireButton: {
    backgroundColor: "#229557",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: "90%",
  },
  actionButtonText: {
    fontSize: 10,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  horizontalLine: {
    borderTopWidth: 0.5,
    borderColor: Constants.GREY091,
    marginTop: 12,
  },
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: 10,
    color: Constants.DARK_COLOR,
  },
});

