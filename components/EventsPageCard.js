/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Card from './Card/card';
import {Constants, Font} from '../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const EventsPAgeCard = ({itemsValue, onPress}) => {
  return (
    // <Card>
    <View style={[styles.item]}>
      <View style={{...styles.leftLine}}>
        <View style={{marginLeft: '5%'}}>
          <Text
            style={{
              fontSize: Constants.FONT_FULL_LOW,
              fontWeight: Constants.FONT_WEI_BOLD,
              marginLeft: 5,
              color: Constants.DARK_COLOR,
            }}
          >
            {itemsValue.topic}
          </Text>
        </View>
        <View
          style={{
            marginLeft: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '2%',
              alignItems: 'center',
            }}
          >
            <Icons name="calendar" size={16} color={Constants.DARK_COLOR} />
            <Text
              style={{
                fontSize: Constants.FONT_BADGE,
                marginLeft: 3,
                marginRight: 5,
                color: Constants.DARK_COLOR,
              }}
            >
              {itemsValue.event_date}
            </Text>
            <Icons
              name="clock-time-five-outline"
              size={16}
              color={Constants.DARK_COLOR}
            />
            <Text
              style={{
                fontSize: Constants.FONT_BADGE,
                marginLeft: 3,
                color: Constants.DARK_COLOR,
              }}
            >
              {itemsValue.event_time}
            </Text>
          </View>
          <TouchableOpacity style={{paddingRight: '5%'}} onPress={onPress}>
            <Icons
              name="chevron-right-circle"
              color={Constants.SKY_BLUE_COLOR}
              size={25}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          paddingRight: '3%',
          marginVertical: 5,
          marginBottom: 15,
        }}
      >
        <Text>posted by :</Text>
        <View
          style={{
            paddingVertical: 2,
            paddingHorizontal: '3%',
            backgroundColor: Constants.POSTED_BY_COLOR,
            borderRadius: 15,
          }}
        >
          <Text>{itemsValue.createdbyname}</Text>
        </View>
      </View>
    </View>
    // </Card>
  );
};

export default EventsPAgeCard;

const styles = StyleSheet.create({
  item: {
    backgroundColor: Constants.WHITE_COLOR,
    flex: 6,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 17,
    width: '90%',
  },
});
