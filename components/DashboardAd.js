/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
//import { DashboardDummyData } from '../.././screen/DashboardHome/index';
import {IMAGES} from '../assests';
import {Constants} from '../constants/constants';
import {useNavigation} from '@react-navigation/native';
import {triggerAddClick} from '../redux/actions/advertisement';

const ParentElement = props => {
  const isImage = (props.imageUrl || '').includes(
    ('jpg' || 'png' || 'jpeg') && 'http',
  );
  return (
    <TouchableOpacity onPress={props.onPress}>
      {isImage ? (
        <ImageBackground style={props.style} source={{uri: props.imageUrl}}>
          {props.children}
        </ImageBackground>
      ) : (
        <View style={{...props.style}}>{props.children}</View>
      )}
    </TouchableOpacity>
  );
};

const AdvertisementDashBoard = ({
  add_title = '',
  add_content = '',
  background_image = '',
  add_image = '',
  add_url = '',
}) => {
  const navigation = useNavigation();
  // console.log(background_image);

  return (
    <ParentElement
      onPress={() => {
        // onClickAction();
        navigation.navigate('MyWeb', {
          screenName: 'Ad',
          pageUrl: add_url,
        });
        // Linking.canOpenURL(add_url).then(supported => {
        //   if (supported) {
        //     Linking.openURL(add_url);
        //   } else {
        //     console.log("Don't know how to open URI: " + add_url);
        //   }
        // });
      }}
      style={styles.ad}
      imageUrl={background_image}
    >
      <View style={styles.innerRoot}>
        <View style={styles.left}>
          <View style={styles.imgRoot}>
            <Image
              source={add_image ? {uri: add_image} : IMAGES.Profile}
              style={styles.imgStyles}
            />
          </View>
        </View>
        <View style={[styles.mid, {paddingTop: 5, marginLeft: -15}]}>
          <Text
            style={{
              ...styles.textHead,
              fontWeight: Constants.FONT_WEI_BOLD,
              marginLeft: -5,
            }}
          >
            {add_title}
          </Text>
          <Text
            style={{
              ...styles.texnormal,
              fontWeight: Constants.FONT_WEI_MED,
              fontSize: Constants.FONT_TEN,
              marginTop: -5,
              paddingLeft: -15,
              marginLeft: -5,
            }}
            numberOfLines={5}
          >
            {add_content}
          </Text>
        </View>
        {/* <View style={styles.right}>
          <View style={[styles.modalRow]}>
            <Icon name="star" size={16} color={'#000'} />
            <Text
              style={{
                fontWeight: Constants.FONT_WEI_MED,
              }}
            >
              {' Sponsored'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text
              style={{
                ...styles.midText,
                fontWeight: Constants.FONT_WEI_MED,
              }}
            >
              {'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ParentElement>
  );
};

export default AdvertisementDashBoard;

const styles = StyleSheet.create({
  loader: {margin: '10%'},
  ad: {
    width: '100%',
    backgroundColor: Constants.BLUE1F6,
    height: 100,
    opacity: 0.7,
    zIndex: 3,
    // marginHorizontal: -15,
    // marginLeft: -15,
  },
  textHead: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_BOLD,
    paddingBottom: 5,
    color: '#000000',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 30,
    width: '100%',
    alignItems: 'center',
    paddingLeft: 15,
    marginVertical: 3,
  },
  texnormal: {
    fontSize: Constants.FONT_FULL_LOW,
  },
  midText: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    borderRadius: 30,
    color: '#000',
    marginTop: 0,
    alignSelf: 'center',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderWidth: 2,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    height: 75,
    marginVertical: '2%',
    borderRadius: 5,
  },
  innerRoot: {flexDirection: 'row'},
  left: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mid: {
    width: '75%',
    paddingTop: 20,
    // backgroundColor: 'red',
  },
  right: {
    width: '35%',
    paddingTop: 10,
  },
  imgRoot: {
    height: 50,
    width: 44,
    backgroundColor: 'transparent',
    borderRadius: 12,
    alignSelf: 'center',
  },
  imgStyles: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
    alignSelf: 'center',
  },
});
