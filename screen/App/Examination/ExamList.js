/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import {examDetails} from '../../../redux/actions/exam';
import ExamListCard from '../../../components/ExamCard/ExamListCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import {subjectListData} from '../../../redux/actions/subjectListSection';
import {AddButton} from '../../../components/AddButton/AddButton';
import moment from 'moment';

const ExamListScreen = ({
  route,
  navigation,
  colgid,
  semId,
  memberid,
  bottomSheetAction,
}) => {
  const [examList, setExamList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [sectionDiff, setSectionDiff] = useState('');
  const [subjectList, setSubjectList] = useState([]);

  const arr = [];
  const arrEntire = [];
  const getData = useCallback(() => {
    setRefreshing(true);
    examDetails({
      examid: route?.params?.examId,
      staffid: memberid,
      collegeid: colgid,
    }).then(({data}) => {
      setExamList(data);
      for (let d = 0; d < data.length; d++) {
        arr.push(data[d].clgsectionid);
      }
      getSeclist(data[0].semesterid);

      setRefreshing(false);
    });
  }, [memberid, setExamList]);
  const getSeclist = useCallback(
    value => {
      setRefreshing(true);
      const request = {
        userid: memberid,
        appid: '1',
        semesterid: value,
      };
      subjectListData({
        request,
      }).then(({data}) => {
        setSubjectList(data);
        for (let d = 0; d < data.length; d++) {
          arrEntire.push(data[d].sectionid);
        }

        let difference = arrEntire
          .filter(x => !arr.includes(x))
          .concat(arr.filter(x => !arrEntire.includes(x)));
        setSectionDiff(difference);
        setRefreshing(false);
      });
    },
    [memberid, setSectionList],
  );

  useEffect(() => {
    getData();
  }, [getData]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
  }, [getData]);
  const renderItem = item => {
    const examNameFor = item.item.examnm;
    const examSectionFor = item.item.clgsectionid;
    // console.log('itemm', item.item);
    const dateStart = moment(examList[0].startdate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
    const dateEnd = moment(examList[0].enddate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
    const subjectdetailsArray = item.item.subjectdetails;
    const sectionId = item.item.clgsectionid;
    const clgdepartmentId = item.item.clgdepartmentid;
    const examId = item.item.examheaderid;
    // console.log(item.item);
    return (
      <ExamListCard
        item={item.item}
        examnm={item.item.examnm}
        startdate={item.item.startdate}
        enddate={item.item.enddate}
        coursename={item.item.coursename}
        clgdepartmentname={item.item.clgdepartmentname}
        yearname={item.item.yearname}
        semesterid={item.item.semesterid}
        semestername={item.item.semestername}
        clgsectionid={item.item.clgsectionid}
        clgsectionname={item.item.clgsectionname}
        examheaderid={item.item.examheaderid}
        edit={route?.params?.edit}
        colgid
        memberid={memberid}
        getData={getData}
        onEditPress={() => {
          navigation.navigate('CreateExam', {
            examName: examList[0].examnm,
            startDate: examList[0].startdate,
            endDate: examList[0].enddate,
            startingDate: dateStart,
            endingDate: dateEnd,
            filteredDataSub: subjectList,
            difference: sectionDiff.length !== 0 ? sectionDiff : '',
            editSubjectOnly: true,
            edit: true,
            editSectionid: sectionId,
            subjectdetails: subjectdetailsArray,
            clgsectionid: sectionId,
            clgdepartmentid: clgdepartmentId,
            examheaderid: examId,
          });
          bottomSheetAction({hideSheet: true});
        }}
        onPress={() => {
          navigation.navigate('SubjectListScreen', {
            examId: route?.params?.examId,
            examName: examNameFor,
            examSectionId: examSectionFor,
          });

          // bottomSheetAction({hideSheet: true});
        }}
      />
    );
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => goBack()},
    ]);
    return true;
  };
  const goBack = () => {
    navigation.goBack();
    bottomSheetAction({hideSheet: false});
  };
  const onAddExam = () => {
    const dateStart = moment(examList[0].startdate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
    const dateEnd = moment(examList[0].enddate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
    // console.log(examList);
    navigation.navigate('CreateExam', {
      examName: examList[0].examnm,
      startDate: examList[0].startdate,
      endDate: examList[0].enddate,
      startingDate: dateStart,
      endingDate: dateEnd,
      filteredDataSub: subjectList,
      difference: sectionDiff.length !== 0 ? sectionDiff : '',
      editSubjectOnly: false,
      addSection: true,
      examheaderid: examList[0].examheaderid,
      deptValue: examList[0].clgdepartmentid,
    });
    bottomSheetAction({hideSheet: true});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header />
      <Advertisement />
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <View style={styles.pageHeader}>
          <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
          <Text style={styles.pageHeaderText}>Exam List</Text>
          {examList.length ? (
            <View style={styles.badge}>
              <Text style={styles.buttonTextBadge}>{examList.length}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {examList.length ? (
        <FlatList
          data={examList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.viewLastCard}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.noData}>
          <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
            No data found
          </Text>
        </View>
      )}
      {sectionDiff.length !== 0 &&
      memberid === Number(route?.params?.createdbyId) ? (
        <AddButton onPress={onAddExam} />
      ) : null}
    </SafeAreaView>
  );
};
const mapStatetoProps = ({app}) => ({
  memberid: app.maindata?.memberid,
  colgid: app.maindata?.colgid,
  semId: app.maindata?.semesterid,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(ExamListScreen);
const styles = StyleSheet.create({
  pageHeader: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    paddingLeft: 10,
  },
  textHead: {
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
  },
  topHead: {
    backgroundColor: Constants.GREY001,
    width: 120,
    height: 30,
    marginVertical: 5,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.TEXT_INPUT_COLOR,
    marginLeft: '4%',
    marginRight: '4%',
  },
  verticalLineCard: {
    borderLeftWidth: 2,
  },
  horizontalLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Constants.BLACK000,
    width: '50%',
    marginVertical: '4%',
    marginBottom: '2%',
  },
  postedName: {
    color: Constants.BLACK000,
    fontSize: Constants.FONT_TEN,
    lineHeight: 12,
    fontFamily: FONT.primaryRegular,
  },
  footer: {
    paddingTop: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },

  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextBadge: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
  },

  viewLastCard: {
    paddingBottom: '50%',
  },
});
