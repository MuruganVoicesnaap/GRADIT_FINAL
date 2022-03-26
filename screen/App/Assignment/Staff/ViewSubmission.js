/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Advertisement from '../../../../components/Advertisement';
import {Constants, FONT, ICON} from '../../../../constants/constants';
import Header from '../../../../components/Header/Header';
import ViewSubmissionCard from '../../../../components/Card/ViewSubmissionCard';
import {setBottomSheetData} from '../../../../redux/actions/setBottomSheetData';
import AppConfig from '../../../../redux/app-config';
import triggerSimpleAjax from '../../../../context/Helper/httpHelper';
import Spinner from 'react-native-loading-spinner-overlay';

const assignmentData = ({request = {}}) => {
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.VIEW_SUMITTED_MEMEBER}`,
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
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const ViewSubmission = ({navigation, route, maindata, bottomSheetAction}) => {
  const {memberid} = maindata;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        assignmentid: route.params.assignmentid,
        processby: memberid,
        filetype: 1,
      };
      assignmentData({
        request,
      })
        .then(({data}) => {
          setData(data);
        })
        .then(() => setLoading(false))
        .catch(err => {
          // console.error(err);
        });
    }
  }, [memberid]);

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

  const renderItem = ({item}) => {
    return (
      <ViewSubmissionCard
        navigation={navigation}
        item={item}
        assignmentid={route.params.assignmentid}
        assignmenttype={route.params.assignmenttype}
      />
    );
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Header
          onRefreshingPage={() => {
            onRefresh();
          }}
        />
        <Advertisement />

        <View style={styles.stackHeader}>
          <View style={styles.stackHeaderRow}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icons
                name={'arrow-back'}
                size={25}
                color={Constants.WHITE_COLOR}
              />
            </TouchableOpacity>
            <View style={[styles.stackHeaderRow, {marginLeft: 10}]}>
              <View style={{marginLeft: 5}}>
                <View style={{alignSelf: 'flex-start'}}>
                  <Text style={styles.title}>Assignment Submissions</Text>
                </View>
                {/* <Text style={styles.titleDescription}>
                  Electronic Circuits and Logic Design Assignment
                </Text> */}
              </View>
            </View>
          </View>
        </View>

        <View style={{flex: 1, marginTop: 10, padding: 10}}>
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
          ) : data.length ? (
            <VirtualizedList
              data={data}
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data.length}
              renderItem={renderItem}
              contentContainerStyle={styles.viewLastCard}
              keyExtractor={item => item.studentid}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                No data found
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Provider>
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(ViewSubmission);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: '#1BD5E1',
    marginBottom: 2,
  },
  titleDescription: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
  },
  stackHeader: {
    backgroundColor: Constants.BLACK000,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  stackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLastCard: {
    paddingBottom: '25%',
  },
  buttonTextBadge: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
  },
  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },
});
