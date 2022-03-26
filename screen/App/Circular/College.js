/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  VirtualizedList,
  Alert,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Spinner from "react-native-loading-spinner-overlay";
import AnimatedSubheaderNav from "../../../components/AnimatedSubheaderNav/index";
import Advertisement from "../../../components/Advertisement";
import Header from "../../../components/Header/Header";
import CircularCardComponent from "../../../components/Card/CircularCardView";
import { Constants, FONT } from "../../../constants/constants";
import { circularData } from "../../../redux/actions/circularData";
import { NavTab } from "../../../components/Tab";
import { setBottomSheetData } from "../../../redux/actions/setBottomSheetData";
import { AddButton } from "../../../components/AddButton/AddButton";
import AppConfig from "../../../redux/app-config";
import { useFocusEffect } from "@react-navigation/native";
import { stylesForEachTabs } from "../../../components/CommonStyles";
import CommonCard from "../../../components/CommonCard";
import { appReadStatus } from "../../../redux/actions/appReadStatus";
import { deleteCircular } from "../../../redux/actions/addCircular";
import Toast from "react-native-simple-toast";
import { openFile } from "../../DashboardHome/util/fileManager";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const CollegeCircular = ({
  navigation,
  searchText,
  priority,
  memberid,
  collegeid,
  bottomSheetAction,
}) => {
  const [loading, setLoading] = useState(true);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [collegeCircularList, setCollegeCircularList] = useState([]);
  const [departmentCircularList, setDepartmentCircularList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [FilteredCollegeSource, setFilteredCollegeSource] = useState(
    collegeCircularList
  );

  const [FilteredDepartmentSource, setFilteredDepartmentSource] = useState(
    departmentCircularList
  );
  const isDataAvailable = isLeftTabSelected
    ? FilteredDepartmentSource.length !== 0
    : FilteredCollegeSource.length !== 0;

  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        userid: memberid,
        appid: "2",
        priority,
      };
      circularData({
        request,
        isCollegeCircular: false,
      })
        .then(({ data }) => setDepartmentCircularList(data))
        .then(() => setLoading(false));
      circularData({
        request,
        isCollegeCircular: true,
      })
        .then(({ data }) => setCollegeCircularList(data))
        .then(() => setLoading(false));
    }
  }, [memberid, priority, setDepartmentCircularList, setCollegeCircularList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(100).then(() => setRefreshing(false));
  }, [getData]);

  useEffect(() => {
    if (memberid) {
      getData();
    }
  }, [memberid, getData]);

  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const newData = departmentCircularList.filter((item) => {
        return Object.keys(item).some((key) =>
          String(item[key]).toLowerCase().includes(lowercasedFilter)
        );
      });
      const newDataCollege = collegeCircularList.filter((item) => {
        return Object.keys(item).some((key) =>
          String(item[key]).toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredDepartmentSource(newData);
      setFilteredCollegeSource(newDataCollege);
    } else {
      setFilteredDepartmentSource(departmentCircularList);
      setFilteredCollegeSource(collegeCircularList);
    }
  }, [searchText, collegeCircularList, departmentCircularList]);
  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, [])
  );
  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const onAddCircular = () => {
    bottomSheetAction({ hideSheet: true });
    navigation.navigate(AppConfig.SCREEN.ADD_CIRCULAR_SCREEN);
  };

  const toggleCheck = (cardIndex, selectedCard, detailID, appRead) => {
    if (cardIndex !== selectedCard) {
      console.log("toggleCheck", cardIndex, selectedCard);
      setSelectedCard(cardIndex);
      statusChange(detailID, appRead);
    } else if (cardIndex === selectedCard) {
      console.log("toggleCheck else", cardIndex, selectedCard);
      setSelectedCard(-1);
    }
  };
  const statusChange = (detailID, appRead) => {
    if (Number(appRead) === 0) {
      appReadStatus({
        userid: memberid,
        msgtype: "circular",
        detailsid: detailID,
        priority: priority,
      }).then(console.log("read success"));
    }
  };
  const onDelete = (headerid) => {
    deleteCircular({
      headerid: headerid,
      userid: memberid,
      collegeid: collegeid,
    })
      .then((data) => {
        getData();
        Toast.show("Deleted successfully", Toast.LONG);
      })
      .catch((data) => {
        Toast.show("Failed to Fetch", Toast.LONG);
      });
  };
  const deleteConfirm = (headerid) =>
    Alert.alert("Delete Circular", "Once done can't be changed", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => onDelete(headerid) },
    ]);
  const openAttachment = (filePath) => {
    console.log(filePath[0]);
    setLoading(true);
    if (Array.isArray(filePath)) {
      console.log(filePath[0], "ARRAy");
      openFile(filePath[0], () => {
        setLoading(false);
      });
    } else {
      openFile(filePath[0], () => {
        setLoading(false);
      });
    }
  };
  const checkStatusOpen = (newfilepath) => {
    console.log(newfilepath);
    if (newfilepath.length > 1) {
      navigation.navigate("ViewCircular", {
        assignmentid: newfilepath,
      });
    } else {
      openAttachment(newfilepath);
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      // <CircularCardComponent
      //   key={item.detailsid}
      //   createdondate={item.createdondate}
      //   createdontime={item.createdontime}
      //   description={item.description}
      //   detailsid={item.detailsid}
      //   filePath={item.file_path}
      //   filetype={item.filetype}
      //   headerid={item.headerid}
      //   isappread={item.isappread}
      //   sentbyname={item.sentbyname}
      //   title={item.title}
      //   userfilename={item.userfilename}
      //   newfilepath={item.newfilepath}
      //   newuserfilename={item.newuserfilename}
      //   priority={priority}
      //   memberid={memberid}
      //   collegeid={collegeid}
      //   onPress
      //   getData={getData}
      //   selectedCard={selectedCard}
      //   setSelectedCard={setSelectedCard}
      //   cardIndex={index}
      // />
      <CommonCard
        title={item.title}
        date={item.createdondate}
        time={item.createdontime}
        sentbyname={item.sentbyname}
        content={item.description}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        createdby={item.createdby}
        cardIndex={index}
        appReadStatus={item.isappread}
        newfilepath={item.newfilepath}
        userfilename={item.userfilename}
        rowView
        attachment={true}
        pillBottomSpace
        onPressRowView={() => checkStatusOpen(item.newfilepath)}
        endContent
        onPress={() =>
          toggleCheck(index, selectedCard, item.detailsid, item.isappread)
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <Header
        onSearch
        onRefreshingPage={() => {
          onRefresh();
        }}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />
        <AnimatedSubheaderNav
          leftTab={
            <NavTab
              text="Department"
              active={isLeftTabSelected}
              count={departmentCircularList.length}
            />
          }
          rightTab={
            <NavTab
              text="College"
              active={!isLeftTabSelected}
              count={collegeCircularList.length}
            />
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>College Circular</Text>
                {departmentCircularList.length + collegeCircularList.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {departmentCircularList.length +
                        collegeCircularList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
              {priority == "p1" || priority == "p2" || priority == "p3" ? (
                <Text style={{ color: Constants.BLACK000, fontSize: 12 }}>
                  Below circulars are sent from the management. Circulars that you
                  send to students will not appear here.
                </Text>
              ) : null}
              {/* <Text style={styles.titleDescription}>
              {priority === 'p1' || priority === 'p2' || priority === 'p3'
                ? 'Send out images and Pdf Circulars'
                : 'Check out the Circular and Images from Department/College'}
            </Text> */}
            </>
          }
          onLeftTabPress={onLeftTabPress}
          onRightTabPress={onRightTabPress}
          leftTabWrapperStyle={
            isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
          rightTabWrapperStyle={
            !isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
        />
        {loading ? (
          <View
            style={{
              height: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner color="#3b5998" visible={loading} size="large" />
          </View>
        ) : isDataAvailable ? (
          <VirtualizedList
            data={
              isLeftTabSelected
                ? FilteredDepartmentSource
                : FilteredCollegeSource
            }
            initialNumToRender={5}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            renderItem={renderItem}
            contentContainerStyle={styles.viewLastCard}
            keyExtractor={(item) => item.detailsid}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // {...itemProps}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={[styles.title, { fontFamily: FONT.primaryRegular }]}>
              No data found
            </Text>
          </View>
        )}
      </ScrollView>
      {priority === "p1" && !isLeftTabSelected ? (
        <AddButton onPress={onAddCircular} />
      ) : (priority === "p2" || priority === "p3") && isLeftTabSelected ? (
        <AddButton onPress={onAddCircular} />
      ) : null}
    </SafeAreaView>
  );
};

const mapStatetoProps = ({ app }) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  collegeid: app.maindata?.colgid,
  searchText: app.searchText,
});

const mapDispatchToProps = (dispatch) => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(CollegeCircular);

const styles = StyleSheet.create({
  ...stylesForEachTabs,
});
