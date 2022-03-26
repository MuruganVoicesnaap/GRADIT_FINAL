/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  VirtualizedList,
  Alert,
  ScrollView,
} from 'react-native';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NoticeCard from '../../../components/NoticeBoardCard/NoticeBoardCard';
import {NavTab} from '../../../components/Tab';
import {AddButton} from '../../../components/AddButton/AddButton';
import {
  addNoticeApi,
  noticeBoardData,
} from '../../../redux/actions/noticeBoard';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import AppConfig from '../../../redux/app-config';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import CommonCard from '../../../components/CommonCard';
import {appReadStatus} from '../../../redux/actions/appReadStatus';
import {stylesForEachTabs} from '../../../components/CommonStyles';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const CollegeNotice = ({
  navigation,
  priority,
  memberid,
  searchText,
  bottomSheetAction,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const [loading, setLoading] = useState(true);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [collegeNoticeList, setCollegeNoticeList] = useState([]);
  const [FilteredCollegeSource, setFilteredCollegeSource] =
    useState(collegeNoticeList);
  const [departmentNoticeList, setDepartmentNoticeList] = useState([]);

  const [FilteredDepartmentSource, setFilteredDepartmentSource] =
    useState(departmentNoticeList);
  const [selectedCard, setSelectedCard] = useState(-1);
  const isDataAvailable = isLeftTabSelected
    ? FilteredDepartmentSource.length !== 0
    : FilteredCollegeSource.length !== 0;

  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const filteredData = departmentNoticeList.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter),
        );
      });

      const newDataCollege = collegeNoticeList.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter),
        );
      });

      setFilteredDepartmentSource(filteredData);
      setFilteredCollegeSource(newDataCollege);
    } else {
      setFilteredDepartmentSource(departmentNoticeList);
      setFilteredCollegeSource(collegeNoticeList);
    }
  }, [searchText, collegeNoticeList, departmentNoticeList]);
  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        userid: memberid,
        appid: '1',
        priority: priority,
      };
      noticeBoardData({
        request,
        isCollegeCircular: false,
      })
        .then(({data}) => setDepartmentNoticeList(data))
        .then(() => setLoading(false));
      noticeBoardData({
        request,
        isCollegeCircular: true,
      })
        .then(({data}) => setCollegeNoticeList(data))
        .then(() => setLoading(false));
    }
  }, [memberid, priority, setDepartmentNoticeList, setCollegeNoticeList]);

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

  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, []),
  );
  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };
  const deleteConfirm = item =>
    Alert.alert('Delete Notice', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteNotice(item)},
    ]);
  const deleteNotice = item => {
    addNoticeApi({
      noticeboardid: item,
      colgid: '',
      receiveridlist: '',
      receivertype: '',
      topic: '',
      description: '',
      staffid: '',
      callertype: '',
      processtype: 'delete',
      isstudent: '',
      isparent: '',
      isstaff: '',
    })
      .then(() => {
        getData();
        Toast.show('Deleted Successfully', Toast.LONG);
      })
      .catch(() => {
        Toast.show('Not Fetched Successfully', Toast.LONG);
      });
  };

  const toggleCheck = (cardIndex, selectedCard, detailID, appRead) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
      statusChange(detailID, appRead);
    } else if (cardIndex === selectedCard) {
      console.log('toggleCheck else', cardIndex, selectedCard);
      setSelectedCard(-1);
    }
  };
  const statusChange = (detailID, appRead) => {
    if (Number(appRead) === 0) {
      appReadStatus({
        userid: memberid,
        msgtype: 'noticeboard',
        detailsid: detailID,
        priority: priority,
      }).then(console.log('read success'));
    }
  };
  const renderItem = ({item, index}) => {
    // console.log(item, 'item', item.id);
    return (
      <CommonCard
        title={item.topic}
        date={item.createdondate}
        time={item.createdontime}
        sentbyname={item.sentbyname}
        content={item.description}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        createdby={item.createdby}
        getData={getData}
        cardIndex={index}
        appReadStatus={item.isappread}
        endContent
        onPress={() =>
          toggleCheck(index, selectedCard, item.noticedetailsid, item.isappread)
        }
        deleteOnPress={() => deleteConfirm(item.noticeheaderid)}
        deleteButton
      />
    );
  };
  const onAddNotice = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_NOTICE_SCREEN);
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
          onRefresh(); //  isLeftTabSelected ? departmentNoticeList : collegeNoticeList
        }}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />
        <AnimatedSubheaderNav
          leftTab={
            <NavTab
              text="Department"
              active={isLeftTabSelected}
              count={departmentNoticeList.length}
            />
          }
          rightTab={
            <NavTab
              text="College"
              active={!isLeftTabSelected}
              count={collegeNoticeList.length}
            />
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Notice Board</Text>
                {departmentNoticeList.length + collegeNoticeList.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {departmentNoticeList.length + collegeNoticeList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* <Text style={styles.titleDescription}>
                {priority === 'p1' || priority === 'p2' || priority === 'p3'
                  ? 'Post the contents for Notice Board Department wise/College'
                  : 'Get to know what is on Department/College Notice Board'}
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
              justifyContent: 'center',
              alignItems: 'center',
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
            getItemCount={data => data.length}
            renderItem={renderItem}
            contentContainerStyle={styles.viewLastCard}
            keyExtractor={item => item.detailsid}
            refreshing={refreshing}
            onRefresh={onRefresh}
            //{...itemProps}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
              No data found
            </Text>
          </View>
        )}
      </ScrollView>
      {priority === 'p1' && !isLeftTabSelected ? (
        <AddButton onPress={onAddNotice} />
      ) : (priority === 'p2' || priority === 'p3') && isLeftTabSelected ? (
        <AddButton onPress={onAddNotice} />
      ) : null}
    </SafeAreaView>
  );
};
const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  searchText: app.searchText,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(CollegeNotice);
const styles = StyleSheet.create({
  ...stylesForEachTabs,
});
