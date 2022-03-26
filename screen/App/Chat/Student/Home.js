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
import AppConfig from '../../../../redux/app-config';
import {Constants, FONT} from '../../../../constants/constants';
import {connect} from 'react-redux';
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
  const [staffs, setStaffs] = useState([]);

  const getList = () => {
    setLoading(true);
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_STAFF_DETAILS}`,
      'POST',
      false,
      {
        student_id: memberid,
        college_id: colgid,
      },
      res => {
        const {Status, data} = res;
        if (Status === 1) {
          setStaffs(data);
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

  if (staffs.length === 0) {
    return <Text style={styles.textStyle}>No records found</Text>;
  }

  return (
    <FlatList
      data={staffs}
      contentContainerStyle={{paddingBottom: 30}}
      renderItem={({item}) => {
        return (
          <View key={item.staffid} style={styles.rowStyle}>
            <View style={[styles.itemContainer]}>
              <View style={styles.row}>
                <Image source={HeaderHuman} style={{height: 31, width: 32}} />
                {/* <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.subjectcount}</Text>
                </View> */}
              </View>
              <Text style={styles.itemDep}>{item.subjectname}</Text>
              <Text style={styles.itemName}>{item.staffname}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate(AppConfig.SCREEN.CHAT_ROOM_SCREEN, {
                    item,
                  });
                }}
              >
                <Text style={styles.buttonText}>Interact</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
      numColumns={2}
      keyExtractor={item => item.staffid}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.gridView}
    />
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
});

export default connect(mapStatetoProps, null)(Home);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridView: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    paddingBottom: 20,
    marginBottom: 90,
  },
  rowStyle: {
    paddingBottom: 10,
    width: '50%',
  },
  itemContainer: {
    backgroundColor: Constants.WHITE_COLOR,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    marginRight: 10,
    shadowColor: Constants.GREY007,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    borderRadius: 6,
  },
  itemDep: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    color: '#1B82E1',
    borderBottomColor: Constants.GREY001,
    borderBottomWidth: 0.5,
    marginTop: 3,
    paddingBottom: 2,
  },
  itemName: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    marginTop: 3,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    borderColor: '#229557',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 30,
    width: 76,
    marginVertical: 8,
  },
  buttonText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    color: '#229557',
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
  },
});
