/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import RenderListItem from 'react-native-dropdown-picker/src/components/RenderListItem';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Checkbox} from 'react-native-paper';

import Icons from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button/button';
import {stylesForDropDown} from './commonStyles';

import AppConfig from '../../redux/app-config';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import {Constants, FONT} from '../../constants/constants';

const defaultValue = {
  division_id: null,
  department_id: null,
  course_id: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
  selectedCATEGORY: null,
};

const getYearList = request => {
  console.log('CourseRequest',request)

  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_COURSE_DEPARTMENT}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
        console.log("CourseList", data);
        console.log("CourseListStatus", Status)

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

const getDepartmentList = (request) => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.DEPARTMENT_DIV_LIST}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
        console.log("departmenrtlst", data);
        console.log("departmenrtlstStatus", Status)

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
          props.yearvalue?.includes('all') || props.isSelected
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
const YearSelect = ({
  priority,
  collegeId,
  memberid,
  Divisionid,
  dataForCourse,
  setcategoryValue,
  onSubmit,
}) => {
  const [selectedAllYear, setSelectedAllYear] = useState(false);
  const [submitValue, setSubmitValue] = useState({});

  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === 'p2' ? Divisionid : null,
  );
  const [courseitems, setcourseItems] = useState(
    dataForCourse.filter(course => course.division_name !== 'All'),
  );
  

  useEffect(() => {
    if (coursevalue && coursevalue === 'all') {
      const items = courseitems.map(item => item.division_id);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        division_id: items,
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
      const course = courseitems.find(
        (item) => coursevalue == item.division_id
      );


      getDepartmentList({
        user_id: memberid,
        college_id: collegeId,
        div_id: coursevalue,
      })
        .then((departResponse) => {
          const { Status, data } = departResponse;
          if (Status === 1) {

          
            setdepartmentItems(data);
            console.log('DEpartmentItems',data);

          }
        })
        .then((departResponse) => setdepartmentLoading(false))
        .catch(() => {
          setdepartmentLoading(false);
        });
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
        user_id: memberid,
        college_id: collegeId,
        dept_id: departmentvalue,
      })
        .then(respose => {
          const {Status, data} = respose;
          if (Status === 1) {
            if (data.length && !data.some(a => a.course_id === 'all')) {
              data.unshift({course_name: 'All', course_id: 'all',course_code:' '});
            }
            console.log('setyearItems',setyearItems);

            setyearItems(data);
            console.log('setyearItemsdata',data);
          }
        })
        .then(respose => setyearLoading(false))
        .catch(() => {
          setyearLoading(false);
        });
    }
  }, [collegeId, coursevalue, departmentvalue, memberid]);

  useEffect(() => {
    if (yearvalue && yearvalue.includes('all')) {
      const items = yearitems.map(item => item.course_id);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        division_id: coursevalue,
        department_id: departmentvalue,
        course_id: items,

        selectedCATEGORY: 'EntireCourse',
      });
    }

    if (yearvalue && !yearvalue.includes('all')) {
      setSubmitValue({
        ...submitValue,
        division_id: coursevalue,
        department_id: departmentvalue,
        course_id: yearvalue,
        selectedCATEGORY: 'SpecificCourse',
      });
    }
  }, [yearvalue, departmentvalue, coursevalue]);

  const onSumbitValue = () => {
    setcourseOpen(false);
    setdepartmentOpen(false);
    console.log('FinalSubmit',submitValue);
    if (submitValue.course_id !== null) {
      onSubmit(submitValue);
    } else {
      Alert.alert('Kindly select minimum One value for each');
    }
  };
  const checkLastValue = value => {
    if (value?.length) {
      let localDeptValue = [...value];
      if (value?.length !== 1 && yearvalue?.length > 1) {
        let lastElement = value[value.length - 1];
        if (lastElement !== 'all') {
          if (localDeptValue.includes('all')) {
            const totalValue = yearitems.map(item => item.course_id);
            const indexOfAll = totalValue.indexOf('all');
            totalValue.splice(indexOfAll, 1);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, 'splitValue', totalValue);
            setyearValue(totalValue); //removes all from the array when specfic item selected
            setSelectedAllYear(false);
          }
        } else if (lastElement === 'all') {
          // let allSplit = yearvalue.splice(yearvalue.length - 1, 1);
          // setyearValue(allSplit); //removes except 'all' from the array when item 'all' selected
          setyearValue([lastElement]);
          setSelectedAllYear(true);
        }
      } else if (value.length === 1 && value?.[0] === 'all') {
        setSelectedAllYear(true);
      } else if (value.length === 1 && value?.[0] !== 'all') {
        setSelectedAllYear(false);
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
              label: item.division_name,
              value: item.division_id,
            }))}
            loading={courseloading}
            //disabled={courseitems.length === 0}
            setOpen={x => {
              setcourseOpen(x);
              setdepartmentOpen(false);
              setyearOpen(false);
            }}
            setValue={x => {
              setcourseValue(x);
              setdepartmentValue(null);
              setyearValue(null);
            }}
            setItems={x => {
              setcourseItems(x);
              // console.log(x);
              setdepartmentItems([]);
              setyearItems([]);
            }}
            containerProps={{
              height: courseopen ? 250 : undefined,
            }}
            renderListItem={renderListItem}
            searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Division --"
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
              label: item.department_name,
              value: item.department_id,
            }))}
            loading={departmentloading}
            disabled={departmentitems.length === 0}
            setOpen={x => {
              setdepartmentOpen(x);
              setyearOpen(false);
            }}
            setValue={x => {
              setdepartmentValue(x);
              setyearValue(null);
            }}
            setItems={x => {
              setdepartmentItems(x);
              setyearItems([]);
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
            multiple
            multipleText={
              selectedAllYear ? 'All Course selected' : '{count} Course selected'
            }
            min={0}
            open={yearopen}
            value={yearvalue}
            items={yearitems.map(item => ({
              label: item.course_name+' '+' '+item.course_code,
              value: item.course_id,
            }))}
            loading={yearloading}
            disabled={yearitems.length === 0}
            setOpen={x => {
              setyearOpen(x);
            }}
            setValue={x => {
              setyearValue(x);
            }}
            setItems={x => {
              setyearItems(x);
            }}
            containerProps={{
              height: yearopen ? 250 : undefined,
            }}
            onChangeValue={value => checkLastValue(value)}
            renderListItem={props =>
              renderMulipleListItem({...props, yearvalue})
            }
            searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Courses --"
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
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          style={styles.cancelButton}
          onPress={() => {
            // setcourseOpen(false);
            setcategoryValue(null);
          }}
        >
          <Text style={[styles.actionButtonText]}>Change Category</Text>
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

export default YearSelect;

const styles = StyleSheet.create({
  ...stylesForDropDown,
});
