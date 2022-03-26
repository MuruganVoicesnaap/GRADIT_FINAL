/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import RenderListItem from 'react-native-dropdown-picker/src/components/RenderListItem';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {Checkbox} from 'react-native-paper';

import Icons from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button/button';
import {stylesForDropDown} from './commonStyles';

import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {Constants, FONT} from '../../constants/constants';

const defaultValue = {
  courseid: null,
  deptid: null,
  yearid: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
  selectedCATEGORY: null,
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
        fontSize: Constants.FONT_BADGE,
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

const renderMulipleListItem = props => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Checkbox.Item
        status={
          props.sectionvalue?.includes('all') || props.isSelected
            ? 'checked'
            : 'unchecked'
        }
        style={{
          height: 20,
          width: 20,
          // backgroundColor: 'red',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );

  return (
    <RenderListItem
      {...props}
      IconComponent={IconComponent}
      listItemLabelStyle={{
        fontSize: Constants.FONT_BADGE,
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
const SectionSelect = ({
  priority,
  collegeId,
  memberid,
  Courseid,
  dataForCourse,
  setcategoryValue,
  onSubmit,
}) => {
  const [selectedALlSection, setSelectedALlSection] = useState(false);
  const [submitValue, setSubmitValue] = useState({});

  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === 'p2' ? Courseid : null,
  );
  const [courseitems, setcourseItems] = useState(
    dataForCourse.filter(course => course.coursename !== 'All'),
  );

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
  useEffect(() => {
    if (
      coursevalue &&
      coursevalue != 'all' &&
      priority !== 'p2' &&
      courseitems.length !== 0
    ) {
      setdepartmentLoading(true);
      const course = courseitems.find(item => coursevalue == item.courseid);

      setdepartmentItems(
        course?.deptdetails.filter(item => item.deptname !== 'All'),
      );
      setdepartmentLoading(false);
    } else if (priority === 'p2' && Courseid && courseitems.length !== 0) {
      setdepartmentLoading(true);
      setcourseValue(Courseid);
      const course = courseitems.find(item => Courseid == item.courseid);

      setdepartmentItems(
        course?.deptdetails.filter(item => item.deptname !== 'All'),
      );
      setdepartmentLoading(false);
    }
  }, [coursevalue, courseitems]);
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
    if (yearvalue && yearvalue !== 'all') {
      setSubmitValue({
        ...submitValue,
        courseid: coursevalue,
        deptid: departmentvalue,
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
    if (semestervalue && semestervalue != 'all') {
      setSubmitValue({
        ...submitValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
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
    if (sectionvalue && sectionvalue.includes('all')) {
      const items = sectionitems.map(item => item.sectionid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
        semesterid: semestervalue,
        sectionid: items,

        selectedCATEGORY: 'EntireSections',
      });
    }

    if (sectionvalue && !sectionvalue.includes('all')) {
      setSubmitValue({
        ...submitValue,
        courseid: coursevalue,
        deptid: departmentvalue,
        yearid: yearvalue,
        semesterid: semestervalue,
        sectionid: sectionvalue,

        selectedCATEGORY: 'SpecificSections',
      });
    }
  }, [sectionvalue, semestervalue, yearvalue, departmentvalue, coursevalue]);
  const onSumbitValue = () => {
    setcourseOpen(false);
    setdepartmentOpen(false);
    setyearOpen(false);
    setsemesterOpen(false);
    setsectionOpen(false);
    // console.log(submitValue);
    if (submitValue.sectionid !== null) {
      onSubmit(submitValue);
    } else {
      Alert.alert('Kindly select minimum One value for each till Sections');
    }
  };

  const checkLastValue = value => {
    if (value?.length) {
      let localDeptValue = [...value];
      if (value?.length !== 1) {
        let lastElement = value[value.length - 1];
        if (lastElement !== 'all') {
          if (localDeptValue.includes('all')) {
            const totalValue = sectionitems.map(item => item.sectionid);
            const indexOfAll = totalValue.indexOf('all');
            totalValue.splice(indexOfAll, 1);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, 'splitValue', totalValue);

            setsectionValue(totalValue); //removes all from the array when specfic item selected
            setSelectedALlSection(false);
          }
        } else if (lastElement === 'all') {
          setsectionValue([lastElement]); //removes except 'all' from the array when item 'all' selected
          setSelectedALlSection(true);
        }
      } else if (value.length === 1 && value?.[0] === 'all') {
        setSelectedALlSection(true);
      } else if (value.length === 1 && value?.[0] !== 'all') {
        setSelectedALlSection(false);
      }
    }
  };
  return (
    <>
      <ScrollView style={[styles.selectWrapper]}>
        {priority === 'p1' || (priority === 'p1' && departmentopen) ? (
          <DropDownPicker
            open={courseopen}
            value={coursevalue}
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
            }}
            setValue={x => {
              setcourseValue(x);
              setdepartmentValue(null);
              setyearValue(null);
              setsemesterValue(null);
              setsectionValue(null);
            }}
            setItems={x => {
              setcourseItems(x);
              // console.log(x);
              setdepartmentItems([]);
              setyearItems([]);
              setsemesterItems([]);
              setsectionItems([]);
            }}
            containerProps={{
              height: courseopen ? 250 : undefined,
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

        {coursevalue && !courseopen ? (
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
            }}
            setValue={x => {
              setdepartmentValue(x);
              setyearValue(null);
              setsemesterValue(null);
              setsectionValue(null);
            }}
            setItems={x => {
              setdepartmentItems(x);
              setyearItems([]);
              setsemesterItems([]);
              setsectionItems([]);
            }}
            containerProps={{
              height: departmentopen ? 250 : undefined,
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
            zIndex={1000}
            zIndexInverse={6000}
          />
        ) : null}

        {coursevalue && departmentvalue && !departmentopen && !courseopen ? (
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
            }}
            setValue={x => {
              setyearValue(x);
              setsemesterValue(null);
              setsectionValue(null);
            }}
            setItems={x => {
              setyearItems(x);
              setsemesterItems([]);
              setsectionItems([]);
            }}
            containerProps={{
              height: yearopen ? 250 : undefined,
            }}
            renderListItem={renderListItem}
            searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Year --"
            // dropDownDirection="TOP"
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
        ) : null}

        {coursevalue &&
        departmentvalue &&
        !departmentopen &&
        !courseopen &&
        yearvalue &&
        !yearopen ? (
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
            }}
            setValue={x => {
              setsemesterValue(x);
              setsectionValue(null);
            }}
            setItems={x => {
              setsemesterItems(x);
              setsectionItems([]);
            }}
            renderListItem={renderListItem}
            searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Semester --"
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
        ) : null}

        {coursevalue &&
        departmentvalue &&
        !departmentopen &&
        !courseopen &&
        yearvalue &&
        !yearopen &&
        semestervalue &&
        !semesteropen ? (
          <DropDownPicker
            multiple
            multipleText={
              selectedALlSection
                ? 'All Sections selected'
                : '{count} Sections selected'
            }
            min={0}
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
            }}
            setValue={x => {
              setsectionValue(x);
            }}
            setItems={x => {
              setsectionItems(x);
            }}
            onChangeValue={value => checkLastValue(value)}
            renderListItem={props =>
              renderMulipleListItem({...props, sectionvalue})
            }
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
        ) : null}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.cancelButton}
          onPress={() => {
            // setcourseOpen(false);
            setcategoryValue(null);
          }}
        >
          <Text style={[styles.actionButtonText]}>Back</Text>
        </Button>
        <Button
          style={styles.submitButton}
          onPress={() => {
            // onSubmit(submitValue);
            onSumbitValue();
          }}
        >
          <Text style={[styles.actionButtonText]}>ADD</Text>
        </Button>
      </View>
    </>
  );
};

export default SectionSelect;

const styles = StyleSheet.create({
  ...stylesForDropDown,
});
