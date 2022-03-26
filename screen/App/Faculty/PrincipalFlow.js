
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import AppConfig from '../../../redux/app-config';
import FacultyCard from './FacultyCard';
import DropDown from '../../../components/DropDown/DropDown';
import { Provider } from 'react-native-paper';
import {

  getDepartmentByDivisionList,

} from '../../../redux/actions/getCourseList';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const getCourseItems = data => {
  return data.map(({ division_id, division_name }) => {
    return {
      label: division_name,
      value: division_id,
    };
  });
};

const getDeptItems = data => {
  return data.map(({ department_id, department_name }) => {
    return {
      label: department_name,
      value: department_id,
    };
  });
};

const PrincipalFlow = ({
  priority,
  memberid,
  collegeId,
  divisionData,
  departmentData,
  getDepartmentByDivisionList, }) => {
  const [items, setItem] = useState([]);
  const [courseOpen, setCourseOpen] = useState(false);
  const [courseValue, setCourseValue] = useState(null);
  const [courseItems, setCourseItems] = useState([]);

  const [deptOpen, setDeptOpen] = useState(false);
  const [deptValue, setDeptValue] = useState(null);
  const [deptItems, setDeptItems] = useState([]);

  useEffect(() => {
    setCourseItems(getCourseItems(divisionData));
    console.log('testDivision', divisionData)

  }, [divisionData]);

  const getList = () => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.PRINCIPAL_FACULTU_LIST}`,
      'POST',
      false,
      {
        userid: memberid,
        appid: '1',
        priority,
        deptid: deptValue,
        // courseid: courseValue,
      },
      res => {
        const { Status, data } = res;
        if (Status === 1) {
          setItem(data);
        }
      },
    );
  };
  useEffect(() => {

    setDeptItems(getDeptItems(departmentData));
    console.log('depUse', departmentData)

  }, [departmentData]);

  useEffect(() => {
    if (
      courseValue &&
      courseItems.length !== 0
    ) {

      getDepartmentByDivisionList({
        user_id: memberid,
        college_id: collegeId,
        div_id: courseValue,
      })
      setDeptItems(getDeptItems( departmentData));

    }
  }, [courseValue]);
  useEffect(() => {
    setDeptValue(null);
    setItem([]);
    setDeptItems(getDeptItems(departmentData));
  }, [courseValue]);
  useEffect(() => {
    if (deptValue) {
      getList();
    }
  }, [deptValue]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getList();
    wait(100).then(() => setRefreshing(false));
  };
  return (
    <Provider>
      <View
        style={
          items.length !== 0 && !deptOpen ? styles.cardRoot : styles.noRecord
        }
      >
        <View>
         
          <DropDownPicker
            placeholder={'Select Division'}
            open={courseOpen}
            value={courseValue}
            items={courseItems}
            setOpen={setCourseOpen}
            setValue={x => {
              setCourseValue(x);
              setDeptValue(null);
            }}
            containerProps={{
              height: courseOpen ? 250 : undefined,
            }}
            containerStyle={styles.containerStyle}
            dropDownContainerStyle={{ margin: 15 }}
            listMessageContainerStyle={{ margin: 15, marginBottom: 0 }}
            listMode="SCROLLVIEW"
            ListEmptyComponent={({ message }) => (
              <Text style={{ alignSelf: 'center' }}>No Data found</Text>
            )}
          />
        </View>

        <View>
          {!courseOpen && (
            <DropDownPicker
              placeholder={'Select Department'}
              open={deptOpen}
              value={deptValue}
              items={deptItems}
              setOpen={setDeptOpen}
              setValue={setDeptValue}
              containerStyle={styles.containerStyle}
              dropDownContainerStyle={{ margin: 15 }}
              listMessageContainerStyle={{ margin: 15, marginBottom: 0 }}
              listMode="SCROLLVIEW"
              ListEmptyComponent={({ message }) => (
                <Text style={{ alignSelf: 'center' }}>No Data found</Text>
              )}
            />
          )}
        </View>
        {items.length !== 0 && !deptOpen && deptValue !== null ? (
          <FlatList
            data={items}
            style={styles.flatList}
            renderItem={props => (
              <FacultyCard
                title={props.item.stafftype}
                subTitle={props.item.staffname}
                profile={props.item.facultyphoto}
                priority={priority}
              />
            )}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : !deptOpen ? (
          <Text style={styles.textStyle}>No data found</Text>
        ) : null}
      </View>
    </Provider>
  );
};

const mapStateToPropes = ({ app }) => {
  const { maindata, divisionData = [] ,departmentData=[]} = app;
  
  return {
    ...maindata,
    collegeId: app?.maindata?.colgid,
    divisionData,
    departmentData,
  };
};

export default connect(mapStateToPropes, { getDepartmentByDivisionList})(PrincipalFlow);

const styles = StyleSheet.create({
  cardRoot: {
    marginTop: 10,
    paddingBottom: 10,
    height: '100%',
  },
  flatList: {
    marginTop: 25,
    paddingBottom: 250,
  },
  noRecord: {
    flex: 1,
    alignItems: 'center',
    height: 400,
  },
  textStyle: {
    marginTop: 25,
  },
  containerStyle: {
    padding: 15,
  },
});

