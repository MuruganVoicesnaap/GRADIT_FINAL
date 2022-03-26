/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import {connect} from 'react-redux';
import {getExamMarks} from '../../../redux/actions/exam';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

const Examination = ({memberid, route}) => {
  const {examData} = route?.params;
  const [studentMarkList, setStudentMarkList] = useState([
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '90'},
    // {subjectname: 'jjjj', marks: '70'},
    // {subjectname: 'jjjj', marks: '80'},
  ]);
  const navigation = useNavigation();

  useEffect(() => {
    if (memberid) {
      getData();
    }
  }, [memberid, getData]);
  const goBack = () => {
    navigation.goBack();
  };
  const getData = useCallback(() => {
    if (memberid) {
      const request = {
        studentid: memberid,
        examheaderid: examData?.headerid,
      };
      getExamMarks({
        request,
      }).then(({data}) => setStudentMarkList(data));
    }
  }, [memberid, examData?.headerid, setStudentMarkList]);

  const [columns, setColumns] = useState(['Name', 'Marks']);

  const tableHeader = () => (
    <View style={styles.tableHeader}>
      {columns.map((column, index) => {
        {
          return (
            <TouchableOpacity key={index} style={styles.columnHeader}>
              <Text style={styles.columnHeaderTxt}>{column + ' '}</Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />

        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>{examData?.examname}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={studentMarkList}
          style={{width: '100%', paddingBottom: '30%'}}
          keyExtractor={(item, index) => index + ''}
          ListHeaderComponent={tableHeader}
          stickyHeaderIndices={[0]}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  ...styles.tableRow,
                  backgroundColor:
                    index % 2 == 1
                      ? Constants.GREY_COLOR
                      : Constants.WHITE_COLOR,
                }}
              >
                <Text style={{...styles.columnRowTxt}}>{item.subjectname}</Text>
                <Text style={styles.columnRowTxt}>{item.marks}</Text>
              </View>
            );
          }}
        />
        {studentMarkList.length === 0 ? (
          <View
            style={{
              justifyContent: 'center',
              height: 350,
              alignItems: 'center',
            }}
          >
            <Text>No data Found</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStatetoProps = ({app}) => ({
  memberid: app.maindata?.memberid,
});
export default connect(mapStatetoProps, null)(Examination);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
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
    paddingHorizontal: '5%',
    paddingVertical: '5%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    height: 50,
  },
  tableRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  columnHeader: {
    width: '50%',
    justifyContent: 'center',
    paddingLeft: '5%',
  },
  columnHeaderTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  columnRowTxt: {
    width: '50%',
    paddingLeft: '5%',
  },
});
