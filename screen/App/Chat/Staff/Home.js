import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import AppConfig from '../../../../redux/app-config';
import {Constants, FONT, ICON} from '../../../../constants/constants';
import HeaderHuman from '../../../../assests/images/HeaderHuman.png';
import triggerSimpleAjax from '../../../../context/Helper/httpHelper';
import {STUDENT, STAFF} from '../../../../utils/getConfig';
import Spinner from 'react-native-loading-spinner-overlay';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home = ({
  navigation,
  selectedCard,
  setSelectedCard,
  maindata: {colgid, memberid},
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [classes, setClass] = useState([]);
  const getList = () => {
    setLoading(true);
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_STAFF_CLASS_DETAILS}`,
      'POST',
      false,
      {
        staff_id: memberid,
        college_id: colgid,
      },
      res => {
        const {Status, data} = res;
        if (Status === 1) {
          setClass(data);
        }
        setLoading(false);
        setSelectedCard(false);
      },
      err => {
        setLoading(false);
        setSelectedCard(false);
      },
    );
  };

  useEffect(() => {
    if (memberid) {
      getList();
    }
  }, [colgid, memberid]);
  useEffect(() => {
    if (selectedCard === true) {
      getList();
    }
  }, [selectedCard]);
  const onRefresh = () => {
    setRefreshing(true);
    getList();

    wait(100).then(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <View
        style={{height: 70, justifyContent: 'center', alignItems: 'center'}}
      >
        <Spinner color="#3b5998" visible={loading} size="large" />
      </View>
    );
  }

  if (classes.length === 0) {
    return <Text style={styles.textStyle}>No records found</Text>;
  }

  let listKey = 0;

  return (
    <FlatList
      data={classes}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 20}}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            key={listKey}
            style={styles.rowStyle}
            onPress={() => {
              navigation.navigate(AppConfig.SCREEN.CHAT_ROOM_SCREEN, {
                item,
              });
            }}
          >
            <View style={styles.rowHeader}>
              <Image source={HeaderHuman} style={{height: 32, width: 32}} />
              <View style={{marginLeft: 10}}>
                <Text style={styles.rowText1}>
                  {item.coursename} | {item.departmentname}
                </Text>
                <Text style={styles.rowText2}>{item.subjectname}</Text>
                <Text style={styles.rowText3}>
                  {item.yearname} |{item.semestername} |{item.sectionname}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(AppConfig.SCREEN.CHAT_ROOM_SCREEN, {
                  item,
                });
              }}
            >
              <Icons
                style={styles.sendIcon}
                name={ICON.SEND}
                size={20}
                color={'#3F6EE8'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => ++listKey}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{
        paddingVertical: 10,
        marginBottom: 50,
      }}
    />
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
});

export default connect(mapStatetoProps, null)(Home);

const styles = StyleSheet.create({
  rowStyle: {
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 5,
    backgroundColor: Constants.WHITE_COLOR,
    shadowColor: Constants.GREY007,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText1: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    color: '#1B82E1',
    marginTop: 3,
    paddingBottom: 2,
  },
  rowText2: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_FULL_LOW,
    color: Constants.BLACK000,
  },
  rowText3: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    color: Constants.GREY007,
  },
});
