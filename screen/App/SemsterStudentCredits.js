import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Dimensions,
  Provider,
  Alert,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Constants, FONT, TOUCHABLE_ACTIVE_OPACITY } from '../../constants/constants';
import { getSemesterAndCourse, getCreditListForSingleSem, getCreditListForAllSemester } from '../../redux/actions/getSemesterAndCourse';
import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../../redux/app-config';
const HeaderArray = [

  'Category', 'Semester', 'Obtained', 'To be Obtained', 'Total Credits'
];
const SemesterAllHeaderArray = [
  'Obtained', 'To be Obtained', 'Total Credits'
];

const CellDataArray = [
  'Category', 'Semester'
];


const SemesterStudentCredits = ({ navigation, memberid, getSemester, getCreditListForSingleSem, getCreditListForAllSemester, collegeId, courseid }) => {
  const [loading, setLoading] = useState(true);
  const [semesterData, setSemesterData] = useState([]);
  const [semOpen, setSemOpen] = useState(false);
  const [semValue, setSemValue] = useState(0);
  const [tableHead, setTableHead] = useState([]);
  const [CellHead, setCellHead] = useState([]);

  const [CategoryNameCommon, setTableTitle] = useState([]);
  const [titleHight, setTitleHeight] = useState([]);
  const [semHeight, setSemHeight] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableSem, setTableSemester] = useState([]);
  const [tablefinal, setTablefinal] = useState([]);
  const [semesterCreditData, setsemesterCreditData] = useState([]);
  const [singleSemdata, setSingleSemData] = useState([]);

  const [tableHeadSemesterAll, setTableHeadSemesterAll] = useState([]);
  const MainData = []
  const CreditDetails = []
  var newArray = []
  var tableTitledata = []
  var tableSemdata = []
  const CategoryName = []
  var SemesterCatgoryName = []
  var SemAllList = []
  var SemAllCreditsDetails = []
  var SemesterNames = []
  var setsemestername = []
  var columnSemName = []
  var finalData = [];
  var titleHg = []
  var semHg = []
  var list = []
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    setLoading(true);
    getSemester({
      colgid: collegeId,
      i_course_id: courseid,

    })
      .then(data => {
        setLoading(false);
        setSemesterData(data);

      })
      .catch(msg => {
        setLoading(false);
        // Alert.alert(msg);
      });
  }, []);


  const changeValue = (value) => {
    console.log("value", value);

  };
  const renderButtons = (tablefinals) => {
    return (
      <>
        <View style={styles.btn}>
          <Text style={styles.btnText}>
            {tablefinals}
          </Text>
        </View>
      </>
    );

  }

  useEffect(() => {

    console.log("Semvalue", semValue);

    setLoading(true);

    if (semValue !== 0) {

      if (semValue === -5) {
        setLoading(true);

        getCreditListForAllSemester({
          colgid: collegeId,
          i_course_id: courseid,
          i_semester_id: semValue,
          i_student_id: memberid,
        })
          .then(result => {

            setLoading(false);

            setTableHeadSemesterAll(SemesterAllHeaderArray)

            const { Message, Status, data } = result;
            if (Status === 1) {
              console.log("SEMALL_Status", Status)
              console.log("SEMALL_RESPONSE", data)
              setsemesterCreditData(data)
              for (let i = 0; i < data.length; i++) {
                var catname = data[i].category_name;
                var catid = data[i].category_id;
                list = data[i].list;
                console.log('Listdata', list)

                var CategoryName = []
                var SemesterCatgoryName = []

                CategoryName.push(catname)
                for (let k = 0; k <= CategoryName.length; k++) {
                  SemesterCatgoryName = CategoryName.splice(0, CategoryName.length)
                  console.log("SemesterCatgoryName", JSON.stringify(SemesterCatgoryName))
                  tableTitledata.push(SemesterCatgoryName)

                  setTableTitle(tableTitledata)
                  console.log('listSize', list.length)
                  titleHg.push(list.length * 45)
                  setTitleHeight(titleHg)

                }


                for (let j = 0; j < list.length; j++) {
                  var catname = list[j].category_name;
                  var category_id = list[j].category_id;
                  var semName = list[j].semester_name;
                  var obtained = list[j].obtained;
                  var tobeobtained = list[j].to_be_obtained;
                  var credits = list[j].total_credits;

                  SemAllList.push(obtained, tobeobtained, credits)
                  SemesterNames.push(semName)

                  for (let x = 0; SemesterNames.length > 0; x++) {
                    setsemestername = SemesterNames.splice(0, SemesterNames.length)
                    columnSemName.push(setsemestername)
                    tableSem.push(setsemestername)

                    setTableSemester(columnSemName)
                    for (let z = 1; z <= tableSem.length; z++) {
                      semHg.push(45)
                      setSemHeight(semHg)

                    }

                  }
                  for (let l = 0; SemAllList.length > 0; l++) {
                    SemAllCreditsDetails = SemAllList.splice(0, SemAllList.length)
                    finalData.push(SemAllCreditsDetails)
                    const newFirstElement = [renderButtons('Obtained'), renderButtons('To be Obtained'), renderButtons('Total Credits')]
                    const newArray = [newFirstElement].concat(finalData)
                    // setTablefinal(finalData)
                    setTablefinal(newArray)


                  }
                }

              }
            }
            else {
              setsemesterCreditData(data)
              // Alert.alert(Message);

            }

          })
          .catch(msg => {

            setLoading(false);
            // Alert.alert(msg);
            console.log("Catch msg", msg);

          });

      }

      else if (semValue !== -5) {
        setLoading(true);

        getCreditListForSingleSem({
          colgid: collegeId,
          i_course_id: courseid,
          i_semester_id: semValue,
          i_student_id: memberid,
        }).then(response => {

          setLoading(false);

          const { Message, Status, data } = response;
          if (Status === 1) {
            tableSemdata =[]
            console.log("SingleSemResponse", data)
            // setSingleSemData(data)
            setsemesterCreditData(data)

            setTableHead(HeaderArray)
            setCellHead(CellDataArray)
            for (let i = 0; i < data.length; i++) {
              var catname = data[i].category_name;
              var semName = data[i].semester_name;
              var obtained = data[i].obtained;
              var tobeobtained = data[i].to_be_obtained;
              var credits = data[i].total_credits;
              var CreditDetails = []

              CreditDetails.push(catname, semName, obtained, tobeobtained, credits)

              for (let j = 0; CreditDetails.length > 0; j++) {
                newArray = CreditDetails.splice(0, CreditDetails.length)
                tableSemdata.push(newArray)
              }
            }
            
            setTableData(tableSemdata)


          }
          else {
            setsemesterCreditData(data)
            // Alert.alert(Message);
          }
        })
          .catch(msg => {
            setLoading(false);
            // Alert.alert(msg);
            console.log("msg", msg);

          });
      }

    }
  }, [semValue]);

  useEffect(() => {
    console.log('semesterCreditDatalenfgth', semesterCreditData.length)
    
  }, [semesterCreditData])



  return (

    <SafeAreaView style={styles.styleContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={{
            width: 50,
            height: 30,
            borderRadius: 60,
            justifyContent: 'center',
          }}
        >
          <Icons
            name="arrow-left"
            size={27}
            color={Constants.DARK_COLOR}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Semester Credit Points</Text>
      </View>

      <DropDownPicker
        placeholder={'-- Select Semester -- '}
        open={semOpen}
        value={semValue}
        items={semesterData?.map((item) => ({
          label: item.semseter_name,
          value: item.semester_id,
        }))}
        setOpen={setSemOpen}
        setValue={x => {
          setSemValue(x);
        }}

        setItems={(x) => {
          semesterData(x);

        }}
        containerProps={{
          height: semOpen ? 450 : undefined,
        }}
        onChangeValue={

          (value) => changeValue(value)

        }

        containerStyle={styles.containerStyle}
        dropDownContainerStyle={{ margin: 15 }}
        listMessageContainerStyle={{ margin: 15, marginBottom: 0 }}
        loading={loading}

        listMode="SCROLLVIEW"
        ActivityIndicatorComponent={({ color, size }) => (
          <ActivityIndicator color={color} size={size} />
        )}
        ListEmptyComponent={({ message }) => (
          <Text style={{ alignSelf: 'center' }}>No Data found</Text>
        )}
      />

      {
        !semOpen ? (

          <View style={styles.container}>
            {
              loading ? (
                <View
                  style={{
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner color="#3b5998" visible={loading} size="large" />
                </View>
              ) : (
                <ScrollView >
                  {
                    semesterCreditData.length > 0 ? (
                      semValue === -5 ? (

                        <View style={styles.containerTableAllSem}>

                          <Table
                            style={{
                              flexDirection: 'row',
                            }}
                            borderStyle={{ borderWidth: 1, borderColor: '#2F4C93' }}>
                            <TableWrapper>


                              <Row
                                data={['Category', 'Semester']}
                                style={styles.Categoryhead}
                                heightArr={semHeight}
                                // widthArr={[80, 80]}
                                textStyle={styles.headtext} />



                              <TableWrapper
                                style={{
                                  flexDirection: 'row',

                                }}>
                                <Col data={CategoryNameCommon}
                                  style={styles.head}
                                  heightArr={titleHight}
                                  widthArr={[80, 80]}
                                  textStyle={styles.text} />

                                <Col data={tableSem}
                                  style={styles.head}
                                  heightArr={semHeight}
                                  widthArr={[80, 80]}

                                  textStyle={styles.titleText}>

                                </Col>
                              </TableWrapper>
                            </TableWrapper>

                            <TableWrapper>

                              <Rows
                                data={tablefinal}
                                heightArr={semHeight}
                                widthArr={[60, 60, 60]}
                                textStyle={styles.text} />
                            </TableWrapper>

                          </Table>
                        </View>


                      ) : semValue !== -5 ? (

                        <View style={styles.containerTable}>

                          <Table
                            borderStyle={{ borderWidth: 1, borderColor: '#2F4C93' }}>

                            <TableWrapper>

                              <Row data={tableHead}
                                widthArr={[75, 65, 65, 65, 65]}
                                style={styles.singleSemhead}
                                textStyle={styles.headtext} />
                            </TableWrapper>
                            <Rows
                              data={tableData}
                              widthArr={[75, 65, 65, 65, 65]}
                              style={styles.tabledataStyle}
                              textStyle={styles.text}
                            />
                          </Table>
                        </View>

                      ) : null

                    ) : <View
                      style={{
                        height: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text>No data found</Text>
                    </View>
                  }
                </ScrollView>
              )}
          </View>


        ) : null
      }

      <View style={{ height: 100 }}></View>
    </SafeAreaView >

  );
};


const mapStatetoProps = ({ app }) => ({
  collegeId: app?.maindata?.colgid,
  courseid: app?.maindata?.courseid,
  memberid: app?.maindata?.memberid,

});
const mapDispatchToProps = (dispatch) => {
  return {
    getSemester: data => dispatch(getSemesterAndCourse(data)),
    getCreditListForAllSemester: data => dispatch(getCreditListForAllSemester(data)),
    getCreditListForSingleSem: data => dispatch(getCreditListForSingleSem(data)),


  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(SemesterStudentCredits);
const styles = StyleSheet.create({

  singleHead: {
    width: 40,
    height: 55,
    alignItems: 'center',
    // backgroundColor: '#a2cafa'
  },
  titleSem:
  {
    textAlign: 'center',
    width: 60,
    backgroundColor: '#f6f8fa'
  },
  titleText: {
    textAlign: 'center',
  },

  container:
  {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff'
  },

  containerTableAllSem:
  {
    padding: 7,
    backgroundColor: '#fff'
  },
  containerTable:
  {
    padding: 5,
    backgroundColor: '#fff'
  },
  head:
  {
    height: 45,
    width: 150,
  },
  Categoryhead:
  {
    height: 45,
    width: 150,

    backgroundColor: '#c8e1ff'

  },

  headtext:
  {
    fontFamily: FONT.primaryBold,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 2,

  },
  tabledataStyle:
  {
    height: 65,
    backgroundColor: '#fff'
  },
  text:
  {
    textAlign: 'center'
  },
  singleSemhead:
  {
    height: 55,
    backgroundColor: '#c8e1ff'
  },


  styleContainer: {
    flex: 1,
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  icon: {
    marginLeft: 15,
  },
  textStyle: {
    marginTop: 60,
  },
  containerStyle: {
    padding: 15,
  },

  btn: {
    width: 59,
    height: 44,

    backgroundColor: '#c8e1ff',
  },
  btnText: {

    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONT.primaryBold,


  }
});
