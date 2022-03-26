import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { connect } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Constants, FONT, TOUCHABLE_ACTIVE_OPACITY } from '../../constants/constants';
import { getCategorylist, getCategoryCreditsList } from '../../redux/actions/getSemesterAndCourse';


const HeaderArray = [
  'Category', 'Obtained', 'To be Obtained', 'Total Credits'
];
const widthArr = [
  120, 75, 75, 75
];

const CategoryCredit = ({ navigation, getCategorylist, getCategoryCreditsList, collegeId, courseid, memberid }) => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setcategoryData] = useState([]);
  const [CategoryOpen, setCategoryOpen] = useState(false);
  const [CategoryValue, setCategoryValue] = useState(null);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [categoryCreditData, setcategoryCreditData] = useState([]);
  const [tableTitle, setTableTitle] = useState([]);
  const catgoryTitle = []
  var newArray = []
  var tabledata = []

  useEffect(() => {
    setLoading(true);
    getCategorylist({
      colgid: collegeId,
      i_student_id: memberid,

    }).then(data => {
      setLoading(false);
      setcategoryData(data);
    })
      .catch(msg => {
        setLoading(false);
        Alert.alert(msg);
      });
  }, [categoryCreditData]);

  useEffect(() => {

    if (CategoryValue) {
      setLoading(true);

      console.log("CategoryValue", CategoryValue);
      setTableHead(HeaderArray)

      getCategoryCreditsList({
        colgid: collegeId,
        i_course_id: courseid,
        i_category_id: CategoryValue,
        i_student_id: memberid,
      }).then(result => {
        setLoading(false);

        const { Message, Status, data } = result;
        if (Status === 1) {
          setcategoryCreditData(data);

          console.log("GetCategoryCredit", data)
        }
        else {
          setcategoryCreditData(data);

        }
        for (let i = 0; i < data.length; i++) {
          var catname = data[i].category_name;
          var obtained = data[i].obtained;
          var tobeobtained = data[i].to_be_obtained;
          var credits = data[i].total_credits;
          catgoryTitle.push(catname, obtained, tobeobtained, credits)
          console.log('catgoryTitle', JSON.stringify(catgoryTitle));
          for (let j = 0; catgoryTitle.length > 0; j++) {
            newArray = catgoryTitle.splice(0, catgoryTitle.length)
            tabledata.push(newArray)
            setTableData(tabledata)
          }

        }
      })
        .catch(msg => {
          setLoading(false);
          // Alert.alert(msg);
          console.log("msg", msg);

        });

    }
  }, [CategoryValue]);
  useEffect(() => {
    console.log('CategoryCreditdata', categoryCreditData.length)
    
  }, [categoryCreditData])

  const changeValue = (value) => {
    console.log("value", value);

  };

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
        <Text style={styles.text}>Category Credit Points</Text>
      </View>

      <DropDownPicker
        placeholder={'-- Select Category --'}
        open={CategoryOpen}
        value={CategoryValue}
        items={categoryData?.map((item) => ({
          label: item.category_name,
          value: item.category_id,
        }))}
        setOpen={setCategoryOpen}
        setValue={x => {
          setCategoryValue(x);
        }}
        setItems={(x) => {
          setcategoryData(x);
        }}
        containerProps={{
          height: CategoryOpen ? 450 : undefined,
        }}
        onChangeValue={(value) => changeValue(value)}

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

      {CategoryValue && !CategoryOpen ? (

        <ScrollView >

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
          ) : (
            <View style={styles.container}>

              {categoryCreditData.length > 0 ? (

                <View>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: '#2F4C93' }}>

                    <TableWrapper>

                      <Row data={tableHead}
                        widthArr={widthArr}
                        style={styles.head}
                        textStyle={styles.headtext} />
                    </TableWrapper>
                    <Rows
                      data={tableData}
                      widthArr={widthArr}
                      style={styles.tabledataStyle}
                      textStyle={styles.text}
                    />
                  </Table>
                </View>

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
            </View>

          )}
        </ScrollView>
      ) : null}
      <View style={{ height: 120 }}></View>
    </SafeAreaView>

  );
};


const mapStatetoProps = ({ app }) => ({
  collegeId: app?.maindata?.colgid,
  courseid: app?.maindata?.courseid,
  memberid: app?.maindata?.memberid,

});
const mapDispatchToProps = (dispatch) => {
  return {
    getCategorylist: data => dispatch(getCategorylist(data)),
    getCategoryCreditsList: data => dispatch(getCategoryCreditsList(data)),

  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(CategoryCredit);
const styles = StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  container:
  {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff'
  },

  head:
  {
    height: 60,
    backgroundColor: '#c8e1ff'
  },
  headtext:
  {
    margin: 6,
    fontFamily: FONT.primaryBold,
    textAlign: 'center'
  },
  tabledataStyle:
  {
    height: 55,
    backgroundColor: '#fff'
  },
  text:
  {
    margin: 6,
    textAlign: 'center'
  },

  styleContainer: {
    flex: 1,
  },

  icon: {
    marginLeft: 15,
  },
  textStyle: {
    marginTop: 25,
  },
  containerStyle: {
    padding: 15,
  },

  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
});