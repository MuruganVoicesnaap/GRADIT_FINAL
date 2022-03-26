import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import AnimatedSubheaderNav from '../../../../components/AnimatedSubheaderNav/index';
import Advertisement from '../../../../components/Advertisement';
import {Constants, FONT} from '../../../../constants/constants';
import Header from '../../../../components/Header/Header';
import ViewAssignmentCard from '../../../../components/Card/ViewAssignmentCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {circularData} from '../../../../redux/actions/circularData';
import {NavTab} from '../../../../components/Tab';
import {setBottomSheetData} from '../../../../redux/actions/setBottomSheetData';
import DeleteSubmission from '../../../../components/Modal/DeleteSubmission';
import {AddButton} from '../../../../components/AddButton/AddButton';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const Home = ({navigation, priority, memberid, bottomSheetAction}) => {
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [collegeCircularList, setCollegeCircularList] = useState([]);
  const [departmentCircularList, setDepartmentCircularList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  useEffect(() => {
    bottomSheetAction({hideSheet: modalVisible});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const isDataAvailable = isLeftTabSelected
    ? departmentCircularList.length !== 0
    : collegeCircularList.length !== 0;

  const getData = useCallback(() => {
    if (memberid) {
      const request = {
        userid: memberid,
        appid: '2',
        priority,
      };
      circularData({
        request,
        isCollegeCircular: false,
      }).then(({data}) => setDepartmentCircularList(data));
      circularData({
        request,
        isCollegeCircular: true,
      }).then(({data}) => setCollegeCircularList(data));
    }
  }, [memberid, priority, setDepartmentCircularList, setCollegeCircularList]);

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
  useFocusEffect(
    useCallback(() => {
      // when the screen is focused
      getData();
    }, []),
  );
  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const renderItem = (item, index) => {
    return (
      <ViewAssignmentCard
        navigation={navigation}
        item={item}
        onDelete={showModal}
        getData={getData}
        onRightTabPress={onRightTabPress}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        cardIndex={index}
      />
    );
  };
  const onAdd = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate('NewAssignment');
  };
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <DeleteSubmission visible={modalVisible} hideModal={hideModal} />
        <Header />
        <Advertisement />
        <AnimatedSubheaderNav
          items={
            isDataAvailable ? (
              <View>
                <FlatList
                  data={
                    isLeftTabSelected
                      ? departmentCircularList
                      : collegeCircularList
                  }
                  renderItem={({item, index}) => {
                    // console.log(',,,,', index, item);
                    return (
                      <ViewAssignmentCard
                        navigation={navigation}
                        item={item}
                        onDelete={showModal}
                        getData={getData}
                        onRightTabPress={onRightTabPress}
                        selectedCard={selectedCard}
                        setSelectedCard={setSelectedCard}
                      />
                    );
                  }}
                  keyExtractor={item => item.id}
                  style={styles.viewLastCard}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </View>
            ) : (
              <View style={styles.noData}>
                <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                  No data found
                </Text>
              </View>
            )
          }
          leftTab={
            <NavTab
              text="Upcoming"
              active={isLeftTabSelected}
              count={departmentCircularList.length}
            />
          }
          rightTab={
            <NavTab
              text="Past"
              active={!isLeftTabSelected}
              count={collegeCircularList.length}
            />
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Assignment</Text>
              </View>
              {/* <Text style={styles.titleDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                suscipit malesuada nunc et.
              </Text> */}
            </>
          }
          onLeftTabPress={onLeftTabPress}
          onRightTabPress={onRightTabPress}
          leftTabWrapperStyle={
            isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
          rightTabWrapperStyle={
            !isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
        />
        <AddButton onPress={onAdd} />
      </SafeAreaView>
    </Provider>
  );
};

const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(Home);

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
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  tabWrapperStyle: {
    width: 120,
    minWidth: 120,
    padding: 10,
    height: 45,
    borderRadius: 4,
    marginVertical: 4,
    marginHorizontal: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.BUTTON_NORMAL_COLOR,
  },
  selectedTabWrapperStyle: {
    width: 120,
    minWidth: 120,
    padding: 10,
    height: 45,
    borderRadius: 4,
    marginVertical: 4,
    marginHorizontal: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
  },
  titleDescription: {
    fontFamily: FONT.primaryRegular,
    color: Constants.MILD_BLACK_COLOR,
    fontSize: Constants.FONT_ELEVEN,
    marginTop: 10,
  },
  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },
  viewLastCard: {
    paddingBottom: '25%',
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
  buttonTextBadge: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
  },
});
