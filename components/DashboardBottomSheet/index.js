/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Constants, FONT, ICON} from '../../constants/constants';

import {IMAGES} from '../../assests';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppConfig from '../../redux/app-config';
import {getSwipperColor, getSwipperHeader} from '../../utils/getConfig';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const bottomTabWidth = screenWidth / 4;

const getTabLists = list => {
  const menuItems = list.map(({name, id, order}) => {
    switch (name) {
      case 'Home':
        return {
          name: 'Home',
          icon: IMAGES.HomeImage,
          iconColor: '',
          page: AppConfig.SCREEN.DASHBOARD_HOME,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Communication':
        return {
          name: 'Communication',
          icon: IMAGES.CommunicationImage,
          iconColor: '',
          page: AppConfig.SCREEN.COMMUNICATON,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Examination':
        return {
          name: 'Examination',
          icon: IMAGES.ExaminationImage,
          iconColor: '',
          page: AppConfig.SCREEN.EXAMINATION_STACk?.NAME,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Attendance':
        return {
          name: 'Attendance',
          icon: IMAGES.AttendanceImage,
          iconColor: '',
          page: 'AttendanceScreen',
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Assignment':
        return {
          name: 'Assignment',
          icon: IMAGES.AssignmentImage,
          iconColor: '',
          page: AppConfig.SCREEN.ASSIGNMENT,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Circular':
        return {
          name: 'Circular',
          icon: IMAGES.CircularImage,
          iconColor: '',
          page: AppConfig.SCREEN.CIRCULAR_STACK?.NAME,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'NoticeBoard':
        return {
          name: 'Notice Board',
          icon: IMAGES.NoticeImage,
          iconColor: '',
          page: AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Events':
        return {
          name: 'Events',
          icon: IMAGES.EventsImage,
          iconColor: '',
          page: AppConfig.SCREEN.EVENT_STACK?.NAME,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Faculty':
        return {
          name: 'Faculty',
          icon: IMAGES.FacultyImage,
          iconColor: '',
          page: 'Faculty',
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Video':
        return {
          name: 'Video',
          icon: IMAGES.VideoImage,
          iconColor: '',
          page: 'Video',
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Chat':
        return {
          name: 'Chat',
          icon: IMAGES.ChatImage,
          iconColor: '',
          page: AppConfig.SCREEN.CHAT_HOME_SCREEN,
          style: {width: 40, height: 40},
          id,
          order,
        };
      case 'Conference':
        return {
          name: 'Conference',
          icon: IMAGES.ConferenceImage,
          iconColor: '',
          page: 'CollegeNotice',
          style: {width: 30, height: 30},
          id,
          order,
        };

      case 'Course Details':
        return {
          name: 'Course Details',
          icon: IMAGES.Credits,
          iconColor: '',
          page: AppConfig.SCREEN.DETAILS_FOR_SEMESTER,
          style: {width: 20 ,height: 20,alignSelf:'center'},
          id,
          order,
        };

        case 'Category Credit Points':
        return {
          name: 'Category Credit Points',
          icon: IMAGES.Category_credits,
          iconColor: '',
          page: AppConfig.SCREEN.CATEGORY_CREDITS,
          style: {width: 25, height: 25,alignSelf:'center'
,            },
          id,
          order,
        };

        case 'Exam Application Details':
          return {
            name: 'Exam Application Details',
            icon: IMAGES.Exam_Application_Details,
            iconColor: '',
            page: AppConfig.SCREEN.EXAM_APPLICATION_DEATILS_SCREEN,
            style: {width: 25, height: 25,alignSelf:'center'
  ,            },
            id,
            order,
          };

        case 'Sem Credit Points':
        return {
          name: 'Sem Credit Points',
          icon: IMAGES.Sem_credits,
          iconColor: '',
          page: AppConfig.SCREEN.SEMESTER_CREDITS_SCREEN,
          style:{width: 22, height: 22,alignSelf:'center',justifyContent:'center',
                     },
          id,
          order,
        };
    }
  });
  menuItems.sort((a, b) => {
    return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
  });
  return menuItems.length
    ? menuItems
    : [
        // {
        //   name: 'Home',
        //   icon: IMAGES.HomeImage,
        //   iconColor: '',
        //   page: AppConfig.SCREEN.DASHBOARD_HOME,
        //   style: {width: 40, height: 40},
        //   id: 1,
        //   order: 1,
        // },
        {
          name: 'Loading',
          icon: IMAGES.HomeImage,
          iconColor: '',
          page: AppConfig.SCREEN.DASHBOARD_HOME,
          style: {width: 40, height: 40},
          id: 1,
          order: 1,
        },
      ];
};

const DashboardBottomSheet = props => {
  const {navigation, maindata, menuList} = props;
  const {priority} = maindata;
  const modalizeRef = useRef(null);
  const [tabList, setTabList] = useState([]);
  const [swipeUp, setSwipeUp] = useState(null);
  useEffect(() => {
    setTabList(getTabLists(menuList));
  }, [menuList]);
  /**
   * showModal used to hide the flexion when the modal mounts.
   * note: flexion occurs when modal maxHeight more than 500.
   */
  const [showModal, setShowModal] = useState(false);
  const {hideSheet} = props.bottomSheetData;
  const toggleSwipe = () => setSwipeUp(prevState => !prevState);

  const totalTabsRowHeight = Math.ceil(tabList.length / 4) * 90;
  const modalMaxHeight =
    totalTabsRowHeight < screenHeight - 100
      ? totalTabsRowHeight
      : screenHeight - 100;

  const closeOptionModal = () => {
    if (!swipeUp) {
      modalizeRef.current?.close('alwaysOpen');
    }
  };

  const Header = () => (
    <View style={styles.header}>
      <ImageBackground
        source={getSwipperHeader(priority)}
        style={styles.backgroundImg}
      >
        <View style={styles.swipe}>
          <Text style={styles.tabText}>
            <Icons
              name={
                swipeUp || swipeUp === null
                  ? ICON.CHEVRON_UP
                  : ICON.CHEVRON_DOWN
              }
              size={16}
            />
          </Text>
          <Text style={styles.tabText}>Swipe</Text>
        </View>
      </ImageBackground>
    </View>
  );
  return (
    <>
      <Modalize
        ref={modalizeRef}
        modalHeight={modalMaxHeight}
        onLayout={event => {
          if (event.layout.height <= screenHeight) {
            setShowModal(true);
          }
        }}
        alwaysOpen={110}
        withHandle={false}
        modalStyle={[
          styles.sheetContainer,
          // eslint-disable-next-line react-native/no-inline-styles
          hideSheet ? {display: 'none'} : showModal ? null : {opacity: 0},
        ]}
        handleStyle={styles.handleStyle}
        onPositionChange={toggleSwipe}
        onBackButtonPress={closeOptionModal}
        panGestureComponentEnabled
        HeaderComponent={<Header />}
        childrenStyle={{
          backgroundColor: getSwipperColor(priority),
          width: '100%',
        }}
        overlayStyle={styles.overlayStyle}
      >
        <View style={tabList.length > 1 ? styles.tabWrapper : {width: '100%'}}>
          {tabList.map(tab => (
            <>
              {tab.name !== 'Loading' ? (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    navigation.navigate(tab.page);
                    modalizeRef.current?.close('alwaysOpen');
                    setSwipeUp(false);
                    // closeOptionModal();
                  }}
                >
                  <View style={styles.icon}>
                    {tab.icon ? (
                      <ImageBackground source={tab.icon} style={tab.style} />
                    ) : null}
                  </View>
                  <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    navigation.navigate(tab.page);
                    modalizeRef.current?.close('alwaysOpen');
                    setSwipeUp(false);
                    // closeOptionModal();
                  }}
                >
                  <View
                    style={[
                      styles.icon,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <ActivityIndicator color="blue" />
                    {/* {tab.icon ? (
                      <ImageBackground source={tab.icon} style={tab.style} />
                    ) : null} */}
                  </View>
                  <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
              )}
            </>
          ))}
        </View>
      </Modalize>
    </>
  );
};

const mapStateToPropes = ({app}) => {
  const {maindata, bottomSheetData, menuList} = app;
  return {
    maindata,
    bottomSheetData,
    menuList,
  };
};

export default connect(mapStateToPropes, null)(DashboardBottomSheet);

const styles = StyleSheet.create({
  container: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContainer: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  tabWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  tabText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
    marginTop: 4,
    alignSelf: 'center',
    textAlign:'center',
  },
  iconContainer: {
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: bottomTabWidth,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: Constants.WHITE_COLOR,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    height: 49,
    width: '100%',
    backgroundColor: 'transparent',
  },
  swipe: {
    position: 'absolute',
    left: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImg: {width: '100%', height: 50},
  overlayStyle: {backgroundColor: 'rgba(0, 0, 0, 0.7)'},
});
