/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
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
import {connect} from 'react-redux';
import {IMAGES} from '../../assests';
import {Constants} from '../../constants/constants';
import {
  getAdvertisement,
  triggerAddClick,
} from '../../redux/actions/advertisement';

import {useNavigation} from '@react-navigation/native';
const ParentElement = props => {
  const isImage = (props.imageUrl || '').includes(
    ('.jpg' || '.png' || 'jpeg') && 'http',
  );
  return (
    <TouchableOpacity onPress={props.onPress}>
      {isImage ? (
        <ImageBackground
          style={{...props.style}}
          source={{uri: props.imageUrl}}
        >
          {props.children}
        </ImageBackground>
      ) : (
        <View style={{...props.style}}>{props.children}</View>
      )}
    </TouchableOpacity>
  );
};

const Advertisement = props => {
  console.log(props.deviceInfo);
  console.log(props, '////////');
  const [enableLoader, setLoader] = useState(true);
  const [adsData, setAdsData] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    getAdvertisement({
      device_token: props.deviceInfo.deviceToken,
      member_id: props.memberid,
      mobile_no: props.mobileNumber,
      college_id: props.colgid,
      priority: props.priority,
    })
      .then(res => {
        console.log('ressss.....................', res);
        setLoader(false);
        setAdsData(res);
      })
      .catch(e => {
        console.log('ressss,,,,,,,,,,,,,,,,,,,,,', e);
        setAdsData(e);
      });
  }, []);

  const onClickAction = () => {
    triggerAddClick({
      device_token: props.deviceInfo.deviceToken,
      member_id: props.memberid,
      mobile_no: props.mobileNumber,
      college_id: props.colgid,
      priority: props.priority,
      add_id: adsData.add_id,
    });
  };

  const {
    add_title,
    add_content,
    background_image,
    add_image,
    add_url,
    titlecolor,
  } = adsData;
  return (
    <ParentElement
      onPress={() => {
        onClickAction();
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
      style={{...styles.ad, ...props.style}}
      imageUrl={background_image}
    >
      {enableLoader ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
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
                color: titlecolor ? titlecolor : Constants.DARK_COLOR,
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
                color: titlecolor ? titlecolor : Constants.DARK_COLOR,
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
      )}
    </ParentElement>
  );
};

const mapStateToPropes = ({app}) => {
  const {maindata, userDetails, deviceInfo} = app;
  return {
    ...maindata,
    ...userDetails,
    deviceInfo,
  };
};

export default connect(mapStateToPropes, null)(Advertisement);
const styles = StyleSheet.create({
  loader: {margin: '10%'},
  ad: {
    width: '100%',
    backgroundColor: Constants.BLUE1F6,
    height: 100,
    zIndex: 3,
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
    fontSize: Constants.FONT_BADGE,
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
    width: '60%',
    paddingTop: 20,
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
