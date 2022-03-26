/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import RenderListItem from 'react-native-dropdown-picker/src/components/RenderListItem';
import {Modal, Portal} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Constants, FONT} from '../../constants/constants';
import Button from '../Button/button';

import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../../redux/app-config';

const getCourseList = request => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.COURSE_DEPT_LIST}`,
      'POST',
      false,
      request,
      data => {
        const {Status, Message} = data;
        if (Status === 1) {
          res(data);
        } else {
          rej(Message || 'Something went wrong... Please try again later');
        }
      },
      () => {
        rej('Something went wrong... Please try again later');
      },
    );
  });
};

const getYearList = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_YEAR_LIST}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

const getSemAndSubList = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SEM_AND_SECTIONS}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

const getStudentList = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_STUDENT_LIST}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

const renderListItem = props => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Icons
        name={`radio-button-${!props.isSelected ? 'un' : ''}checked`}
        size={20}
        color="#18984B"
      />
    </View>
  );

  return (
    <RenderListItem
      {...props}
      IconComponent={IconComponent}
      listItemLabelStyle={{
        fontSize: 12,
      }}
      listItemContainerStyle={{
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );
};

const defaultValue = {
  courseid: null,
  deptid: null,
  yearid: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
};

const AddRecipients = ({
  visible,
  collegeId,
  memberid,
  Courseid,
  onSelect,
  onSubmit,
  onCancel,
  goBack,
  priority,
  modalContainerStyle = {},
  containerStyle = {},
}) => {
  // console.log(Courseid);
  const [submitValue, setSubmitValue] = useState({});

  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === 'p2' ? Courseid : null,
  );
  const [courseitems, setcourseItems] = useState([]);
  const [entireCollege, setEntireCollege] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(true);

  const [courseValuesCheck, setCourseValuesCheck] = useState(true);
  useEffect(() => {
    if (collegeId) {
      setcourseLoading(true);
      getCourseList({
        idcollege: collegeId,
      })
        .then(respose => {
          const {Status, data} = respose;
          if (Status === 1) {
            if (data.length && !data.some(a => a.courseid === 'all')) {
              data.unshift({coursename: 'All', courseid: 'all'});
            }
            setcourseItems(data);
            setCourseValuesCheck(courseitems.length !== 0 ? true : false);
            // console.log(courseitems, 'okkk');
          }
        })
        .then(respose => setcourseLoading(false))
        .catch(() => {
          setcourseLoading(false);
        });
    }
  }, [collegeId, courseValuesCheck]);
  useEffect(() => {
    if (entireCollege === true) {
      setcourseValue(null);
      setcourseOpen(false);
      setdepartmentValue(null);
      setyearValue(null);
      setyearItems([]);
      setsemesterValue(null);
      setsemesterItems([]);
      setsectionValue(null);
      setsectionItems([]);
      setstudentValue(null);
      setstudentItems([]);
      setdepartmentOpen(false);
      setyearOpen(false);
      setsemesterOpen(false);
      setsectionOpen(false);
      setstudentOpen(false);
      setSelectedGroup(false);
      setSubmitValue({});
      // onSelect('entire_college');
    }
  }, [entireCollege]);
  useEffect(() => {
    if (coursevalue && coursevalue === 'all') {
      const items = courseitems.map(item => item.courseid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: items,
      });
      setdepartmentValue(null);
      setdepartmentItems([]);
      setyearValue(null);
      setyearItems([]);
      setsemesterValue(null);
      setsemesterItems([]);
      setsectionValue(null);
      setsectionItems([]);
      setstudentValue(null);
      setstudentItems([]);
      setdepartmentOpen(false);
      setyearOpen(false);
      setsemesterOpen(false);
      setsectionOpen(false);
      setstudentOpen(false);
    }

    if (coursevalue && coursevalue != 'all') {
      setSubmitValue({
        ...defaultValue,
      });
    }
  }, [coursevalue]);

  const [departmentopen, setdepartmentOpen] = useState(false);
  const [departmentloading, setdepartmentLoading] = useState(false);
  const [departmentvalue, setdepartmentValue] = useState(null);
  const [departmentitems, setdepartmentItems] = useState([]);
  // console.log(coursevalue, 'jfyuyfug');
  useEffect(() => {
    // console.log(courseitems?.length, priority, coursevalue);
    if (
      coursevalue &&
      coursevalue != 'all' &&
      priority !== 'p2' &&
      courseitems.length !== 0
    ) {
      // console.log(course, 'jfyuyfug');
      setdepartmentLoading(true);
      const course = courseitems.find(item => coursevalue == item.courseid);
      if (
        course?.deptdetails.length &&
        !course?.deptdetails.some(a => a.deptid === 'all')
      ) {
        course.deptdetails.unshift({deptname: 'All', deptid: 'all'});
      }
      setdepartmentItems(course.deptdetails);
      setdepartmentLoading(false);
    } else if (priority === 'p2' && Courseid && courseitems.length !== 0) {
      setdepartmentLoading(true);
      setcourseValue(Courseid);
      const course = courseitems.find(item => Courseid == item.courseid);

      if (
        course?.deptdetails.length &&
        !course?.deptdetails.some(a => a.deptid === 'all')
      ) {
        course.deptdetails.unshift({deptname: 'All', deptid: 'all'});
      }
      setdepartmentItems(course?.deptdetails);
      setdepartmentLoading(false);
    }
  }, [coursevalue, courseitems]);

  useEffect(() => {
    if (departmentvalue && departmentvalue == 'all') {
      const items = departmentitems.map(item => item.deptid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: coursevalue,
        deptid: items,
      });

      setyearValue(null);
      setyearItems([]);
      setsemesterValue(null);
      setsemesterItems([]);
      setsectionValue(null);
      setsectionItems([]);
      setstudentValue(null);
      setstudentItems([]);
      setyearOpen(false);
      setsemesterOpen(false);
      setsectionOpen(false);
      setstudentOpen(false);
    }

    if (departmentvalue && departmentvalue != 'all') {
      setSubmitValue({
        ...submitValue,
        deptid: departmentvalue,
      });
    }
  }, [departmentvalue, coursevalue]);

  const [yearopen, setyearOpen] = useState(false);
  const [yearloading, setyearLoading] = useState(false);
  const [yearvalue, setyearValue] = useState(null);
  const [yearitems, setyearItems] = useState([]);

  useEffect(() => {
    if (departmentvalue && departmentvalue != 'all') {
      setyearLoading(true);
      getYearList({
        idcollege: collegeId,
        idcourse: coursevalue,
        iddept: departmentvalue,
        clgprocessby: memberid,
      })
        .then(respose => {
          const {Status, data} = respose;
          if (Status === 1) {
            if (data.length && !data.some(a => a.yearid === 'all')) {
              data.unshift({yearname: 'All', yearid: 'all'});
            }
            setyearItems(data);
          }
        })
        .then(respose => setyearLoading(false))
        .catch(() => {
          setyearLoading(false);
        });
    }
  }, [collegeId, coursevalue, departmentvalue, memberid]);

  useEffect(() => {
    if (yearvalue && yearvalue == 'all') {
      const items = yearitems.map(item => item.yearid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: items,
      });
      setsemesterValue(null);
      setsemesterItems([]);
      setsectionValue(null);
      setsectionItems([]);
      setstudentValue(null);
      setstudentItems([]);
      setsemesterOpen(false);
      setsectionOpen(false);
      setstudentOpen(false);
    }

    if (yearvalue && yearvalue != 'all') {
      setSubmitValue({
        ...submitValue,
        yearid: yearvalue,
      });
    }
  }, [yearvalue, departmentvalue, coursevalue]);

  const [semesteropen, setsemesterOpen] = useState(false);
  const [semesterloading, setsemesterLoading] = useState(false);
  const [semestervalue, setsemesterValue] = useState(null);
  const [semesteritems, setsemesterItems] = useState([]);

  useEffect(() => {
    if (yearvalue && yearvalue != 'all') {
      setsemesterLoading(true);
      getSemAndSubList({
        yearid: yearvalue,
      })
        .then(respose => {
          const {Status, data} = respose;
          if (Status === 1) {
            if (data.length && !data.some(a => a.clgsemesterid === 'all')) {
              data.unshift({semestername: 'All', clgsemesterid: 'all'});
            }
            setsemesterItems(data);
          }
        })
        .then(respose => setsemesterLoading(false))
        .catch(() => {
          setsemesterLoading(false);
        });
    }
  }, [yearvalue, departmentvalue, coursevalue]);

  useEffect(() => {
    if (semestervalue && semestervalue == 'all') {
      const items = semesteritems.map(item => item.clgsemesterid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
        semesterid: items,
      });
      setsectionValue(null);
      setsectionItems([]);
      setstudentValue(null);
      setstudentItems([]);
      setsectionOpen(false);
      setstudentOpen(false);
    }

    if (semestervalue && semestervalue != 'all') {
      setSubmitValue({
        ...submitValue,
        semesterid: semestervalue,
      });
    }
  }, [semestervalue, yearvalue, departmentvalue, coursevalue]);

  const [sectionopen, setsectionOpen] = useState(false);
  const [sectionloading, setsectionLoading] = useState(false);
  const [sectionvalue, setsectionValue] = useState(null);
  const [sectionitems, setsectionItems] = useState([]);

  useEffect(() => {
    if (semestervalue && semestervalue != 'all') {
      setsectionLoading(true);
      const semester = semesteritems.find(
        item => semestervalue == item.clgsemesterid,
      );
      if (
        semester.sectiondetails.length &&
        !semester.sectiondetails.some(a => a.sectionid === 'all')
      ) {
        semester.sectiondetails.unshift({sectionname: 'All', sectionid: 'all'});
      }
      setsectionItems(semester.sectiondetails);
      setsectionLoading(false);
    }
  }, [semestervalue, yearvalue, departmentvalue, coursevalue]);

  useEffect(() => {
    if (sectionvalue && sectionvalue == 'all') {
      const items = sectionitems.map(item => item.sectionid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
        semesterid: semestervalue,
        sectionid: items,
      });
      setstudentValue(null);
      setstudentItems([]);
      setstudentOpen(false);
    }

    if (sectionvalue && sectionvalue != 'all') {
      setSubmitValue({
        ...submitValue,
        sectionid: sectionvalue,
      });
    }
  }, [sectionvalue, semestervalue, yearvalue, departmentvalue, coursevalue]);

  const [studentopen, setstudentOpen] = useState(false);
  const [studentloading, setstudentLoading] = useState(false);
  const [studentvalue, setstudentValue] = useState(null);
  const [studentitems, setstudentItems] = useState([]);

  useEffect(() => {
    if (sectionvalue && sectionvalue != 'all') {
      setstudentLoading(true);
      getStudentList({
        collegeid: collegeId,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
        sectionid: sectionvalue,
      })
        .then(respose => {
          const {Status, data} = respose;
          if (Status === 1) {
            if (data.length && !data.some(a => a.memberid === 'all')) {
              data.unshift({name: 'All', memberid: 'all'});
            }
            setstudentItems(data);
          }
        })
        .then(respose => setstudentLoading(false))
        .catch(() => {
          setstudentLoading(false);
        });
    }
  }, [collegeId, coursevalue, departmentvalue, yearvalue, sectionvalue]);

  useEffect(() => {
    if (studentvalue && studentvalue.includes('all')) {
      const items = studentitems.map(item => item.memberid);
      items.shift();
      setstudentValue(items);
      if (studentvalue.includes('all') && studentvalue.length !== 1) {
        console.log('aakkklll');
        const itemsspecific = studentvalue.shift('all');
        setSubmitValue({
          ...submitValue,
          studentid: itemsspecific,
        });
      }
      if (studentvalue.length === 1 && studentvalue.includes('all')) {
        // setstudentValue(['all']);
        console.log('aakkk');
        setSubmitValue({
          courseid: coursevalue,
          deptid: departmentvalue,
          yearid: yearvalue,
          semesterid: semestervalue,
          sectionid: sectionvalue,
          studentid: items,
        });
      }
    }

    if (studentvalue && !studentvalue.includes('all')) {
      setSubmitValue({
        ...submitValue,
        studentid: studentvalue,
      });
    }
  }, [studentvalue]);
  console.log(studentvalue);
  return (
    <Portal>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Modal
          visible={visible}
          contentContainerStyle={[
            styles.modalContainerStyle,
            modalContainerStyle,
          ]}
        >
          <ScrollView style={[styles.container, containerStyle]}>
            <View>
              <Text style={styles.heading}>Add Recipients</Text>
              {priority === 'p1' ? (
                <>
                  <View style={styles.buttonWrapper}>
                    <Button
                      style={
                        entireCollege ? styles.button : styles.outlineButton
                      }
                      onPress={() => {
                        onSelect('entire_college');
                        setEntireCollege(true);
                        setSelectedGroup(false);
                      }}
                    >
                      <Text
                        style={
                          entireCollege
                            ? styles.actionButtonText
                            : styles.actionButtonNotSelectedText
                        }
                      >
                        Entire College
                      </Text>
                    </Button>
                    <Button
                      style={
                        selectedGroup ? styles.button : styles.outlineButton
                      }
                      onPress={() => {
                        onSelect('entire_college');
                        setSelectedGroup(true);
                        setEntireCollege(false);
                      }}
                    >
                      <Text
                        style={
                          selectedGroup
                            ? styles.actionButtonText
                            : styles.actionButtonNotSelectedText
                        }
                      >
                        Select Group
                      </Text>
                    </Button>
                  </View>

                  <Text style={styles.seprator}>- or -</Text>
                </>
              ) : null}
            </View>

            <View style={[styles.selectWrapper]}>
              {priority === 'p1' ? (
                <DropDownPicker
                  open={courseopen}
                  // value={coursevalue}
                  items={courseitems.map(item => ({
                    label: item.coursename,
                    value: item.courseid,
                  }))}
                  loading={courseloading}
                  //disabled={courseitems.length === 0}
                  setOpen={x => {
                    setcourseOpen(x);
                    setdepartmentOpen(false);
                    setyearOpen(false);
                    setsemesterOpen(false);
                    setsectionOpen(false);
                    setstudentOpen(false);
                    setSelectedGroup(false);
                    setEntireCollege(false);
                  }}
                  setValue={x => {
                    setcourseValue(x);
                    setdepartmentValue(null);
                    setyearValue(null);
                    setsemesterValue(null);
                    setsectionValue(null);
                    setstudentValue(null);
                  }}
                  setItems={x => {
                    setcourseItems(x);
                    // console.log(x);
                    setdepartmentItems([]);
                    setyearItems([]);
                    setsemesterItems([]);
                    setsectionItems([]);
                    setstudentItems([]);
                  }}
                  renderListItem={renderListItem}
                  searchPlaceholder="Search..."
                  showTickIcon={false}
                  itemKey="value"
                  placeholder="-- Select Course --"
                  placeholderStyle={styles.placeholderStyle}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  style={styles.dropdown}
                  searchTextInputStyle={styles.searchTextInputStyle}
                  searchContainerStyle={styles.searchContainerStyle}
                  listMode="SCROLLVIEW"
                  ArrowUpIconComponent={({style}) => (
                    <Icons name="arrow-drop-up" size={25} />
                  )}
                  ArrowDownIconComponent={({style}) => (
                    <Icons name="arrow-drop-down" size={25} />
                  )}
                  searchable
                  closeAfterSelecting
                  ActivityIndicatorComponent={({color, size}) => (
                    <ActivityIndicator color={color} size={size} />
                  )}
                  zIndex={6000}
                  zIndexInverse={1000}
                />
              ) : null}

              <DropDownPicker
                open={departmentopen}
                value={departmentvalue}
                items={departmentitems.map(item => ({
                  label: item.deptname,
                  value: item.deptid,
                }))}
                loading={departmentloading}
                disabled={departmentitems.length === 0}
                setOpen={x => {
                  setdepartmentOpen(x);
                  setyearOpen(false);
                  setsemesterOpen(false);
                  setsectionOpen(false);
                  setstudentOpen(false);
                }}
                setValue={x => {
                  setdepartmentValue(x);
                  setyearValue(null);
                  setsemesterValue(null);
                  setsectionValue(null);
                  setstudentValue(null);
                }}
                setItems={x => {
                  setdepartmentItems(x);
                  setyearItems([]);
                  setsemesterItems([]);
                  setsectionItems([]);
                  setstudentItems([]);
                }}
                renderListItem={renderListItem}
                searchPlaceholder="Search..."
                showTickIcon={false}
                itemKey="value"
                placeholder="-- Select Department --"
                placeholderStyle={styles.placeholderStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                style={styles.dropdown}
                searchTextInputStyle={styles.searchTextInputStyle}
                searchContainerStyle={styles.searchContainerStyle}
                listMode="SCROLLVIEW"
                ArrowUpIconComponent={({style}) => (
                  <Icons name="arrow-drop-up" size={25} />
                )}
                ArrowDownIconComponent={({style}) => (
                  <Icons name="arrow-drop-down" size={25} />
                )}
                searchable
                closeAfterSelecting
                ActivityIndicatorComponent={({color, size}) => (
                  <ActivityIndicator color={color} size={size} />
                )}
                zIndex={5000}
                zIndexInverse={2000}
              />

              <DropDownPicker
                open={yearopen}
                value={yearvalue}
                items={yearitems.map(item => ({
                  label: item.yearname,
                  value: item.yearid,
                }))}
                loading={yearloading}
                disabled={yearitems.length === 0}
                setOpen={x => {
                  setyearOpen(x);
                  setsemesterOpen(false);
                  setsectionOpen(false);
                  setstudentOpen(false);
                }}
                setValue={x => {
                  setyearValue(x);
                  setsemesterValue(null);
                  setsectionValue(null);
                  setstudentValue(null);
                }}
                setItems={x => {
                  setyearItems(x);
                  setsemesterItems([]);
                  setsectionItems([]);
                  setstudentItems([]);
                }}
                renderListItem={renderListItem}
                searchPlaceholder="Search..."
                showTickIcon={false}
                itemKey="value"
                placeholder="-- Select Year --"
                placeholderStyle={styles.placeholderStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                style={styles.dropdown}
                searchTextInputStyle={styles.searchTextInputStyle}
                searchContainerStyle={styles.searchContainerStyle}
                listMode="SCROLLVIEW"
                ArrowUpIconComponent={({style}) => (
                  <Icons name="arrow-drop-up" size={25} />
                )}
                ArrowDownIconComponent={({style}) => (
                  <Icons name="arrow-drop-down" size={25} />
                )}
                searchable
                closeAfterSelecting
                ActivityIndicatorComponent={({color, size}) => (
                  <ActivityIndicator color={color} size={size} />
                )}
                zIndex={4000}
                zIndexInverse={3000}
              />

              <DropDownPicker
                open={semesteropen}
                value={semestervalue}
                items={semesteritems.map(item => ({
                  label: item.semestername,
                  value: item.clgsemesterid,
                }))}
                loading={semesterloading}
                disabled={semesteritems.length === 0}
                setOpen={x => {
                  setsemesterOpen(x);
                  setsectionOpen(false);
                  setstudentOpen(false);
                }}
                setValue={x => {
                  setsemesterValue(x);
                  setsectionValue(null);
                  setstudentValue(null);
                }}
                setItems={x => {
                  setsemesterItems(x);
                  setsectionItems([]);
                  setstudentItems([]);
                }}
                renderListItem={renderListItem}
                searchPlaceholder="Search..."
                showTickIcon={false}
                itemKey="value"
                placeholder="-- Select Semester --"
                placeholderStyle={styles.placeholderStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                style={styles.dropdown}
                searchTextInputStyle={styles.searchTextInputStyle}
                searchContainerStyle={styles.searchContainerStyle}
                listMode="SCROLLVIEW"
                ArrowUpIconComponent={({style}) => (
                  <Icons name="arrow-drop-up" size={25} />
                )}
                ArrowDownIconComponent={({style}) => (
                  <Icons name="arrow-drop-down" size={25} />
                )}
                searchable
                closeAfterSelecting
                ActivityIndicatorComponent={({color, size}) => (
                  <ActivityIndicator color={color} size={size} />
                )}
                zIndex={3000}
                zIndexInverse={4000}
              />

              <DropDownPicker
                open={sectionopen}
                value={sectionvalue}
                items={sectionitems.map(item => ({
                  label: item.sectionname,
                  value: item.sectionid,
                }))}
                loading={sectionloading}
                disabled={sectionitems.length === 0}
                setOpen={x => {
                  setsectionOpen(x);
                  setstudentOpen(false);
                }}
                setValue={x => {
                  setsectionValue(x);
                  setstudentValue(null);
                }}
                setItems={x => {
                  setsectionItems(x);
                  setstudentItems([]);
                }}
                renderListItem={renderListItem}
                searchPlaceholder="Search..."
                showTickIcon={false}
                itemKey="value"
                placeholder="-- Select Section --"
                placeholderStyle={styles.placeholderStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                dropDownDirection="TOP"
                style={styles.dropdown}
                searchTextInputStyle={styles.searchTextInputStyle}
                searchContainerStyle={styles.searchContainerStyle}
                listMode="SCROLLVIEW"
                ArrowUpIconComponent={({style}) => (
                  <Icons name="arrow-drop-up" size={25} />
                )}
                ArrowDownIconComponent={({style}) => (
                  <Icons name="arrow-drop-down" size={25} />
                )}
                searchable
                closeAfterSelecting
                ActivityIndicatorComponent={({color, size}) => (
                  <ActivityIndicator color={color} size={size} />
                )}
                zIndex={2000}
                zIndexInverse={5000}
              />

              <DropDownPicker
                multiple
                multipleText="{count} student's selected"
                min={0}
                open={studentopen}
                value={studentvalue}
                items={studentitems.map(item => ({
                  label: item.name,
                  value: item.memberid,
                }))}
                loading={studentloading}
                disabled={studentitems.length === 0}
                setOpen={setstudentOpen}
                setValue={x => {
                  console.log(x, 'jjj');
                  setstudentValue(x);
                }}
                setItems={setstudentItems}
                renderListItem={renderListItem}
                searchPlaceholder="Search..."
                showTickIcon={false}
                itemKey="value"
                placeholder="-- Select Student --"
                dropDownDirection="TOP"
                placeholderStyle={styles.placeholderStyle}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                style={styles.dropdown}
                searchTextInputStyle={styles.searchTextInputStyle}
                searchContainerStyle={styles.searchContainerStyle}
                listMode="SCROLLVIEW"
                ArrowUpIconComponent={({style}) => (
                  <Icons name="arrow-drop-up" size={25} />
                )}
                ArrowDownIconComponent={({style}) => (
                  <Icons name="arrow-drop-down" size={25} />
                )}
                searchable
                closeAfterSelecting
                ActivityIndicatorComponent={({color, size}) => (
                  <ActivityIndicator color={color} size={size} />
                )}
                zIndex={1000}
                zIndexInverse={6000}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button style={styles.cancelButton} onPress={onCancel}>
                <Text style={[styles.actionButtonText]}>Cancel</Text>
              </Button>
              <Button
                style={styles.submitButton}
                onPress={() => {
                  onSubmit(submitValue);
                }}
              >
                <Text style={[styles.actionButtonText]}>Submit</Text>
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </SafeAreaView>
    </Portal>
  );
};

export default AddRecipients;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    maxHeight: '85%',
  },
  container: {
    paddingHorizontal: 10,
    // height: '100%',
  },
  heading: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1B82E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
  },
  outlineButton: {
    flexDirection: 'row',
    borderColor: '#1B82E1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#BBBBBB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 15,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#18984B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
  actionButtonNotSelectedText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: '#1B82E1',
  },
  seprator: {
    alignSelf: 'center',
    color: '#B4B4B4',
    fontSize: 12,
  },
  selectWrapper: {
    marginVertical: 15,
  },
  placeholderStyle: {
    color: '#C0C0C0',
  },
  dropDownContainerStyle: {
    borderColor: '#D4D4D4',
    backgroundColor: '#F6FBFF',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#D4D4D4',
  },
  searchTextInputStyle: {
    borderColor: '#D4D4D4',
  },
  searchContainerStyle: {
    borderBottomColor: '#F6FBFF',
  },
  iconContainerStyle: {
    marginRight: 10,
  },
});
