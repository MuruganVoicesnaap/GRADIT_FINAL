import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import RenderListItem from "react-native-dropdown-picker/src/components/RenderListItem";
import { Modal, Portal, Checkbox } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { Constants, FONT } from "../../constants/constants";
import Button from "../Button/button";
import AppConfig from "../../redux/app-config";
import triggerSimpleAjax from "../../context/Helper/httpHelper";
import DepartmentSelect from "./DepartmentSelect";
import YearSectionSelect from "./YearSectionSelect";
import YourClassesSelection from "./YourClassesSelection";

import YearSelect from "./YearSelect";
import { Alert } from "react-native";

import CheckedIcon from "react-native-vector-icons/AntDesign";
import UncheckedIcon from "react-native-vector-icons/MaterialIcons";

const getDivisionList = (request) => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.DIVISION_LIST}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
        console.log("divisionlist", data);
        console.log("divisionlistStatus", Status);

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

const getCourseDepartment = (request) => {
  console.log("CourseDeptRequest", request);

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

const getGroupList = (request) => {
  return new Promise((res, rej) => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_GROUP_List_FOR_App}`,
      "POST",
      false,
      request,
      (data) => {
        const { Status, Message } = data;
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
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      {props.coursevalue?.includes("all") || props.isSelected ? (
        <CheckedIcon name="checkcircle" color={Constants.GREEN001} size={24} />
      ) : (
        <UncheckedIcon
          name="radio-button-unchecked"
          color={Constants.GREEN001}
          size={24}
        />
      )}

      {/* <Checkbox.Item
        status={
          props.coursevalue?.includes("all") || props.isSelected
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
      /> */}
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
const renderMulipleListItemGroup = (props) => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      {props.groupvalue?.includes("all") || props.isSelected ? (
        <CheckedIcon name="checkcircle" color={Constants.GREEN001} size={24} />
      ) : (
        <UncheckedIcon
          name="radio-button-unchecked"
          color={Constants.GREEN001}
          size={24}
        />
      )}

      {/* <Checkbox.Item
        status={
          props.groupvalue?.includes("all") || props.isSelected
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
      /> */}
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

const renderMulipleListItemHodCourse = (props) => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      {props.hodCoursevalue?.includes("all") || props.isSelected ? (
        <CheckedIcon name="checkcircle" color={Constants.GREEN001} size={24} />
      ) : (
        <UncheckedIcon
          name="radio-button-unchecked"
          color={Constants.GREEN001}
          size={24}
        />
      )}

      {/* <Checkbox.Item
        status={
          props.hodCoursevalue?.includes("all") || props.isSelected
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
      /> */}
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
const defaultValue = {
  division_id: null,
  deptid: null,
  departmentId: null,
  yearid: null,
  semesterid: null,
  sectionid: null,
  studentid: null,
  course_id: null,
  groupid: null,

  selectedCATEGORY: null,
};

const InitialCategory = ({
  visible,
  collegeId,
  memberid,
  Divisionid,
  onSelect,
  onSubmit,
  departmentId,
  onCancel,
  goBack,
  priority,
  modalContainerStyle = {},
  containerStyle = {},
}) => {
  const [selectedAllGroup, setSelectedAllGroup] = useState(false);
  const [selectedAllCourse, setSelectedAllCourse] = useState(false);
  const [selectedAllHodCourse, setSelectedAllHodCourse] = useState(false);

  const [submitValue, setSubmitValue] = useState({});
  const [openContainerHeight, setOpenContainerHeight] = useState(false);
  const [categoryOpen, setcategoryOpen] = useState(false);
  const [categoryValue, setcategoryValue] = useState(null);
  const [categoryItems, setcategoryItems] = useState(
    priority === "p1"
      ? [
          { catName: "EntireCollege", catId: "EntireCollege" },
          { catName: "Division", catId: "Division" },
          { catName: "Departments", catId: "Department" },
          { catName: "Courses", catId: "Courses" },
          { catName: "Your Classes", catId: "Your Classes" },
          { catName: "Group", catId: "Group" },
        ]
      : [
          { catName: "Entire Department", catId: "EntireDepartment" },
          { catName: "Courses", catId: "Course" },
          { catName: "Year/Section", catId: "Year/Section" },
        ]
  );

  console.log("departmentID", departmentId);

  useEffect(() => {
    getSubjectList();
  }, []);

  const getSubjectList = () => {
    const request = {
      staffid: memberid,
      collegeid: collegeId,
    };

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
      (result) => {}
    );
  };
  const selectedCategoryValue = () => {
    console.log("categoryValuetest", categoryValue);
    if (categoryValue) {
      if (categoryValue === "EntireCollege") {
        onSelect("entire_college");
      }
      if (categoryValue === "EntireDepartment") {
        onSelect("EntireDepartment");
      }
    }
  };
  const [deparmentPageData, setDeparmentPageData] = useState([]);
  const [courseopen, setcourseOpen] = useState(false);
  const [courseloading, setcourseLoading] = useState(true);
  const [coursevalue, setcourseValue] = useState(
    priority === "p2" ? Divisionid : null
  );
  const [courseitems, setcourseItems] = useState([]);

  const [courseValuesCheck, setCourseValuesCheck] = useState(true);

  const [groupopen, setgroupOpen] = useState(false);
  const [grouploading, setgroupLoading] = useState(true);
  const [groupvalue, setgroupValue] = useState(null);
  const [groupitems, setgroupItems] = useState([]);

  const [hodCourseOpen, sethodCourseOpen] = useState(false);
  const [hodCourseloading, sethodCourseLoading] = useState(true);
  const [hodCoursevalue, sethodCourseValue] = useState(null);
  const [hodCourseitems, sethodCourseItems] = useState([]);

  useEffect(() => {
    if (collegeId) {
      setcourseLoading(true);

      getDivisionList({
        user_id: memberid,
        college_id: collegeId,
      })
        .then((respose) => {
          const { Status, data } = respose;
          setDeparmentPageData(data);
          // console.log('Logvalue',data);

          if (Status === 1) {
            if (data.length && !data.some((a) => a.division_id === "all")) {
              data.unshift({
                division_name: "All",
                division_id: "all",
                division_code: "" + "" + "",
              });
            }
            setcourseItems(data);
            console.log("setDivisionItems", data);
            setCourseValuesCheck(courseitems.length !== 0 ? true : false);
          }
        })
        .then((respose) => setcourseLoading(false))
        .catch(() => {
          setcourseLoading(false);
        });

      getCourseDepartment({
        user_id: memberid,
        college_id: collegeId,
        dept_id: departmentId,
      })
        .then((respose) => {
          const { Status, data } = respose;

          if (Status === 1) {
            if (data.length && !data.some((a) => a.division_id === "all")) {
              data.unshift({
                course_name: "All",
                course_id: "all",
                course_code: " ",
              });
            }
            sethodCourseItems(data);
            console.log("sethodCourseItems", data);
            console.log("sethodCourseItems123", sethodCourseItems);
            hodCourseloading(false);
          }
        })
        .then((respose) => hodCourseloading(false))
        .catch(() => {
          setcourseLoading(false);
        });

      getGroupList({
        idcollege: collegeId,
      })
        .then((respose) => {
          const { Status, data } = respose;

          if (Status === 1) {
            if (data.length && !data.some((a) => a.courseid === "all")) {
              data.unshift({ groupname: "All", groupid: "all" });
            }
            setgroupItems(data);
            setgroupLoading(false);
          }
        })
        .then((respose) => setgroupLoading(false))
        .catch(() => {
          setcourseLoading(false);
        });
    }
  }, [collegeId, courseValuesCheck]);

  useEffect(() => {
    console.log("coursevalue", coursevalue);
    if (coursevalue && coursevalue.includes("all")) {
      const items = courseitems.map((item) => item.division_id);
      console.log("division_id", items);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        division_id: items,
        selectedCATEGORY: "entireDivision",
      });
    }
    if (coursevalue && !coursevalue.includes("all")) {
      setSubmitValue({
        ...submitValue,
        division_id: coursevalue,
        selectedCATEGORY: "specificDivision",
      });
    }
    console.log("Seletedcoursevalue", coursevalue);
  }, [coursevalue]);

  useEffect(() => {
    if (groupvalue && groupvalue.includes("all")) {
      const items = groupitems.map((item) => item.groupid);
      items.shift();
      setSubmitValue({
        ...defaultValue,
        groupid: items,
        selectedCATEGORY: "entireGroup",
      });
    }

    if (groupvalue && !groupvalue.includes("all")) {
      setSubmitValue({
        ...submitValue,
        groupid: groupvalue,
        selectedCATEGORY: "specificGroup",
      });
    }
  }, [groupvalue]);

  useEffect(() => {
    if (hodCoursevalue && hodCoursevalue.includes("all")) {
      const items = hodCourseitems.map((item) => item.course_id);
      items.shift();
      console.log("withAll", hodCoursevalue);
      setSubmitValue({
        ...defaultValue,
        course_id: items,
        selectedCATEGORY: "EntireCourse",
      });
    }

    if (hodCoursevalue && !hodCoursevalue.includes("all")) {
      console.log("withoutAll", hodCoursevalue);

      setSubmitValue({
        ...submitValue,
        course_id: hodCoursevalue,
        selectedCATEGORY: "SpecificCourse",
      });
    }
    console.log("HODCoursevalue", hodCoursevalue);
  }, [hodCoursevalue]);
  const checkLastValue = (value) => {
    console.log('testValue',value)
    if (value?.length) {
      let localCourseValue = [...value];
      if (value?.length !== 1 && coursevalue?.length > 1) {
        let lastElement = value[value.length - 1];
        console.log("more than one");
        if (lastElement !== "all") {
          if (localCourseValue.includes("all")) {
            const totalValue = courseitems.map((item) => item.division_id);

            const indexOfAll = totalValue.indexOf("all");
            totalValue.splice(indexOfAll, 1);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, "splitValue", totalValue);
            setcourseValue(totalValue); //removes all from the array when specfic item selected
            setSelectedAllCourse(false);
          }
        } else if (lastElement === "all") {
          // let allSplit = coursevalue.splice(coursevalue.length - 1, 1);
          setcourseValue([lastElement]); //removes except 'all' from the array when item 'all' selected
          setSelectedAllCourse(true);
        }
      } else if (value.length === 1 && value?.[0] === "all") {
        setSelectedAllCourse(true);
      } else if (value.length === 1 && value?.[0] !== "all") {
        setSelectedAllCourse(false);
      }
    }

    console.log(coursevalue?.length, selectedAllCourse);
  };
  const checkLastValueForGroup = (value) => {
    if (value?.length) {
      let localGroupValue = [...value];
      if (value?.length !== 1 && groupvalue?.length > 1) {
        let lastElement = value[value.length - 1];
        if (lastElement !== "all") {
          if (localGroupValue.includes("all")) {
            const totalValue = groupitems.map((item) => item.groupid);
            console.log(courseitems);
            const indexOfAll = totalValue.indexOf("all");
            totalValue.splice(indexOfAll, 1);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, "splitValue", totalValue);
            setgroupValue(totalValue); //removes all from the array when specfic item selected
            setSelectedAllGroup(false);
          }
        } else if (lastElement === "all") {
          let allSplit = groupvalue.splice(groupvalue.length - 1, 1);
          setgroupValue(allSplit); //removes except 'all' from the array when item 'all' selected
          setSelectedAllGroup(true);
        }
      } else if (value.length === 1 && value?.[0] === "all") {
        setSelectedAllGroup(true);
      } else if (value.length === 1 && value?.[0] !== "all") {
        setSelectedAllGroup(false);
      }
    }
  };

  const onSubmitGroup = () => {
    setgroupOpen(false);
    sethodCourseOpen(false);
    if (submitValue.groupid !== null) {
      onSubmit(submitValue);
    } else if (submitValue.course_id !== null) {
      onSubmit(submitValue);
      console.log("HodOnsubmitCourse", submitValue.course_id);
    } else {
      Alert.alert("select minimum one value");
    }
  };

  const checkLastValueForHodCourse = (value) => {
    if (value?.length) {
      let localHodCourseValue = [...value];
      if (value?.length !== 1 && hodCoursevalue?.length > 1) {
        let lastElement = value[value.length - 1];
        if (lastElement !== "all") {
          if (localHodCourseValue.includes("all")) {
            const totalValue = hodCourseitems.map((item) => item.course_id);
            console.log("hodCourseitems", hodCourseitems);

            const indexOfAll = totalValue.indexOf("all");
            totalValue.splice(indexOfAll, 1);
            console.log("indexOfAll", indexOfAll);
            const indexOfCurrentItem = totalValue.indexOf(lastElement);
            console.log("indexOfCurrentItem", indexOfCurrentItem);

            let alllSplit = totalValue.splice(indexOfCurrentItem, 1);
            console.log(alllSplit, "splitValue", totalValue);
            console.log("AllHodCourse", totalValue);

            sethodCourseValue(totalValue); //removes all from the array when specfic item selected
            setSelectedAllHodCourse(false);
          }
        } else if (lastElement === "all") {
          let allSplit = hodCoursevalue.splice(hodCoursevalue.length - 1, 1);
          sethodCourseValue(allSplit); //removes except 'all' from the array when item 'all' selected
          setSelectedAllHodCourse(true);
        }
      } else if (value.length === 1 && value?.[0] === "all") {
        setSelectedAllHodCourse(true);
      } else if (value.length === 1 && value?.[0] !== "all") {
        setSelectedAllHodCourse(false);
      }
    }
  };
  const onSumbitValue = () => {
    setcourseOpen(false);
    setgroupOpen(false);
    sethodCourseOpen(false);
    console.log(typeof submitValue, "InitialCategory");
    // console.log(typeof submitValue.courseid);
    if (submitValue.division_id !== null) {
      onSubmit(submitValue);
    } else if (submitValue.course_id !== null) {
      onSubmit(submitValue);
      console.log("HodOnsubmitCourse", submitValue.course_id);
    } else {
      Alert.alert("select minimum one value");
    }
  };
  return (
    <SafeAreaView style={styles.flex}>
      <Portal>
        <Modal
          visible={visible}
          contentContainerStyle={{
            ...styles.modalContainerStyle,
            height:
              categoryOpen || courseopen || hodCourseOpen
                ? 450
                : categoryValue === "Department"
                ? 500
                : categoryValue === "Courses"
                ? 580
                : categoryValue === "Year/Section"
                ? 560
                : categoryValue === "Your Classes"
                ? 600
                : groupopen
                ? 450
                : 250,
          }}
        >
          <Text style={styles.heading}>Add Recipients</Text>
          {categoryValue ? (
            <Text style={styles.headingBelow}>
              Selected Category : {categoryValue}
            </Text>
          ) : null}
          {categoryValue === "EntireCollege" ||
          categoryValue === "EntireDepartment" ||
          !categoryValue ||
          categoryValue === "Division" ||
          categoryValue === "Course" ||
          categoryValue === "Group" ? (
            <ScrollView style={[styles.container, containerStyle]}>
              <View>
                {categoryValue === "EntireDepartment" ||
                categoryValue === "EntireCollege" ||
                !categoryValue ? (
                  <DropDownPicker
                    open={categoryOpen}
                    value={categoryValue}
                    items={categoryItems?.map((item) => ({
                      label: item.catName,
                      value: item.catId,
                    }))}
                    setOpen={(x) => {
                      setcategoryOpen(x);
                      setgroupOpen(false);
                    }}
                    setValue={(x) => {
                      setcategoryValue(x);
                    }}
                    setItems={(x) => {
                      setcategoryItems(x);
                    }}
                    containerProps={{
                      height: categoryOpen ? 250 : undefined,
                    }}
                    renderListItem={renderListItem}
                    // searchPlaceholder="Search..."
                    showTickIcon={false}
                    itemKey="value"
                    placeholder="-- Select Category --"
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
                    ListEmptyComponent={({}) => (
                      <Text style={{ alignSelf: "center" }}>No Data found</Text>
                    )}
                  />
                ) : null}
                {categoryValue ? (
                  <>
                    {categoryValue && categoryValue === "Division" ? (
                      <DropDownPicker
                        multiple
                        multipleText={
                          selectedAllCourse
                            ? "All Division selected"
                            : "{count} Division selected"
                        }
                        min={0}
                        open={courseopen}
                        value={coursevalue}
                        items={courseitems.map((item) => ({
                          label:
                            item.division_name + " " + " " + item.division_code,
                          value: item.division_id,
                        }))}
                        onChangeValue={(value) => checkLastValue(value)}
                        loading={courseloading}
                        setOpen={(x) => {
                          setcourseOpen(x);
                        }}
                        onPress={(open) =>
                          console.log("was the picker open?", open)
                        }
                        setValue={(x) => {
                          setcourseValue(x);
                        }}
                        setItems={(x) => {
                          setcourseItems(x);
                        }}
                        containerProps={{
                          height: courseopen ? 250 : undefined,
                        }}
                        renderListItem={(props) =>
                          renderMulipleListItem({ ...props, coursevalue })
                        }
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
                        zIndex={6000}
                        zIndexInverse={1000}
                        ListEmptyComponent={({}) => (
                          <Text style={{ alignSelf: "center" }}>
                            No Data found
                          </Text>
                        )}
                      />
                    ) : null}
                    {categoryValue && categoryValue === "Group" ? (
                      <DropDownPicker
                        multiple
                        multipleText={
                          selectedAllGroup
                            ? "All Groups selected"
                            : "{count} Group selected"
                        }
                        min={0}
                        open={groupopen}
                        value={groupvalue}
                        items={groupitems.map((item) => ({
                          label: item.groupname,
                          value: item.groupid,
                        }))}
                        onChangeValue={(value) => checkLastValueForGroup(value)}
                        loading={grouploading}
                        setOpen={(x) => {
                          setgroupOpen(x);
                        }}
                        setValue={(x) => {
                          setgroupValue(x);
                        }}
                        setItems={(x) => {
                          setgroupItems(x);
                          // console.log(x);
                        }}
                        containerProps={{
                          height: groupopen ? 250 : undefined,
                        }}
                        renderListItem={(props) =>
                          renderMulipleListItemGroup({
                            ...props,
                            groupvalue,
                          })
                        }
                        searchPlaceholder="Search..."
                        showTickIcon={false}
                        itemKey="value"
                        placeholder="-- Select Group --"
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
                        zIndex={6000}
                        zIndexInverse={1000}
                        ListEmptyComponent={({}) => (
                          <Text style={{ alignSelf: "center" }}>
                            No Data found
                          </Text>
                        )}
                      />
                    ) : null}

                    {categoryValue && categoryValue === "Course" ? (
                      <DropDownPicker
                        multiple
                        multipleText={
                          selectedAllHodCourse
                            ? "All Courses selected"
                            : "{count} Course selected"
                        }
                        min={0}
                        open={hodCourseOpen}
                        value={hodCoursevalue}
                        items={hodCourseitems.map((item) => ({
                          label: item.course_name,
                          value: item.course_id,
                        }))}
                        onChangeValue={(value) =>
                          checkLastValueForHodCourse(value)
                        }
                        loading={hodCourseloading}
                        setOpen={(x) => {
                          sethodCourseOpen(x);
                        }}
                        setValue={(x) => {
                          sethodCourseValue(x);
                        }}
                        setItems={(x) => {
                          sethodCourseItems(x);
                          // console.log(x);
                        }}
                        containerProps={{
                          height: hodCourseOpen ? 250 : undefined,
                        }}
                        renderListItem={(props) =>
                          renderMulipleListItemHodCourse({
                            ...props,
                            hodCoursevalue,
                          })
                        }
                        searchPlaceholder="Search..."
                        showTickIcon={false}
                        itemKey="value"
                        placeholder="-- Select Courses --"
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
                        zIndex={6000}
                        zIndexInverse={1000}
                        ListEmptyComponent={({}) => (
                          <Text style={{ alignSelf: "center" }}>
                            No Data found
                          </Text>
                        )}
                      />
                    ) : null}
                  </>
                ) : null}
              </View>
            </ScrollView>
          ) : null}
          {categoryValue !== "EntireCollege" &&
          categoryValue === "Department" ? (
            <DepartmentSelect
              priority={priority}
              Divisionid={Divisionid}
              collegeId={collegeId}
              memberid={memberid}
              departmentId={departmentId}
              dataForCourse={deparmentPageData}
              setcategoryValue={setcategoryValue}
              onSubmit={onSubmit}
            />
          ) : null}
          {categoryValue !== "EntireCollege" && categoryValue === "Courses" ? (
            <YearSelect
              priority={priority}
              Divisionid={Divisionid}
              collegeId={collegeId}
              memberid={memberid}
              dataForCourse={deparmentPageData}
              setcategoryValue={setcategoryValue}
              onSubmit={onSubmit}
            />
          ) : null}

          {categoryValue !== "EntireCollege" &&
          categoryValue === "Year/Section" ? (
            <YearSectionSelect
              priority={priority}
              Divisionid={Divisionid}
              collegeId={collegeId}
              memberid={memberid}
              departmentId={departmentId}
              dataForCourse={deparmentPageData}
              setcategoryValue={setcategoryValue}
              onSubmit={onSubmit}
            />
          ) : null}
          {categoryValue !== "EntireCollege" &&
          categoryValue === "Your Classes" ? (
            <YourClassesSelection
              priority={priority}
              Divisionid={Divisionid}
              collegeId={collegeId}
              memberid={memberid}
              departmentId={departmentId}
              dataForCourse={deparmentPageData}
              setcategoryValue={setcategoryValue}
              onSubmit={onSubmit}
              visible={false}
            />
          ) : null}
          {/* </View> */}
          <View style={styles.buttonWrapper}>
            {categoryValue === "EntireDepartment" ||
            !categoryValue ||
            categoryValue === "EntireCollege" ? (
              <>
                <Button style={styles.cancelButton} onPress={onCancel}>
                  <Text style={[styles.actionButtonText]}>Cancel</Text>
                </Button>
                <Button
                  style={styles.submitButton}
                  onPress={() => {
                    // onSubmit(submitValue);
                    selectedCategoryValue();
                  }}
                >
                  <Text style={[styles.actionButtonText]}>Select</Text>
                </Button>
              </>
            ) : null}
            {(categoryValue && categoryValue === "Division") ||
            categoryValue === "Course" ||
            categoryValue === "Group" ? (
              <>
                <Button
                  style={styles.cancelButton}
                  onPress={() => {
                    setcourseOpen(false);
                    setcategoryValue(null);
                  }}
                >
                  <Text style={[styles.actionButtonText]}>Change Category</Text>
                </Button>
                <Button
                  style={styles.submitButton}
                  onPress={() => {
                    categoryValue === "Division" || categoryValue === "Course"
                      ? onSumbitValue()
                      : onSubmitGroup();
                  }}
                >
                  <Text style={[styles.actionButtonText]}>ADD</Text>
                </Button>
              </>
            ) : null}
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default InitialCategory;
const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
  },
  container: {
    // paddingHorizontal: 10,
    height: "100%",
  },
  flex: {
    flex: 1,
  },
  heading: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_FULL_LOW,
    marginBottom: 5,
    marginTop: 15,
  },
  headingBelow: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    marginBottom: 5,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    position: "relative",
    bottom: 0,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#1B82E1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
  },
  outlineButton: {
    flexDirection: "row",
    borderColor: "#1B82E1",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: "#BBBBBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 10,
    // marginRight: 15,
    marginLeft: 15,

    position: "absolute",
    bottom: 0,
    left: 10,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#18981B",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 25,
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  actionButtonText: {
    fontSize: Constants.FONT_BADGE,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
  actionButtonNotSelectedText: {
    fontSize: Constants.FONT_BADGE,
    fontFamily: FONT.primaryRegular,
    color: "#1B82E1",
  },
  seprator: {
    alignSelf: "center",
    color: "#B4B4B4",
    fontSize: Constants.FONT_BADGE,
  },
  selectWrapper: {
    marginVertical: 15,
  },
  placeholderStyle: {
    color: "#C0C0C0",
  },
  dropDownContainerStyle: {
    borderColor: "#D4D4D4",
    backgroundColor: "#F6FBFF",
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#D4D4D4",
  },
  searchTextInputStyle: {
    borderColor: "#D4D4D4",
  },
  searchContainerStyle: {
    borderBottomColor: "#F6FBFF",
  },
  iconContainerStyle: {
    marginRight: 10,
  },
});
