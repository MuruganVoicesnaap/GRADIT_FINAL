/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav/index';
import Advertisement from '../../../components/Advertisement';
import {Constants, FONT, ICON} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import {CommunicationCard} from '../../../components/CommunicationCard/CommunicationCard';
import {connect} from 'react-redux';
import AppConfig from '../../../redux/app-config';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import {AddButton} from '../../../components/AddButton/AddButton';
import {getCommunicationData} from '../../../redux/actions/getCommunicationData';
import {NavTab} from '../../../components/Tab';
import {useFocusEffect} from '@react-navigation/native';
import {stylesForEachTabs} from '../../../components/CommonStyles';
import CommonCard from '../../../components/CommonCard';
import {appReadStatus} from '../../../redux/actions/appReadStatus';
import {ScrollView} from 'react-native';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const Communication = ({
  navigation,
  collegeId,
  priority,
  memberid,
  searchText,
  setBottomSheetData: bottomSheetAction,
}) => {
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [unreadList, setUnreadList] = useState([]);
  const [readList, setReadList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [selectedCardEmergency, setSelectedCardEmergency] = useState(-1);

  const [FilteredReadSource, setFilteredReadSource] = useState(readList);

  const [stopAudio, setStopAudio] = useState(false);


  const [FilteredUnreadSource, setFilteredUnreadSource] = useState(unreadList);
  const isDataAvailable = isLeftTabSelected
    ? FilteredUnreadSource.length !== 0
    : FilteredReadSource.length !== 0;
  useEffect(() => {
    if (searchText) {
      const newData = unreadList.filter(function (item) {
        const itemData = item.description
          ? item.description.toUpperCase()
          : ''.toUpperCase();
        const textData = searchText.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      const newDataCollege = readList.filter(function (item) {
        const itemData = item.description
          ? item.description.toUpperCase()
          : ''.toUpperCase();
        const textData = searchText.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredUnreadSource(newData);
      setFilteredReadSource(newDataCollege);
    } else {
      setFilteredUnreadSource(unreadList);
      setFilteredReadSource(readList);
    }
  }, [searchText, readList, unreadList]);
  const getData = useCallback(() => {
    if (memberid) {
      const request = {
        userid: memberid,
        appid: '2',
        priority,
      };
      getCommunicationData({
        request,
        isUnReadData: true,
      }).then(({data}) => {
        setUnreadList(data);
        console.log(data);
      });
      getCommunicationData({
        request,
        isUnReadData: false,
      }).then(({data}) => setReadList(data));
    }
  }, [memberid, priority, setUnreadList, setReadList]);

  const onRefresh = useCallback(() => {
    setUnreadList([]);
    setReadList([]);
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

  const onAddCommunication = ({isVoiceMessage}) => {

    setStopAudio(true);

    bottomSheetAction({hideSheet: true});
    navigation.navigate(
      isVoiceMessage
        ? AppConfig.SCREEN.ADD_VOICE
        : AppConfig.SCREEN.ADD_MESSAGE,
    );
  };

  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const toggleCheck = (
    cardIndex,
    selectedCard,
    detailID,
    isVoiceMessage,
    isEmergencyMessage,
    emergencyType,
  ) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
      if (isLeftTabSelected) {
        statusChange(
          detailID,
          isVoiceMessage,
          isEmergencyMessage,
          emergencyType,
        );
      }
    } else if (cardIndex === selectedCard) {
      // console.log('toggleCheck else', cardIndex, selectedCard);
      setSelectedCard(-1);
    }
  };
  const statusChange = (
    msgdetailsid,
    isVoiceMessage,
    isEmergencyMessage,
    emergencyType,
  ) => {
    if (isVoiceMessage && !isEmergencyMessage && !emergencyType) {
      appReadStatus({
        userid: memberid,
        detailsid: msgdetailsid,
        priority: priority,
        msgtype: 'Voice',
      })
        .then(() => {
          // Toast.show(msgdetailsid + ' Voice Read successfully', Toast.LONG);
        })
        .catch(() => {
          // Toast.show('Failed fetch Events.......', Toast.LONG);
        });
    } else if (isVoiceMessage && emergencyType) {
      appReadStatus({
        userid: memberid,
        detailsid: msgdetailsid,
        priority: priority,
        msgtype: 'emergencyvoice',
      })
        .then(() => {
          // Toast.show(
          //   msgdetailsid + ' emergencyvoice Read successfully',
          //   Toast.LONG,
          // );
        })
        .catch(() => {
          // Toast.show('Failed fetch Events.......', Toast.LONG);
        });
    } else if (!isVoiceMessage && !isEmergencyMessage) {
      appReadStatus({
        userid: memberid,
        detailsid: msgdetailsid,
        priority: priority,
        msgtype: 'Text',
      })
        .then(() => {
          // Toast.show(msgdetailsid + ' Text Read successfully', Toast.LONG);
        })
        .catch(() => {
          // Toast.show('Failed fetch Events.......', Toast.LONG);
        });
    }
  };
  const renderItem = ({item, index}) => {
    const voice = item.typename !== 'Text Message';
    let dtStr = item.timing;
    let dateTimeSplit = dtStr.split(' - ');
    let dateSplit = dateTimeSplit[0];
    let timeSplit = dateTimeSplit[1].split(':');
    let timeOnly =
      timeSplit[0] + '.' + timeSplit[1] + ' ' + timeSplit[2].split(' ')[1];
    // console.log(timeOnly);
    const emergencyType = item.typename === 'Emergencyvoice Message';
    return (
      // <CommunicationCard
      //   cardIndex={index}
      //   isVoiceMessage={voice}
      //   title={item.description}
      //   date={dateSplit}
      //   time={timeOnly}
      //   msgdetailsid={item.msgdetailsid}
      //   videoSec={item.duration}
      //   content={item.msgcontent}
      //   postedBy={item.sentby}
      //   voiceMessageUrl={voice ? item.msgcontent : ''}
      //   memberid={memberid}
      //   priority={priority}
      //   collegeId={collegeId}
      //   emergencyType={emergencyType}
      //   getData={getData}
      //   selectedCard={selectedCard}
      //   checkRead={isLeftTabSelected ? '' : 'true'}
      //   setSelectedCard={setSelectedCard}
      //   selectedCardEmergency
      //   setSelectedCardEmergency={setSelectedCardEmergency}
      // />
      <CommonCard
        duration={item.duration}
        title={item.description}
        date={dateSplit}
        time={timeOnly}
        sentbyname={item.sentby}
        content={item.msgcontent}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        createdby={item.createdby}
        getData={getData}
        cardIndex={index}
        appReadStatus={item.isappread} //no params given
        endContent
        noMarking={isLeftTabSelected ? false : true}
        rowView={voice && selectedCard !== index}
        rowViewText="Play Voice"
        
        playingStop={stopAudio}

        onPressRowView={() =>
          toggleCheck(
            index,
            selectedCard,
            item.msgdetailsid,
            voice,
            emergencyType,
            emergencyType,
          )
        }
        CommunicationPage
        isVoiceMessage={voice}
        onPress={() =>
          toggleCheck(
            index,
            selectedCard,
            item.msgdetailsid,
            voice,
            emergencyType,
            emergencyType,
          )
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <Header
        onSearch
        onRefreshingPage={() => {
          onRefresh();
        }}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />

        <AnimatedSubheaderNav
          leftTab={
            <NavTab
              text="Unread"
              active={isLeftTabSelected}
              count={unreadList.length}
            />
          }
          rightTab={
            <NavTab
              text="Read"
              active={!isLeftTabSelected}
              count={readList.length}
            />
          }
          onLeftTabPress={onLeftTabPress}
          onRightTabPress={onRightTabPress}
          leftTabWrapperStyle={
            isLeftTabSelected
              ? [styles.selectedTabWrapperStyle]
              : [styles.tabWrapperStyle]
          }
          rightTabWrapperStyle={
            !isLeftTabSelected
              ? [styles.selectedTabWrapperStyle]
              : [styles.tabWrapperStyle]
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Communications</Text>
                {readList.length + unreadList.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {readList.length + unreadList.length}
                    </Text>
                  </View>
                ) : null}
              </View>

              { priority == 'p1' || priority == 'p2' || priority == 'p3'?

              (<Text style={{color:Constants.BLACK000,fontSize:12}}>Below messages are sent from the management. Messages that you send to students will not appear here.</Text>):
              null

              }
              {/* <Text style={styles.titleDescription}>
                {priority === 'p1' || priority === 'p2'
                  ? 'Here you can Send Voice/Text Messages to Staff, Parents and Students'
                  : priority === 'p3'
                  ? 'Receive Voice/Text from Management and Also Send  Voice/Text Messages to Parents and Students'
                  : 'Here you can Receive Voice/Text Messages from the Department/College'}
              </Text> */}
            </>
          }
        />
        {isDataAvailable ? (
          <FlatList
            data={isLeftTabSelected ? FilteredUnreadSource : FilteredReadSource}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.viewLastCard}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // ItemSeparatorComponent={() => <View style={{height: 12}} />}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
              No data found
            </Text>
          </View>
        )}
      </ScrollView>
      {(priority === 'p1' || priority === 'p2' || priority === 'p3') && (
        <View>
          <AddButton
            iconName={ICON.MATERIAL_ICON_VOICE}
            isMaterialIcon={true}
            containerStyle={{bottom: 164}}
            onPress={() => onAddCommunication({isVoiceMessage: true})}
          />
          <AddButton
            iconName={'message-processing'}
            onPress={onAddCommunication}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const mapStatetoProps = ({app}) => ({
  collegeId: app?.maindata?.colgid,
  priority: app?.maindata?.priority,
  memberid: app?.maindata?.memberid,
  searchText: app.searchText,
});

export default connect(mapStatetoProps, {
  setBottomSheetData,
})(Communication);

const styles = StyleSheet.create({
  ...stylesForEachTabs,

  noRecord: {
    flex: 1,
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLastCard: {
    paddingBottom: '30%',
    marginTop:20,
    backgroundColor: Constants.WHITE_COLOR,
  },
});
