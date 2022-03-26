/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import TrackPlayer from 'react-native-track-player';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import {deleteText} from '../../redux/actions/addTextCommunication';
import {appReadStatus} from '../../redux/actions/appReadStatus';
import {AudioSlider} from '../AudioSlider/AudioSlider';
import {CommonDateTime} from '../DateTime/CommonDateTime';
import More from '../More';

export const CommunicationCard = ({
  cardIndex,
  checkRead = '',
  isVoiceMessage = true,
  isEmergencyMessage = false,
  emergencyType = '',
  title = '',
  date = '',
  time = '',
  videoSec = '',
  content = '',
  postedBy = '',
  voiceMessageUrl = '',
  priority,
  memberid,
  msgdetailsid,
  collegeId,
  getData = () => {},
  selectedCard,
  setSelectedCard,
  setSelectedCardEmergency,
}) => {
  const [isVoiceMessagePlaying, setIsVoiceMessagePlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');

  const Icon = isVoiceMessage ? MaterialIcons : Icons;

  const handleVoiceMessagePlayPress = async voiceURL => {
    if (audioStatus === 'paused') {
      TrackPlayer.play();
      console.log({voiceURL});
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
      return;
    }
    console.log(',.,.,.,.', {voiceURL});
    Alert.alert('you came here..,');
    try {
      await TrackPlayer.setupPlayer();
      console.log({voiceURL});
      await TrackPlayer.add({
        id: '1',
        url: voiceURL,
        type: 'default',
        // artist: 'Gradit',
        // title: 'default',
      });
      TrackPlayer.play();
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
    } catch (error) {
      console.log('Audio Error....', error);
      Alert.alert('you came here..,');
    }
  };

  const stopVoiceMessage = async () => {
    TrackPlayer.stop();
    setAudioStatus('');
    setIsVoiceMessagePlaying(false);
  };

  const statusChange = () => {
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

  const handleVoiceMessagePausePress = async () => {
    TrackPlayer.pause();
    setIsVoiceMessagePlaying(false);
    setAudioStatus('paused');
  };

  const toggleCheck = () => {
    if (cardIndex !== selectedCard && checkRead !== 'true') {
      // console.log('checkRead');
      statusChange();
    }
  };
  const deleteCheck = () => {
    Alert.alert('Confirm Delete', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onDelete()},
    ]);
  };
  const onDelete = () => {
    deleteText({
      headerid: msgdetailsid,
      userid: memberid,
      collegeid: collegeId,
    })
      .then(data => {
        Toast.show(data.Message, Toast.LONG);
        getData();
      })
      .catch(data => {
        Toast.show('Failed to Fetch', Toast.LONG);
      });
  };

  const moreInfo = () => {
    setSelectedCard(cardIndex);
  };

  return (
    <TouchableOpacity
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      onPress={() => {
        toggleCheck();
        stopVoiceMessage();
        {
          cardIndex === selectedCard
            ? setSelectedCard(-1)
            : setSelectedCard(cardIndex);
        }
      }}
    >
      <View
        style={[
          styles.container,
          isEmergencyMessage ? styles.emergencyBackground : null,
        ]}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              isEmergencyMessage
                ? {backgroundColor: Constants.WHITE_COLOR}
                : isVoiceMessage
                ? styles.voiceMessageBgColor
                : null,
            ]}
          >
            <Icon
              name={
                isVoiceMessage ? ICON.MATERIAL_ICON_VOICE : 'message-processing'
              }
              size={14}
              color={
                isEmergencyMessage
                  ? Constants.ORANGERED001
                  : Constants.WHITE_COLOR
              }
            />
          </View>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                isEmergencyMessage ? styles.emergencyTextColor : null,
              ]}
            >
              {title}
            </Text>
          </View>
          <CommonDateTime date={date} time={time} />
          {/* <View
            style={[{alignItems: 'flex-end', textAlign: 'right', bottom: '0%'}]}
          >
            <Text style={styles.dateView}>{date}</Text>
            <Text style={styles.timeView}>{time}</Text>
          </View> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: isVoiceMessage ? null : 'row',
                justifyContent: isVoiceMessage ? null : 'space-between',
              }}
            >
              <View
                style={[
                  styles.subText,
                  isEmergencyMessage ? styles.emergencyTextColor : null,
                  isVoiceMessage
                    ? styles.showContent
                    : cardIndex !== selectedCard
                    ? styles.showContent
                    : null,
                ]}
              >
                {isVoiceMessage ? (
                  <>
                    {cardIndex !== selectedCard ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          width: '53%',
                          borderColor: Constants.DARK_COLOR,
                          borderRadius: 6,
                          paddingVertical: '1%',
                        }}
                      >
                        <Icons
                          name="play"
                          size={18}
                          color={Constants.BUTTON_SELECTED_COLOR}
                          style={{left: -5}}
                        />
                        <Text style={{left: 0}}>Play Voice</Text>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <Text numberOfLines={1} style={styles.discText}>
                    {content}
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'column', textAlign: 'right'}}>
            {cardIndex != selectedCard ? <More moreInfo={moreInfo} /> : null}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setSelectedCard(-1);
            setSelectedCardEmergency(-1);
          }}
        >
          <View
            style={[
              styles.contentContainer,
              cardIndex === selectedCard ? styles.showContent : null,
            ]}
          >
            {isVoiceMessage ? (
              <View style={styles.voiceBox}>
                <TouchableOpacity
                  onPress={() => {
                    isVoiceMessagePlaying
                      ? handleVoiceMessagePausePress()
                      : handleVoiceMessagePlayPress(voiceMessageUrl);
                  }}
                  style={styles.playPauseButton}
                >
                  <Icon
                    color={Constants.WHITE_COLOR}
                    size={16}
                    name={isVoiceMessagePlaying ? 'pause' : 'play-arrow'}
                  />
                </TouchableOpacity>
                {cardIndex === selectedCard ? (
                  <AudioSlider
                    setIsVoiceMessagePlaying={setIsVoiceMessagePlaying}
                    isVoiceMessagePlaying={isVoiceMessagePlaying}
                    isSelectedCard={cardIndex === selectedCard}
                    audioStatus={audioStatus}
                  />
                ) : null}
              </View>
            ) : (
              <Text
                style={[
                  styles.content,
                  isEmergencyMessage ? styles.emergencyTextColor : null,
                ]}
              >
                {content}
              </Text>
            )}
            <View style={styles.footer}>
              <Text style={[styles.postedName]}>Posted by: </Text>
              <View
                style={[
                  styles.postedNameBox,
                  isEmergencyMessage
                    ? {backgroundColor: Constants.WHITE_COLOR}
                    : null,
                ]}
              >
                <Text style={styles.postedName}>{postedBy}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Constants.CARD_COLOR,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  emergencyBackground: {
    backgroundColor: Constants.ORANGERED001,
  },
  emergencyTextColor: {
    color: Constants.WHITE_COLOR,
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    maxWidth: '75%',
    height: undefined,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 30,
    marginEnd: 8,
    backgroundColor: Constants.ICON_BACKGROUND_COLOR,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMessageBgColor: {
    backgroundColor: Constants.VIOLET002,
  },
  titleContainer: {
    alignItems: 'flex-start',
    //flex: 1,
    width: '90%',
  },
  title: {
    fontSize: 16,
    lineHeight: 17,
    color: Constants.BLACK000,
    fontFamily: FONT.primaryBold,
    maxWidth: '100%',
    alignSelf: 'stretch',
    top: 7,
    //backgroundColor: 'red',
  },
  subText: {
    fontSize: 11,
    lineHeight: 16,
    color: Constants.BLACK000,
    marginTop: 8,
    display: 'none',
    fontFamily: FONT.primaryRegular,
    flexDirection: 'row',
  },
  dateTime: {
    color: Constants.BLACK003,
    //marginBottom: 4,
    //top: -20,
    fontSize: 11,
    paddingVertical: 0,
    // left: '380%',
    flexDirection: 'column',
  },
  contentContainer: {
    marginTop: 8,
    display: 'none',
  },
  content: {
    fontSize: 11,
    lineHeight: 16,
    paddingLeft: 38,
    color: Constants.BLACK000,
    fontFamily: FONT.primaryRegular,
  },
  showContent: {
    display: 'flex',
  },
  voiceBox: {
    borderRadius: 26,
    backgroundColor: Constants.WHITE_COLOR,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 36,
    maxWidth: '80%',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Constants.TEXT_INPUT_COLOR,
    marginTop: 10,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  postedNameBox: {
    borderRadius: 42,
    paddingVertical: 6,
    paddingHorizontal: 11,
    backgroundColor: Constants.GREY001,
  },
  postedName: {
    color: Constants.BLACK000,
    fontSize: 10,
    lineHeight: 12,
    fontFamily: FONT.primaryRegular,
  },
  playPauseButton: {
    backgroundColor: Constants.GREEN001,
    width: 22,
    height: 22,
    borderRadius: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //marginRight: 5,
    margin: 3,
  },
  voiceDurationBarWrapper: {
    // marginLeft: 5,
    flexGrow: 1,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(93, 176, 151, 0.14)',
    borderRadius: 30,
    height: 4,
  },
  voiceElapsedBar: {
    height: 4,
    backgroundColor: Constants.GREEN001,
  },
  voiceCurrentPosition: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Constants.GREEN001,
  },
  voiceRemainingBar: {
    height: 4,
    backgroundColor: Constants.GREEN001,
    opacity: 0.3,
  },
  voiceTimeStatusWrapper: {
    marginLeft: 20,
    width: 60,
  },

  deleteButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    borderColor: Constants.BUTTON_RED_COLOR,
    borderWidth: 1,
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_RED_COLOR,
  },
  moreAttachmentView: {
    flexDirection: 'row',
    borderWidth: 0,
    width: '60%',
    borderColor: 'red',
    borderRadius: 0,
    paddingVertical: '1%',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingTop: 8,
    // backgroundColor: 'red',
  },
  row: {
    flexDirection: 'column',
    width: '25%',
    height: 40,
    bottom: 20,
    top: -1,
    // marginLeft: 30,
  },
  discText: {
    color: Constants.BLACK000,
    fontFamily: FONT.primaryRegular,
    maxWidth: '80%',
  },
  dateView: {
    fontSize: Constants.FONT_TEN,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
    top: -3,
  },
  timeView: {
    fontSize: 12,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
  },
});
