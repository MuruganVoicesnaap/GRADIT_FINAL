/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
} from 'react-native';
import Advertisement from '../../../components/Advertisement';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import AssignmentQuestion from '../../../components/Card/AssignmentQuestionCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-native-paper';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';

const Questions = ({navigation, route, maindata, bottomSheetAction}) => {
  const data = route.params.assignmentid;

  const renderItem = ({item}) => {
    return <AssignmentQuestion item={item} />;
  };
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>Assignment Files</Text>
          </View>
        </TouchableOpacity>
        <View style={{flex: 1, marginTop: 10, padding: 10}}>
          {data.length ? (
            <VirtualizedList
              data={data}
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data.length}
              renderItem={renderItem}
              contentContainerStyle={styles.viewLastCard}
              keyExtractor={item => item.assignmentid}
              //   refreshing={refreshing}
              //   onRefresh={onRefresh}
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

export default connect(mapStatetoProps, mapDispatchToProps)(Questions);

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    marginBottom: 10,
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
