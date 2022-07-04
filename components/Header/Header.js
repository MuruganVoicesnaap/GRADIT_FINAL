/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Constants, FONT, ICON } from "../../constants/constants";
import HeaderImg from "../../assests/images/GraditWhiteLogo.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import HeaderHuman from "../../assests/images/HeaderHuman.png";
import HeaderCollege from "../../assests/images/collegeIcon.png";
import { useNavigation } from "@react-navigation/native";
import { logOut } from "../../redux/actions/login";
import AppConfig from "../../redux/app-config";
import { getHeaderColor,PARENT,STUDENT } from "../../utils/getConfig";
import { setBottomSheetData } from "../../redux/actions/setBottomSheetData";
import RNFS from "react-native-fs";
//import RNFetchBlob from 'rn-fetch-blob';
import { SEARCH_VALUE } from "../../redux/types";
import { useFocusEffect } from "@react-navigation/native";
var debounce = require("lodash.debounce");

import ReactNativeBlobUtil from "react-native-blob-util";

const Header = ({
  onRefreshingPage,
  maindata,
  versionInfo,
  onSearch,
  searchText,
  searchData,
  triggerLogOut,
  bottomSheetAction,
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { priority, loginas, membername, colglogo } = maindata;
  const [searchEnabled, setsearchEnabled] = useState(false);
  const [text, setText] = useState("");

  console.log('maindata',maindata)
  console.log('membername',membername)

  useEffect(() => {
    if (text === "") {
      searchData(text);
    }
  }, [text]);
  // useEffect(() => {
  //   console.log('jkuyf');
  //   setText('');
  //   searchData('');
  // }, [onSearch]);
  useFocusEffect(
    useCallback(() => {
      setText("");
      searchData("");
      setsearchEnabled(false);
    }, [onSearch])
  );

  const setSearchData = debounce((textValue) => {
    searchData(textValue);
  });

  const textDispatch = (textValue) => {
    setText(textValue);
    setSearchData(textValue);
  };

  if (searchEnabled === true) {
    return (
      <>
        <StatusBar
          backgroundColor={getHeaderColor(priority)}
          barStyle={
            Platform.OS === "android" ? "light-content" : "dark-content"
          }
          translucent={false}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: getHeaderColor(priority) },
          ]}
        >
          <View
            style={{
              flex: 4,
              justifyContent: "center",
              height: 40,
            }}
          >
            <View style={styles.searchBar}>
              <Icon
                name={ICON.SEARCH}
                size={20}
                color={Constants.WHITE_COLOR}
                style={{ marginHorizontal: 5 }}
              />
              <TextInput
                style={{ flex: 1, color: Constants.WHITE_COLOR }}
                onChangeText={(textValue) => textDispatch(textValue)}
                value={text}
                placeholder="Search"
                placeholderTextColor={Constants.WHITE_COLOR}
                keyboardType="default"
              />
              <TouchableOpacity onPress={() => setText("")}>
                <Icon
                  name={ICON.CLOSE}
                  size={20}
                  color={Constants.WHITE_COLOR}
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TouchableOpacity onPress={() => setsearchEnabled(false)}>
              <Text style={[styles.modalText, { alignSelf: "center" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  const clearData = async () => {
    setModalVisible(!modalVisible);
    console.log("data");
    await RNFS.readDir(RNFS.CachesDirectoryPath)
      // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        console.log("GOT RESULT111", result);
      })
      .catch((err) => {
        if (err.message === "Folder does not exist") {
          Alert.alert("Already Cache cleared");
        } else {
          Alert.alert(err.message);
        }
      });
    await ReactNativeBlobUtil.fs.unlink(RNFS.CachesDirectoryPath).then(() => {
      console.log("cache deleted");
      Alert.alert("Successfully Cache cleared");
    });
  };
  const logoValid = colglogo.includes("png");
  return (
    <>
      <StatusBar
        backgroundColor={getHeaderColor(priority)}
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        translucent={false}
      />
      <Modal
        // animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          onPressOut={() => setModalVisible(!modalVisible)}
        >
          <TouchableOpacity style={styles.modalView}>
            <View style={styles.triangle} />
            <TouchableOpacity
              style={[styles.modalRow, styles.topSpace]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate(AppConfig.SCREEN.HOME);
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Change Roles</Text>
            </TouchableOpacity>

            {priority == PARENT || priority == STUDENT ? (
              <TouchableOpacity
                style={[styles.modalRow, styles.topSpace]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate(AppConfig.SCREEN.PROFILE, {
                    screenName: "Profile",
                  });
                }}
              >
                <Icon
                  name={ICON.USER}
                  size={20}
                  color={Constants.WHITE_COLOR}
                />
                <Text style={styles.modalText}>Profile</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                // console.log(props.versionInfo.faq, 'farrr');
                // Linking.openURL(props.versionInfo.faq);
                setModalVisible(!modalVisible);
                navigation.navigate("MyWeb", {
                  screenName: "FAQ",
                  pageUrl: versionInfo.faq,
                });
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate("MyWeb", {
                  screenName: "Help",
                  pageUrl: versionInfo.help,
                });
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                // console.log(props.versionInfo.privarypolicy, 'farrr');
                // Linking.openURL(props.versionInfo.privarypolicy);
                setModalVisible(!modalVisible);
                navigation.navigate("MyWeb", {
                  screenName: "Privary Policy",
                  pageUrl: versionInfo.privarypolicy,
                });
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                // console.log(props.versionInfo.termsandcondition, 'farrr');
                setModalVisible(!modalVisible);
                navigation.navigate("MyWeb", {
                  screenName: "Terms & Conditions",
                  pageUrl: versionInfo.termsandcondition,
                });
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalRow}
              onPress={() => {
                setModalVisible(!modalVisible);
                bottomSheetAction({ hideSheet: true });
                navigation.navigate(AppConfig.SCREEN.CHANGE_NEW_PASSWORD);
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalRow} onPress={clearData}>
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Clear App Cache</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalRow, styles.positionBottom]}
              onPress={() => {
                setModalVisible(!modalVisible);
                triggerLogOut();
              }}
            >
              <Icon name={ICON.USER} size={20} color={Constants.WHITE_COLOR} />
              <Text style={styles.modalText}>Logout</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <View
        style={[
          styles.container,
          { backgroundColor: getHeaderColor(priority) },
        ]}
      >
        <View style={{ flex: 2.5, justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              paddingLeft: "15%",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => navigation.navigate(AppConfig.SCREEN.HOME)}
          >
            <Image
              source={
                logoValid
                  ? {
                      uri: colglogo,
                    }
                  : HeaderCollege
              }
              style={{ height: 31, width: 32, borderRadius: 15 }}
            />
            <View style={{ paddingLeft: 5 }}>
              <Text
                style={{
                  fontSize: Constants.FONT_TEN,
                  fontWeight: Constants.FONT_WEI_BOLD,
                  color: Constants.WHITE_COLOR,
                }}
              >
                {membername.length > 15
                  ? membername.substring(0, 15 - 3) + "..."
                  : membername}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(AppConfig.SCREEN.HOME)}
                >
                  <Text
                    style={{
                      fontSize: Constants.FONT_BADGE,
                      fontWeight: "500",
                      color: Constants.WHITE_COLOR,
                    }}
                  >
                    {priority === "p1"
                      ? "Principal"
                      : priority === "p2"
                      ? "HOD"
                      : priority === "p3"
                      ? "Staff"
                      : priority === "p4"
                      ? "Student"
                      : priority === "p5"
                      ?"Parent" 
                      :"Non Teaching"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate(AppConfig.SCREEN.HOME)}
                >
                  {/* <Icon
                    name="arrow-drop-down"
                    size={20}
                    color={Constants.WHITE_COLOR}
                  /> */}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <GraditIcon />
        </View> */}
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: 'green',
            marginTop: 10,
          }}
        >
          <Image
            source={HeaderImg}
            style={{
              resizeMode: "contain",
              height: 70,
              width: 90,
              alignSelf: "center",
            }}
          />
        </View>
        <View style={{ flex: 3, justifyContent: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {onRefreshingPage ? (
              <TouchableOpacity onPress={onRefreshingPage}>
                <Icons
                  name={ICON.RELOAD}
                  size={22}
                  color={Constants.WHITE_COLOR}
                />
              </TouchableOpacity>
            ) : null}
            {onSearch ? (
              <TouchableOpacity onPress={() => setsearchEnabled(true)}>
                <Icon
                  name={ICON.SEARCH}
                  size={22}
                  color={Constants.WHITE_COLOR}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(AppConfig.SCREEN.NOTIFICATION);
              }}
            >
              <Icons name="bell" size={20} color={Constants.WHITE_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image source={HeaderHuman} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerLogOut: bindActionCreators(logOut, dispatch),
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
    searchData: (data) => dispatch({ type: SEARCH_VALUE, payload: data }),
  };
};

const mapStateToPropes = ({ app }) => {
  const { maindata, versionInfo, searchText } = app;
  return {
    maindata,
    versionInfo,
    searchText,
  };
};

export default connect(mapStateToPropes, mapDispatchToProps)(Header);

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: Constants.HEADER_COLOR,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 0,
    backgroundColor: Constants.DARK_COLOR,
    height: "50%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "50%",
    position: "absolute",
    right: 0,
    top: 57,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Constants.DARK_COLOR,
    marginTop: -8,
    marginLeft: "73%",
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 30,
    width: "100%",
    alignItems: "center",
    paddingLeft: 15,
    marginVertical: 3,
  },
  Text: {
    fontFamily: FONT.primaryRegular,
  },
  modalText: {
    fontFamily: FONT.primaryMedium,
    color: Constants.WHITE_COLOR,
    paddingLeft: 10,
  },
  topSpace: {
    marginTop: "10%",
  },
  positionBottom: {
    position: "absolute",
    bottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    marginLeft: 10,
    height: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Constants.WHITE_COLOR,
    borderRadius: 5,
    alignItems: "center",
  },
});
