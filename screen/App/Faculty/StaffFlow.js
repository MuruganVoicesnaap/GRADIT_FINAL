/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import AppConfig from '../../../redux/app-config';
import FacultyCard from './FacultyCard';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const StaffFlow = ({priority, sectionid, memberid, deptid}) => {
  const [items, setItem] = useState([]);
  const getList = () => {
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.STAFF_FACULTY_LIST}`,
      'POST',
      false,
      {
        userid: memberid,
        appid: '1',
        priority,
        deptid,
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
    getList();
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    getList();
    wait(100).then(() => setRefreshing(false));
  };
  return (
    <View style={items.length !== 0 ? styles.cardRoot : styles.noRecord}>
      {items.length !== 0 ? (
        <FlatList
          data={items}
          renderItem={props => (
            <FacultyCard
              title={props.item.stafftype}
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
      ) : (
        <Text>No data found</Text>
      )}
    </View>
  );
};

const mapStateToPropes = ({app}) => {
  const {maindata} = app;
  return {
    ...maindata,
  };
};

export default connect(mapStateToPropes, null)(StaffFlow);

const styles = StyleSheet.create({
  cardRoot: {
    marginTop: 10,
    paddingBottom: 10,
  },
  noRecord: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLastCard: {
    paddingBottom: '60%',
  },
});
