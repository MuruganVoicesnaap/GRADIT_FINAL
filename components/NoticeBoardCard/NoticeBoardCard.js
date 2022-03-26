import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Constants, FONT} from '../../constants/constants';
import Card from '../Card/card';
import Button from '../Button/button';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {appReadStatus} from '../../redux/actions/appReadStatus';
import {addNoticeApi} from '../../redux/actions/noticeBoard';
import Toast from 'react-native-simple-toast';
const NoticeCard = ({
  priority = '',
  noticeheaderid = '',
  noticedetailsid = '',
  topic = '',
  description = '',
  createdondate = '',
  createdontime = '',
  sentbyname = '',
  createdby = '',
  isappread = '',
  file = '',
  memberName = '',
  onPress = onPress,
  bottomSheetAction,
  memberid,
  selectedCard,
  setSelectedCard,
  cardIndex,
  checkRead = '',
  getData = () => {},
}) => {
  const navigation = useNavigation();
  const [expandedView, setExpandedView] = useState(false);
  const statusChange = () => {
    if (cardIndex === selectedCard) {
      appReadStatus({
        userid: memberid,
        msgtype: 'noticeboard',
        detailsid: noticedetailsid,
        priority: priority,
      });
    }
  };

  const toggleCheck = () => {
    if (cardIndex !== selectedCard) {
      // console.log('checkRead');
      statusChange();
    }
  };
  const deleteConfirm = () =>
    Alert.alert('Delete Notice', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteNotice()},
    ]);

  const deleteNotice = () => {
    addNoticeApi({
      noticeboardid: noticeheaderid,
      colgid: '',
      receiveridlist: '',
      receivertype: '',
      topic: '',
      description: '',
      staffid: '',
      callertype: '',
      processtype: 'delete',
      isstudent: '',
      isparent: '',
      isstaff: '',
    })
      .then(() => {
        getData();
        Toast.show('Deleted Successfully', Toast.LONG);
      })
      .catch(() => {
        Toast.show('Not Fetched Successfully', Toast.LONG);
      });
  };
  return (
    <Card
      style={{
        ...styles.card,
        backgroundColor:
          cardIndex != selectedCard
            ? Constants.CARD_COLOR
            : Constants.BUTTON_SELECTED_COLOR,
      }}
      onPress={() => {
        toggleCheck();
        //setSelectedCard(cardIndex);
        setSelectedCard(-1);
      }}
    >
      {priority !== 'p4' && priority !== 'p5' && (
        <View style={[styles.headerName]}>
          <Text style={styles.headerText}>{sentbyname}</Text>
        </View>
      )}
      <View style={[styles.row, styles.firstRow]}>
        <View style={[styles.verticalLineCard]}>
          <Text
            style={[
              styles.titleShown,
              {
                color:
                  cardIndex != selectedCard
                    ? Constants.DARK_COLOR
                    : Constants.WHITE_COLOR,
              },
            ]}
          >
            {topic}
          </Text>
        </View>
        <View style={styles.dateTimeView}>
          <View style={{...styles.row}}>
            <Icons
              name="calendar-blank"
              size={16}
              color={
                cardIndex != selectedCard
                  ? Constants.DARK_COLOR
                  : Constants.WHITE_COLOR
              }
            />
            <Text
              style={[
                styles.dateShown,
                {
                  color:
                    cardIndex != selectedCard
                      ? Constants.DARK_COLOR
                      : Constants.WHITE_COLOR,
                },
              ]}
            >
              {createdondate}
            </Text>
          </View>
          <View style={{...styles.row}}>
            <Icons
              name="clock-time-five-outline"
              size={16}
              color={
                cardIndex != selectedCard
                  ? Constants.DARK_COLOR
                  : Constants.WHITE_COLOR
              }
            />
            <Text
              style={[
                styles.timeShown,
                {
                  color:
                    cardIndex != selectedCard
                      ? Constants.DARK_COLOR
                      : Constants.WHITE_COLOR,
                },
              ]}
            >
              {createdontime}
            </Text>
          </View>
          {cardIndex != selectedCard ? (
            <TouchableOpacity
              style={[styles.row3, styles.moreAttachmentView]}
              onPress={() => {
                setSelectedCard(cardIndex);
              }}
            >
              <Icons
                name="chevron-down-circle-outline"
                color={Constants.SKY_BLUE_COLOR}
                backgroundColor={Constants.WHITE_COLOR}
                // borderColor={Constants.SKY_BLUE_COLOR}
                //color={Constants.WHITE_COLOR}
                size={18}
                style={{right: '5%'}}
              />
              <Text
                style={{
                  color: Constants.SKY_BLUE_COLOR,
                  fontSize: 18,
                  bottom: 1,
                  left: 4,
                }}
              >
                more
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {cardIndex === selectedCard ? (
        <>
          <View style={[styles.horizontalLine, styles.halfHorizonLine]} />
          <Text
            style={[
              styles.describeText,
              {
                color:
                  cardIndex != selectedCard
                    ? Constants.DARK_COLOR
                    : Constants.WHITE_COLOR,
              },
            ]}
          >
            {description}
          </Text>
          {memberid.toString() === createdby ? (
            <View style={[styles.row]}>
              <View style={styles.flexFull} />
              <View style={[styles.flexFull, styles.row]}>
                <Button
                  style={styles.buttonBackground}
                  onPress={() => {
                    bottomSheetAction({hideSheet: true});
                    navigation.navigate('AddNotice', {
                      id: noticeheaderid,
                      title: topic,
                      describe: description,
                      edit: 'edit',
                    });
                  }}
                >
                  <Icon
                    name="edit"
                    size={16}
                    color={Constants.BUTTON_SELECTED_COLOR}
                  />
                  <Text style={styles.ButtonText}>Edit</Text>
                </Button>
                <Button
                  style={styles.buttonBackgroundFull}
                  onPress={() => {
                    deleteConfirm();
                  }}
                >
                  <Icon name="delete" size={16} color={Constants.WHITE_COLOR} />
                  <Text style={styles.ButtonTextWhite}>Delete</Text>
                </Button>
              </View>
            </View>
          ) : null}
          {priority === 'p4' || priority === 'p5' ? (
            <>
              <View
                style={[
                  styles.horizontalLine,
                  {borderBottomColor: Constants.BLACK000},
                ]}
              />

              <View style={[styles.row, styles.senderView]}>
                <Text>posted by :</Text>
                <Text style={styles.senderName}>{sentbyname}</Text>
              </View>
            </>
          ) : null}
        </>
      ) : null}
    </Card>
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
export default connect(mapStatetoProps, mapDispatchToProps)(NoticeCard);
const styles = StyleSheet.create({
  Text: {
    fontFamily: FONT.primaryMedium,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  flexFull: {flex: 1},
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '95%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
    flex: 1,
  },
  firstRow: {alignItems: 'center', justifyContent: 'space-between'},
  titleShown: {
    fontWeight: Constants.FONT_WEI_BOLD,
    marginLeft: 5,
    color: Constants.DARK_COLOR,
  },
  dateTimeView: {alignSelf: 'flex-start', flex: 1, marginVertical: '3%'},
  dateShown: {
    fontSize: Constants.FONT_BADGE,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
  },
  timeShown: {
    fontSize: Constants.FONT_BADGE,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.TEXT_INPUT_COLOR,
    // paddingHorizontal:"2%",
    marginLeft: '4%',
    marginRight: '4%',
  },
  verticalLineCard: {
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
    marginVertical: '3%',
    flex: 2,
  },

  halfHorizonLine: {
    borderBottomColor: '#000000',
    width: '50%',
    alignSelf: 'flex-start',
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '100%',
    alignSelf: 'center',
    marginVertical: '4%',
    marginBottom: '2%',
  },
  headerName: {
    flexDirection: 'row',
    backgroundColor: Constants.BLUE001,
    borderRadius: 20,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  moreAttachmentView: {
    flexDirection: 'row',
    borderWidth: 0,
    width: 100,
    borderColor: Constants.WHITE_COLOR,
    borderRadius: 0,
    paddingVertical: '1%',
    //justifyContent: 'center',
    alignItems: 'center',
    left: '-4%',
  },
  row3: {
    top: 10,
    flexDirection: 'row',
  },
  headerText: {
    color: Constants.CALENDAR_HEAD_COLOR,
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_FULL_LOW,
    paddingHorizontal: 2,
  },
  describeText: {
    fontSize: Constants.FONT_FULL_LOW,
    color: Constants.DARK_COLOR,
    marginVertical: '2%',
    fontFamily: FONT.primaryRegular,
  },
  buttonBackground: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    width: '50%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBackgroundFull: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.BUTTON_RED_COLOR,
    width: '50%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  ButtonTextWhite: {
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  senderView: {alignSelf: 'flex-end', marginTop: 5},
  senderName: {
    paddingVertical: 2,
    paddingHorizontal: '3%',
    backgroundColor: Constants.POSTED_BY_COLOR,
    borderRadius: 15,
    marginLeft: 5,
  },
});
