/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Card from './card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants} from '../../constants/constants';
import {Pill} from '../Pill/Pill';

const HomeCard = ({
  onPress,
  colgid = '',
  memberid = '',
  priority = '',
  membername = '',
  colgname = '',
  colgcity = '',
  colglogo = '',
  courseid = '',
  coursename = '',
  deptid = '',
  deptname = '',
  yearid = '',
  yearname = '',
  sectionid = '',
  sectionname = '',
  semesterid = '',
  semestername = '',
  loginas = '',
}) => {

  return (
    <Card style={{...styles.card, width: '90%'}} onPress={onPress}>
      <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-start'}}>
        {/* <View> */}
        <Icon
          name="account-circle"
          color={Constants.GREY004}
          size={30}
          style={{paddingLeft: 10, paddingRight: 5}}
        />
        {/* </View> */}
        <View style={{flex: 2}}>
          <Text style={styles.textHead}>{membername}</Text>
          {loginas === 'Student' || loginas === 'Parent' ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textLow}>{yearname}</Text>
              <View style={styles.verticalLine} />
              <Text style={styles.textLow}>{semestername}</Text>
            </View>
          ) : null}
        </View>
        <View style={{flex: 1}}>
          <Pill
            text={loginas}
            icon="account"
            iconSize={16}
            containerStyle={styles.containerStyle}
            textStyle={styles.textStyle}
            numberOfLines={1}
            home={true}
            onPress={onPress}
          />
        </View>
      </View>
      {/* <View style={styles.horizontalLineFull} /> */}
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            paddingLeft: 45,
          }}
        >
          <View style={{flex: 4}}>
            <Text
              style={{
                ...styles.textHeadNormal,
                fontSize: Constants.FONT_FULL_LOW,
                color: Constants.GREY007,
              }}
              numberOfLines={1}
            >
              {colgname}
            </Text>
            {/* <Text
              style={{
                ...styles.textHead,
                fontSize: Constants.FONT_FULL_LOW,
                color: Constants.ROYAL_BLUE_COLOR,
              }}>
              INSTITUTE OF SCIENCE AND TECHNOLOGY
            </Text> */}
          </View>
          <TouchableOpacity style={{flex: 1}} onPress={onPress}>
            <Icons
              name="chevron-right"
              color={Constants.SKY_BLUE_COLOR}
              size={25}
              style={{alignSelf: 'flex-end', marginRight: '15%'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  card: {
    height: undefined,
    paddingTop: 10,
    paddingBottom: 10,
    alignSelf: 'center',
    marginBottom: '5%',
    borderRadius: 5,
  },
  textHead: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  textHeadNormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  textLow: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_NORMAL,
    color: Constants.MILD_COLOR,
  },
  verticalLine: {
    borderRightWidth: 1,
    marginHorizontal: 5,
    borderColor: Constants.MILD_COLOR,
    height: 14,
    alignSelf: 'center',
  },
  horizontalLineFull: {
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    borderColor: Constants.GREY_COLOR,
    paddingVertical: 3,
  },
  containerStyle: {
    marginRight: '1%',
    backgroundColor: Constants.WHITE_COLOR,
    borderWidth: 1,
    borderColor: Constants.ROYAL_BLUE_COLOR,
  },
  textStyle: {
    color: Constants.ROYAL_BLUE_COLOR,
    fontSize: Constants.FONT_BADGE,
  },
});
