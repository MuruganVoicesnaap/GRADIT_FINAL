import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Header from '../../../components/Header/Header';
import {Constants, ICON} from '../../../constants/constants';
import {videoListApi} from '../../../redux/actions/video';
import {connect} from 'react-redux';
import moment from 'moment';
import Advertisement from '../../../components/Advertisement';
import Spinner from 'react-native-loading-spinner-overlay';
import {appReadStatus} from '../../../redux/actions/appReadStatus';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import AppConfig from '../../../redux/app-config';
import {AddButton} from '../../../components/AddButton/AddButton';
import Orientation, {PORTRAIT, LANDSCAPE} from 'react-native-orientation';
import {useFocusEffect} from '@react-navigation/native';
import CommonCard from '../../../components/CommonCard';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const VideoScreen = ({navigation, state, bottomSheetAction}) => {
  const reqData = state?.app?.maindata;
  const searchText = state?.app?.searchText;
  const [totalVideoList, setTotalVideoList] = useState([]);
  const [filteredVideoSource, setFilteredVideoSource] =
    useState(totalVideoList);
  const iterate = useState(filteredVideoSource?.length !== 0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);
  // console.log('REQ DATA>>>', reqData);

  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const newData = totalVideoList.filter(item => {
        return Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter),
        );
      });

      setFilteredVideoSource(newData);
    } else {
      setFilteredVideoSource(totalVideoList);
    }
  }, [searchText, totalVideoList]);
  const getData = useCallback(() => {
    if (reqData.memberid) {
      const request = {
        userid: reqData.memberid,
        collegeid: reqData.colgid,
        priority: reqData.priority,
      };
      videoListApi({
        request,
      }).then(({data}) => {
        console.log('Videos',data)
        setTotalVideoList(data);
        setRefreshing(false);
      });
    }
  }, [reqData.colgid, reqData.memberid, reqData.priority]);

  // console.log('..........', reqData);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Orientation.lockToPortrait();
    getData();
    // wait(100).then(() => setRefreshing(false));
  }, [getData]);

  useFocusEffect(
    useCallback(() => {
      bottomSheetAction({hideSheet: false});
      // when the screen is focused
      getData();
      Orientation.lockToPortrait();
    }, [bottomSheetAction, getData]),
  );

  useEffect(() => {
    Orientation.lockToPortrait();
    if (reqData.memberid) {
      getData();
    }
  }, [reqData.memberid, getData]);

  const onAddVideo = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_VIDEO_SCREEN);
  };
  const toggleCheck = (cardIndex, selectedCard) => {
    if (cardIndex !== selectedCard) {
      setSelectedCard(cardIndex);
    } else if (cardIndex === selectedCard) {
      setSelectedCard(-1);
    }
  };
  const statusChange = (detailID, appRead) => {
    if (Number(appRead) === 0) {
      appReadStatus({
        userid: reqData.memberid,
        msgtype: 'video',
        detailsid: detailID,
        priority: reqData.priority,
      }).then(console.log('read success'));
    }
  };
  const renderItem = ({item, index}) => {
    // console.log({item}, item.createdby);
    let dateOnly = moment(item?.createdon).format('DD MMM YYYY');
    let timeOnly = moment(item?.createdon).format('HH.mm  A');
    return (
      <CommonCard
        title={item.title}
        date={dateOnly}
        time={timeOnly}
        sentbyname={item.createdby}
        content={item.description}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        createdby={item.createdby}
        getData={getData}
        cardIndex={index}
        appReadStatus={item.isappviewed}
        rowView
        pillBottomSpace
        rowViewText="Play Video"
        onPressRowView={() => {
          bottomSheetAction({hideSheet: true});
          navigation.navigate(
            'VideoPlayer',
            {video: item},
            statusChange(item.detailid, item.isappviewed),
          );
        }}
        endContent
        onPress={() => toggleCheck(index, selectedCard)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner color="#3b5998" visible={refreshing} size="large" />
      <Header
        onSearch
        onRefreshingPage={() => {
          onRefresh();
        }}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />
        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.textHead,
              {padding: 15, backgroundColor: Constants.WHITE_COLOR},
            ]}
          >
            Video
          </Text>
          {/* <Text style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          suscipit malesuada nunc et.
        </Text> */}
        </View>

        <View
          style={
            filteredVideoSource?.length !== 0
              ? styles.flatlistNormal
              : styles.noRecordnormal
          }
        >
          {filteredVideoSource?.length !== 0 ? (
            <FlatList
              data={filteredVideoSource}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.viewLastCard}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <Text>No data found</Text>
          )}
        </View>
      </ScrollView>
      {(reqData?.priority === 'p1' ||
        reqData?.priority === 'p2' ||
        reqData?.priority === 'p3') && <AddButton onPress={onAddVideo} />}
    </SafeAreaView>
  );
};
const mapStatetoProps = state => ({
  state: state,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(VideoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  innerContainer: {
    marginTop: 0,
    paddingHorizontal: '5%',
    width: '100%',
    backgroundColor: Constants.WHITE_COLOR,
  },
  viewLastCard: {
    paddingBottom: '30%',
  },
  textHead: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  textnormal: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    height: 120,
    marginVertical: '2%',
    borderRadius: 5,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '50%',
    alignSelf: 'flex-start',
    marginVertical: '2%',
    marginBottom: '2%',
  },
  flatlistNormal: {
    flex: 1,
    // height: Dimensions.get('window').height - 270,
    backgroundColor: Constants.WHITE_COLOR,
    // paddingBottom: 350,
  },
  noRecordnormal: {
    backgroundColor: Constants.WHITE_COLOR,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
  row: {
    flexDirection: 'row',
  },
  cardOpen: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  containerAdd: {
    width: 48,
    height: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    right: '5%',
    backgroundColor: Constants.COMMON_COLOR_FOR_APP,
  },
  addButtonStyle: {
    flex: 1,
    bottom: 500,
    height: 100,
    width: 100,
    left: 100,
    backgroundColor: 'red',
  },
});
