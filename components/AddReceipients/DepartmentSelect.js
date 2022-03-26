import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import RenderListItem from "react-native-dropdown-picker/src/components/RenderListItem";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Checkbox } from "react-native-paper";
import AppConfig from "../../redux/app-config";
import Icons from "react-native-vector-icons/MaterialIcons";
import Button from "../Button/button";
import { stylesForDropDown } from "./commonStyles";
import { Alert } from "react-native";
import { Constants, FONT } from "../../constants/constants";
import triggerSimpleAjax from '../../context/Helper/httpHelper';

const defaultValue = {
  division_id: null,
  department_id: null,
  yearid: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
  selectedCATEGORY: null,
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
const renderListItem = (props) => {

  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Icons
        name={`radio-button-${!props.isSelected ? "un" : ""}checked`}
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
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );
};

const renderMulipleListItem = (props) => {
  console.log({ props });
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Checkbox.Item
        status={
          props.departmentvalue?.includes("all") || props.isSelected
            ? "checked"
            : "unchecked"
        }
        style={{
          height: 20,
          width: 20,
          // backgroundColor: 'red',
          alignSelf: "center",
          justifyContent: "center",
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
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );
};
const DepartmentSelect = ({
  memberid,
  collegeId,
  priority,
  Divisionid,
  dataForCourse,
  setcategoryValue,
  onSubmit,
}) => {
  const [selectedAllDepartment, setSelectedAllDepartment] = useState(false);
  const [submitValue, setSubmitValue] = useState({});
  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === "p2" ? Divisionid : null
  );
  const [courseitems, setcourseItems] = useState(
    dataForCourse.filter((course) => course.division_name !== "All")
  );


  useEffect(() => {
    if (coursevalue && coursevalue === "all") {
      const items = courseitems.map((item) => item.division_id);
      console.log("itemsDivision", items);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        division_id: items,
      });
      setdepartmentValue(null);
      setdepartmentItems([]);
    }
    if (coursevalue && coursevalue != "all") {
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
      coursevalue != "all" &&
      priority !== "p2" &&
      courseitems.length !== 0
    ) {
      const course = courseitems.find(
        (item) => coursevalue == item.division_id
      );
      setdepartmentLoading(true);
      getDepartmentList({
        user_id: memberid,
        college_id: collegeId,
        div_id: coursevalue,
      })
        .then((departResponse) => {
          const { Status, data } = departResponse;
          if (Status === 1) {

            if (data.length && !data.some(a => a.department_id === 'all')) {
              data.unshift({ department_name: 'All', department_id: 'all', department_code: '' + '' });
            }

            setdepartmentItems(data);

          }
        })
        .then((departResponse) => setdepartmentLoading(false))
        .catch(() => {
          setdepartmentLoading(false);
        });


    } else if (priority === "p2" && Divisionid && courseitems.length !== 0) {
      setdepartmentLoading(true);
      setcourseValue(Divisionid);
      const course = courseitems.find(
        (item) => Divisionid == item.Divisionid
      );

      setdepartmentLoading(true);
      getDepartmentList({
        user_id: memberid,
        college_id: collegeId,
        div_id: coursevalue,
      })
        .then((departResponse) => {
          const { Status, data } = departResponse;
          if (Status === 1) {

            if (data.length && !data.some(a => a.department_id === 'all')) {
              data.unshift({ department_name: 'All', department_id: 'all', department_code: '' + '' });
            }

            setdepartmentItems(data);
            console.log('setDivisionItems', data);

          }
        })
        .then((departResponse) => setdepartmentLoading(false))
        .catch(() => {
          setdepartmentLoading(false);
        });
    }
  }, [coursevalue, courseitems]);


  useEffect(() => {
    if (departmentvalue && departmentvalue.includes("all")) {
      const items = departmentitems.map((item) => item.department_id);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        division_id: coursevalue,
        department_id: items,
        selectedCATEGORY: "EntireDeparment",
      });
    }

    if (departmentvalue && !departmentvalue.includes("all")) {
      setSubmitValue({
        ...submitValue,
        division_id: coursevalue,
        department_id: departmentvalue,
        selectedCATEGORY: "SpecificDeparment",
      });
    }

    console.log('SeletedDepartmentvalue', departmentvalue);
    console.log('CourseDeptvalue', coursevalue);


  }, [departmentvalue, coursevalue]);
  const onSumbitValue = () => {
    setcourseOpen(false);
    setdepartmentOpen(false);
    console.log(submitValue);
    if (submitValue.department_id !== null) {
      onSubmit(submitValue);
    } else {
      Alert.alert("Kindly select One value till Department");
    }
  };

  const checkLastValue = (value) => {
    if (value?.length) {
      let localDeptValue = [...value];
      if (value?.length !== 1) {
        let lastElement = value[value.length - 1];
        if (lastElement !== "all") {
          if (localDeptValue.includes("all")) {
            const totalValue = departmentitems?.map(
              (item) => item.department_id
            );
            const indexOfAll = totalValue.indexOf("all");
            totalValue.splice(indexOfAll, 1);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, "splitValue", totalValue);
            setdepartmentValue(totalValue); //removes all from the array when specfic item selected
            setSelectedAllDepartment(false);
          }
        } else if (lastElement === "all") {
          setdepartmentValue([lastElement]);
          setSelectedAllDepartment(true);
        }
      } else if (value.length === 1 && value?.[0] === "all") {
        setSelectedAllDepartment(true);
      } else if (value.length === 1 && value?.[0] !== "all") {
        setSelectedAllDepartment(false);
      }
    }
  };
  return (
    <>
      <ScrollView style={[styles.selectWrapper]}>
        {priority === "p1" || departmentopen ? (
          <DropDownPicker
            open={courseopen}
            value={coursevalue}
            items={courseitems.map((item) => ({
              label: item.division_name,
              value: item.division_id,
            }))}
            loading={courseloading}
            //disabled={courseitems.length === 0}
            setOpen={(x) => {
              setcourseOpen(x);
              setdepartmentOpen(false);
            }}
            setValue={(x) => {
              setcourseValue(x);
              setdepartmentValue(null);
            }}
            setItems={(x) => {
              setcourseItems(x);
              setdepartmentItems([]);
            }}
            containerProps={{
              height: courseopen ? 250 : undefined,
            }}
            renderListItem={renderListItem}
            // searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Division --"
            placeholderStyle={styles.placeholderStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            style={styles.dropdown}
            searchTextInputStyle={styles.searchTextInputStyle}
            searchContainerStyle={styles.searchContainerStyle}
            listMode="SCROLLVIEW"
            ArrowUpIconComponent={({ style }) => (
              <Icons name="arrow-drop-up" size={25} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <Icons name="arrow-drop-down" size={25} />
            )}
            // searchable
            closeAfterSelecting
            ActivityIndicatorComponent={({ color, size }) => (
              <ActivityIndicator color={color} size={size} />
            )}
            zIndex={6000}
            zIndexInverse={1000}
            ListEmptyComponent={({ }) => (
              <Text style={{ alignSelf: 'center' }}>No Data found</Text>
            )}
          />
        ) : null}

        {coursevalue ? (
          <DropDownPicker
            multiple
            multipleText={
              selectedAllDepartment
                ? "All Department selected"
                : "{count} Department selected"
            }
            min={0}
            open={departmentopen}
            value={departmentvalue}
            items={departmentitems.map((item) => ({
              label: item.department_name + ' ' + ' ' + item.department_code,
              value: item.department_id,
            }))}
            loading={departmentloading}
            disabled={departmentitems.length === 0}
            setOpen={(x) => {
              setdepartmentOpen(x);
            }}
            setValue={(x) => {
              setdepartmentValue(x);
            }}
            setItems={(x) => {
              setdepartmentItems(x);
            }}
            containerProps={{
              height: departmentopen ? 250 : undefined,
            }}
            onChangeValue={(value) => checkLastValue(value)}
            renderListItem={(props) =>
              renderMulipleListItem({ ...props, departmentvalue })
            }
            searchPlaceholder="Search..."
            showTickIcon={false}
            itemKey="value"
            placeholder="-- Select Department --"
            // dropDownDirection="TOP"
            placeholderStyle={styles.placeholderStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            style={styles.dropdown}
            searchTextInputStyle={styles.searchTextInputStyle}
            searchContainerStyle={styles.searchContainerStyle}
            listMode="SCROLLVIEW"
            ArrowUpIconComponent={({ style }) => (
              <Icons name="arrow-drop-up" size={25} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <Icons name="arrow-drop-down" size={25} />
            )}
            searchable
            closeAfterSelecting
            ActivityIndicatorComponent={({ color, size }) => (
              <ActivityIndicator color={color} size={size} />
            )}
            zIndex={5000}
            zIndexInverse={1000}
            ListEmptyComponent={({ }) => (
              <Text style={{ alignSelf: 'center' }}>No Data found</Text>
            )}
          />
        ) : null}
      </ScrollView>
      <View style={[styles.buttonWrapper]}>
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

export default DepartmentSelect;

const styles = StyleSheet.create({
  ...stylesForDropDown,
});

