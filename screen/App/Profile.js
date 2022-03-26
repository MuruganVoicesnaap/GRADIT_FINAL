import React, { useState, useCallback, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getProfile } from '../../redux/actions/getProfiles';
import AppConfig from '../../redux/app-config';

const Profile = ({getProfile, state, navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState([]);
  const reqData = state?.app?.maindata;
  const type = 'text';

  useEffect(() => {
    setLoading(true);
    fetch(AppConfig.API_URL + 'GetProfileDetails' + '?id=' + reqData.memberid)
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        console.log('Profile', json);

        if (json.Status == 1) {
          setProfileData(json.data);
        } else {
          Alert.alert(json.Message);
        }
      })
      .catch(error => console.error(error));
       setLoading(false);

  }, []);

  const renderItem = ({item}) => <Item item={item} />;

  const Item = ({item}) => (
    <View style={styles.cardStyle}>
      {item.type == 'text' ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textTitle}>{item.key}</Text>
          <Text style={{flex: 1, fontWeight: 'normal', fontSize: 15}}>
            {' '}
            : {item.value}
          </Text>
        </View>
      ) : item.type == 'img' && item.value != '' ? (
        <View style={{flexDirection: 'column', marginTop: 20}}>
          <Text
            style={{fontWeight: '700', fontSize: 17, color: Constants.BLACK002}}
          >
            {item.key}
          </Text>
          <Image source={{uri: item.value}} style={styles.profile} />
        </View>
      ) : item.type == 'number' ? (
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={styles.textTitle}>{item.key}</Text>
          <Text style={{flex: 1}}> " : " +{item.value}</Text>
        </View>
      ) : null}
    </View>
  );

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
        <Text style={styles.text}>{route.params.screenName}</Text>
      </View>

      <ScrollView stickyHeaderIndices={[1]}>
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
          <FlatList
            data={profileData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </ScrollView>
      <View style={{height: 70}}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: '35%',
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginTop: 20,
  },

  textTitle: {
    color: Constants.BLACK002,
    fontSize: 17,
    flex: 1,
    fontWeight: '700',
  },

  cardStyle: {
    elevation: 1,
    margin: 5,
    borderRadius: 5,
    borderWidth: 0,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: Constants.WHITE_COLOR,
    marginTop: 5,
  },

  styleContainer: {
    flexDirection: 'column',
    flex: 1,
  },

  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor:
  },
  text: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_TWENTY,
    marginLeft: 15,
  },
  icon: {
    marginLeft: 15,
  },
});

const mapStateToProps = state => ({
    state: state,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: data => dispatch(getProfile(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

