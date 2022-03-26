/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import AppConfig from '../../../redux/app-config';
import FacultyCard from './FacultyCard';
import DropDown from '../../../components/DropDown/DropDown';
import {Provider} from 'react-native-paper';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const getSemAndSubList = request => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_SEM_AND_SECTIONS}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};
const getSemItems = data => {
  return data.map(({clgsemesterid, semestername}) => {
    return {
      label: semestername,
      value: clgsemesterid,
    };
  });
};

const getSecItems = (data, value) => {
  const filteredData = data.filter(a => a.clgsemesterid === value);
  return filteredData.length
    ? filteredData[0].sectiondetails.map(({sectionid, sectionname}) => {
        return {
          label: sectionname,
          value: sectionid,
        };
      })
    : [];
};
const OtherFlow = ({priority, yearid, memberid}) => {
  const [items, setItem] = useState([]);
  const [semOpen, setSemOpen] = useState(false);
  const [semValue, setSemValue] = useState(null);
  const [semItems, setSemItems] = useState([]);
  const [semesterloading, setsemesterLoading] = useState(false);

  const [secOpen, setSecOpen] = useState(false);
  const [secValue, setSecValue] = useState(null);
  const [secItems, setSecItems] = useState([]);
  const [dataInit, setDataInit] = useState([]);
  useEffect(() => {
    setsemesterLoading(true);
    getSemAndSubList({
      yearid: yearid,
    })
      .then(respose => {
        const {Status, data} = respose;
        if (Status === 1) {
          console.log(data[0].sectiondetails);
          setDataInit(data);
          setSemItems(getSemItems(data));
        }
      })
      .then(respose => setsemesterLoading(false))
      .catch(() => {
        setsemesterLoading(false);
      });
  }, [yearid]);
  const getList = () => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.FACULTY_LIST_OTHER}`,
      'POST',
      false,
      {
        userid: memberid,
        appid: '1',
        priority,
        sectionid: secValue,
        semesterid: semValue,
      },
      res => {
        const {Status, data} = res;
        if (Status === 1) {
          setItem(data);
        }
      },
    );
  };
  useEffect(() => {
    setSecValue(null);
    setItem([]);
    setSecItems(getSecItems(dataInit, semValue));
  }, [dataInit, semValue]);
  useEffect(() => {
    if (secValue) {
      getList();
    }
  }, [secValue]);
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
          items.length !== 0 && !secOpen ? styles.cardRoot : styles.noRecord
        }
      >
        <View>
          <DropDownPicker
            placeholder={'Select Semester'}
            open={semOpen}
            value={semValue}
            items={semItems}
            setOpen={setSemOpen}
            setValue={x => {
              setSemValue(x);
              setSecValue(null);
            }}
            loading={semesterloading}
            containerProps={{
              height: semOpen ? 250 : undefined,
            }}
            containerStyle={styles.containerStyle}
            dropDownContainerStyle={{margin: 15}}
            listMessageContainerStyle={{margin: 15, marginBottom: 0}}
            listMode="SCROLLVIEW"
            ListEmptyComponent={({message}) => (
              <Text style={{alignSelf: 'center', textAlign: 'center'}}>No Data found</Text>
            )}
          />
        </View>

        <View>
          {!semOpen && (
            <DropDownPicker
              placeholder={'Select Section'}
              open={secOpen}
              value={secValue}
              items={secItems}
              setOpen={setSecOpen}
              setValue={setSecValue}
              containerStyle={styles.containerStyle}
              dropDownContainerStyle={{margin: 15}}
              listMessageContainerStyle={{margin: 15, marginBottom: 0}}
              listMode="SCROLLVIEW"
              ListEmptyComponent={({message}) => (
                <Text style={{alignSelf: 'center', textAlign: 'center'}}>No Data found</Text>
              )}
            />
          )}
        </View>
        {items.length !== 0 && !secOpen && secValue !== null ? (
          <FlatList
            data={items}
            renderItem={props => (
              <FacultyCard
                title={props.item.subjectname}
                stafftype={props.item.stafftype}
                subTitle={props.item.staffname}
                profile={props.item.facultyphoto}
                priority={priority}
              />
            )}
            contentContainerStyle={styles.viewLastCard}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : !secOpen ? (
          <Text style={styles.textStyle}>No data found</Text>
        ) : null}
      </View>
    </Provider>
  );
};

const mapStateToPropes = ({app}) => {
  const {maindata} = app;
  return {
    ...maindata,
  };
};

export default connect(mapStateToPropes, null)(OtherFlow);

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
    textAlign: 'center',
    alignSelf: 'center',
  },
  containerStyle: {
    padding: 15,
  },
  viewLastCard: {
    paddingBottom: '60%',
  },
});
