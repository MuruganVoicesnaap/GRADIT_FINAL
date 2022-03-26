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
import {DateTime} from '../DateTime/DateTime';

export const CommunicationCardEmergency = ({
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
  selectedCardEmergency,
  setSelectedCardEmergency,
  setSelectedCard,
}) => {
  const [isVoiceMessagePlaying, setIsVoiceMessagePlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');

  const Icon = isVoiceMessage ? MaterialIcons : Icons;

  const handleVoiceMessagePlayPress = async voiceURL => {
    if (audioStatus === 'paused') {
      TrackPlayer.play();
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
      return;
    }
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: '1',
        url: voiceURL,
        type: 'default',
        artist: 'Gradit',
        title: 'test',
      });
      TrackPlayer.play();
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
    } catch (error) {
      console.log('Audio Error', error);
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
    if (cardIndex !== selectedCardEmergency && checkRead !== 'true') {
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

  return (
    <TouchableOpacity
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      onPress={() => {
        toggleCheck();
        stopVoiceMessage();
        setSelectedCardEmergency(cardIndex);
        setSelectedCard(-1);
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
          <DateTime
            date={date}
            time={time}
            textStyle={StyleSheet.flatten([
              styles.dateTime,
              isEmergencyMessage ? styles.emergencyTextColor : null,
            ])}
          />
        </View>
        <View
          style={{
            flexDirection: isVoiceMessage ? null : 'row',
            justifyContent: isVoiceMessage ? null : 'space-between',
          }}
        >
          <Text
            style={[
              styles.subText,
              isEmergencyMessage ? styles.emergencyTextColor : null,
              isVoiceMessage
                ? styles.showContent
                : cardIndex !== selectedCardEmergency
                ? styles.showContent
                : null,
            ]}
          >
            {isVoiceMessage ? (
              <>
                <Text>
                  Voice Message
                  {/* | {videoSec} secs */}
                </Text>
              </>
            ) : (
              'Read Message'
            )}
          </Text>
        </View>
        <View
          style={[
            styles.contentContainer,
            cardIndex === selectedCardEmergency ? styles.showContent : null,
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
              {cardIndex === selectedCardEmergency ? (
                <AudioSlider
                  setIsVoiceMessagePlaying={setIsVoiceMessagePlaying}
                  isVoiceMessagePlaying={isVoiceMessagePlaying}
                  isSelectedCard={cardIndex === selectedCardEmergency}
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
    paddingTop: 22,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginEnd: 8,
    backgroundColor: Constants.ICON_BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMessageBgColor: {
    backgroundColor: Constants.VIOLET002,
  },
  titleContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    color: Constants.BLACK000,
    fontFamily: FONT.primaryBold,
  },
  subText: {
    fontSize: 11,
    lineHeight: 16,
    color: Constants.BLACK000,
    marginTop: 8,
    display: 'none',
    fontFamily: FONT.primaryRegular,
  },
  dateTime: {
    color: Constants.BLACK003,
    // marginBottom: 4,
    fontSize: 11,
    paddingVertical: 1,
    paddingLeft: 3,
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
    padding: 6,
    marginLeft: 36,
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
    marginRight: 5,
    margin: 10,
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
});
