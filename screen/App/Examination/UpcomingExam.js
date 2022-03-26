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
import {NavTab} from '../../../components/Tab';
import ExamCard from '../../../components/ExamCard/ExamCard';
import PastExamCard from '../../../components/ExamCard/PastExamCard';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {createExamDetails, examdData} from '../../../redux/actions/exam';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import AppConfig from '../../../redux/app-config';
import {AddButton} from '../../../components/AddButton/AddButton';
import {stylesForEachTabs} from '../../../components/CommonStyles';
import CommonCard from '../../../components/CommonCard';
import capitializeFirstChar from '../../DashboardHome/util/capitializeFirstChar';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const UpcomingExam = ({
  navigation,
  priority,
  memberid,
  colgid,
  deptid,
  sectionid,
  searchText,
  bottomSheetAction,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [upcomingExamList, setUpcomingExamList] = useState([]);
  const [pastExamList, setPastExamList] = useState([]);

  const [selectedCard, setSelectedCard] = useState(-1);
  const [loading, setLoading] = useState(true);

  const [FilteredReadSource, setFilteredReadSource] = useState(pastExamList);

  const [FilteredUnreadSource, setFilteredUnreadSource] =
    useState(upcomingExamList);
  const isDataAvailable = isLeftTabSelected
    ? FilteredUnreadSource.length !== 0
    : FilteredReadSource.length !== 0;
  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const newData = upcomingExamList.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter),
        );
      });

      const newDataCollege = pastExamList.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter),
        );
      });

      setFilteredUnreadSource(newData);
      setFilteredReadSource(newDataCollege);
    } else {
      setFilteredUnreadSource(upcomingExamList);

      setFilteredReadSource(pastExamList);
    }
  }, [searchText, pastExamList, upcomingExamList]);

  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        userid: memberid,
        appid: '1',
        priority: priority,
        collegeid: colgid,
        departmentid: deptid ? deptid : 0,
        sectionid: sectionid ? sectionid : 0,
      };
      examdData({
        request,
        isUpcomingExam: false,
        priority,
      })
        .then(({data}) => setPastExamList(data))
        .then(() => setLoading(false));
      examdData({
        request,
        isUpcomingExam: true,
        priority,
      })
        .then(({data}) => setUpcomingExamList(data))
        .then(() => setLoading(false));
    }
  }, [
    memberid,
    priority,
    colgid,
    deptid,
    sectionid,
    setPastExamList,
    setUpcomingExamList,
  ]);
  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, []),
  );
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

  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
  };

  const toggleCheck = (cardIndex, selectedCard) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
    } else if (cardIndex === selectedCard) {
      console.log('toggleCheck else', cardIndex, selectedCard);
      setSelectedCard(-1);
    }
  };
  const checkExamOnPress = headerid => {
    if (isLeftTabSelected) {
      navigation.navigate('ExamListScreen', {
        examId: headerid,
        edit: false,
      });
      bottomSheetAction({hideSheet: true});
    } else if (!isLeftTabSelected && priority !== 'p4' && priority !== 'p5') {
      navigation.navigate('ExamListScreen', {
        examId: headerid,
        edit: false,
      });
      bottomSheetAction({hideSheet: true});
    } else {
      navigation.navigate('ExaminationScreen', {
        examData: headerid,
      });
    }
  };

  const deleteConfirm = (headerid, examName) =>
    Alert.alert(
      `Delete Exam \n${capitializeFirstChar(examName)} `,
      "Once done can't be changed",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteExam(headerid, examName)},
      ],
    );
  const deleteExam = (headerid, examName) => {
    createExamDetails({
      collegeid: '',
      examid: headerid,
      examname: examName,
      staffid: memberid,
      startdate: '',
      enddate: '',
      processtype: 'delete',
      sectiondetails: [],
    })
      .then(data => {
        getData();
        Toast.show('Deleted successfully', Toast.LONG);
      })
      .catch(data => {
        Toast.show('Failed to Fetch', Toast.LONG);
      });
    console.log(headerid);
  };

  const renderItem = ({item, index}) => {
    let dateOnly = moment(item?.createdon).format('DD MMM YYYY');
    let timeOnly = moment(item?.createdon).format('HH.mm  A');
    return (
      // <ExamCard
      //   item={item}
      //   date={item.date}
      //   examname={item.examname}
      //   examvenue={item.examvenue}
      //   headerid={item.headerid}
      //   session={item.session}
      //   subjectname={item.subjectname}
      //   syllabus={item.syllabus}
      //   createdon={item.createdon}
      //   createdbyname={item.createdbyname}
      //   startdate={item.startdate}
      //   enddate={item.enddate}
      //   priority={priority}
      //   memberid={memberid}
      //   getData={getData}
      // />
      <CommonCard
        title={item.examname}
        date={priority !== 'p4' && priority !== 'p5' ? dateOnly : item.date}
        time={priority !== 'p4' && priority !== 'p5' ? timeOnly : item.session}
        sentbyname={item.createdbyname}
        selectedCard={selectedCard}
        createdby={item.createdby}
        cardIndex={index}
        onPress={() => toggleCheck(index, selectedCard)}
        editButton
        editOnPress={() => {
          navigation.navigate('ExamListScreen', {
            examId: item.headerid,
            edit: true,
            createdbyId: item?.createdby,
          });

          bottomSheetAction({hideSheet: true});
        }}
        viewButton
        viewOnPress={() =>
          !isLeftTabSelected && (priority === 'p4' || priority === 'p5')
            ? checkExamOnPress(item)
            : checkExamOnPress(item.headerid)
        }
        deleteButton
        deleteOnPress={() => deleteConfirm(item.headerid, item.examname)}
        noMarking={true}
        content={
          item?.syllabus
            ? `Venue     : ${capitializeFirstChar(
                item.examvenue,
              )} \nSyllabus  : ${capitializeFirstChar(item.syllabus)}`
            : `Start Date :${item.startdate}\nEnd Date : ${item.enddate}`
        }
      />
    );
  };

  // const renderPastItem = ({item}) => (
  //   <PastExamCard
  //     date={item.date}
  //     headerid={item.headerid}
  //     examname={item.examname}
  //     examvenue={item.examvenue}
  //     session={item.session}
  //     subjectname={item.subjectname}
  //     syllabus={item.syllabus}
  //     startdate={item.startdate}
  //     enddate={item.enddate}
  //     createdon={item.createdon}
  //     createdbyname={item.createdbyname}
  //     priority={priority}
  //     onPress={() =>
  //       navigation.navigate('ExaminationScreen', {
  //         examData: item,
  //       })
  //     }
  //   />
  // );
  const onAddExam = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_EXAM);
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
          rightTab={
            <NavTab
              text="Past"
              active={!isLeftTabSelected}
              count={pastExamList.length}
            />
          }
          leftTab={
            <NavTab
              text="Upcoming"
              active={isLeftTabSelected}
              count={upcomingExamList.length}
            />
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Exams</Text>
                {pastExamList.length + upcomingExamList.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {pastExamList.length + upcomingExamList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* <Text style={styles.titleDescription}>
                {priority === 'p1' || priority === 'p2' || priority === 'p3'
                  ? 'Create Exam Schedule and share with Students from here'
                  : 'Receive your Exam Schedules and Exam Marks here'}
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
              !isLeftTabSelected ? FilteredReadSource : FilteredUnreadSource
            }
            renderItem={renderItem}
            // {!isLeftTabSelected ? renderPastItem : renderItem}
            initialNumToRender={5}
            getItem={(data, index) => data[index]}
            getItemCount={data => data.length}
            contentContainerStyle={styles.viewLastCard}
            keyExtractor={item => item.detailsid}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // {...itemProps}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
              No data found
            </Text>
          </View>
        )}
      </ScrollView>
      {(priority === 'p1' || priority === 'p2' || priority === 'p3') &&
        isLeftTabSelected && <AddButton onPress={onAddExam} />}
    </SafeAreaView>
  );
};
const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  colgid: app.maindata?.colgid,
  deptid: app.maindata?.deptid,
  sectionid: app.maindata?.sectionid,
  searchText: app.searchText,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(UpcomingExam);
const styles = StyleSheet.create({
  ...stylesForEachTabs,
});
