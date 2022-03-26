/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  BackHandler,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import {subjectListForExamEdit} from '../../../redux/actions/exam';
import ExamSubCard from '../../../components/ExamCard/ExamSubCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const SubjectListScreen = ({
  route,
  navigation,
  memberid,
  bottomSheetAction,
}) => {
  const [subjectList, setSubjectList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const {examName} = route?.params;
  const windowHeight = useWindowDimensions().height;
  const getData = useCallback(() => {
    subjectListForExamEdit({
      examid: route?.params?.examId,
      sectionid: route?.params?.examSectionId,
    }).then(({data}) => setSubjectList(data));
  }, [memberid, setSubjectList]);

  useEffect(() => {
    getData();
  }, [getData]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(100).then(() => setRefreshing(false));
  }, [getData]);
  const renderItem = item => {
    return (
      <ExamSubCard
        examsubjectid={item.item.examsubjectid}
        examname={examName}
        date={item.item.examdate}
        syllabus={item.item.examsyllabus}
        examvenue={item.item.examvenue}
        session={item.item.examsession}
        subjectname={item.item.examsubjectname}
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

    bottomSheetAction({hideSheet: true});
  };
  return (
    <SafeAreaView>
      <Header />
      <Advertisement />
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <View style={styles.pageHeader}>
          <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
          <Text style={styles.pageHeaderText}>Subject List</Text>
          {subjectList.length ? (
            <View style={styles.badge}>
              <Text style={styles.buttonTextBadge}>{subjectList.length}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {subjectList.length ? (
        <FlatList
          data={subjectList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={[styles.viewLastCard, {height: windowHeight - 230}]}
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
    </SafeAreaView>
  );
};
const mapStatetoProps = ({app}) => ({
  memberid: app.maindata?.memberid,
  colgid: app.maindata?.colgid,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(SubjectListScreen);
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
    paddingBottom: '30%',
  },
});
