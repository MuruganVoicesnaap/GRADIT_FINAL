/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {Constants, FONT, ICON} from '../constants/constants';
import Button from './Button/button';
import Card from './Card/card';
import {Pill} from './Pill/Pill';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Forward from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {CommonDateTime} from './DateTime/CommonDateTime';
import {setBottomSheetData} from '../redux/actions/setBottomSheetData';
import More from '../components/More';
import capitalizeFirstChar from '../screen/DashboardHome/util/capitializeFirstChar';
import TrackPlayer from 'react-native-track-player';
import {AudioSlider} from './AudioSlider/AudioSlider';
const CommonCard = ({
  duration,
  CardContainerStyle = {},
  loading,
  memberid = '',
  priority = '',
  title = '',
  date = '',
  time = '',
  content = '',
  createdby = '',
  appReadStatus = '0',
  onPress,
  rowView,
  rowViewText,
  onPressRowView,
  endContent,
  cardIndex,
  selectedCard,
  setSelectedCard,
  sentbyname = '',
  filePath = '',
  pillBottomSpace,
  newfilepath,
  userfilename,
  attachment,
  editButton,
  submitButton,
  submitOnPress,
  viewButton,
  viewButtonText = '',
  deleteButton,
  viewOnPress,
  editOnPress,
  deleteOnPress,
  submittedcount = '',
  lastDateSubmission = '',
  noMarking,
  CommunicationPage,
  AssignmentPage,
  editButtonText,
  isVoiceMessage = false,
  isEmergencyMessage = false,

  playingStop,

  getData = () => {},
}) => {
  const fileName = userfilename?.split('/').pop();
  const [checkAppRead, setCheckAppRead] = useState(appReadStatus);
  const [isVoiceMessagePlaying, setIsVoiceMessagePlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');
  const IconCommunication = isVoiceMessage ? Icon : Icons;
  const additionalCount = newfilepath ? newfilepath.length - 1 : 0;


  if(playingStop) {
    audioStatus == 'playing'?   TrackPlayer.stop():null
  }

  const handleVoiceMessagePlayPress = async voiceURL => {
    if (audioStatus === 'paused') {
      TrackPlayer.play();
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
      return;
    }
    console.log({voiceURL});
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        // id: '1',
        // url: voiceURL,
        // type: 'default',
        // artist: 'test',
        url: voiceURL, // Load media from the network
        title: 'Avaritia',
        artist: 'deadmau5',
      });
      await TrackPlayer.play();
      setAudioStatus('playing');
      setIsVoiceMessagePlaying(true);
    } catch (error) {
      console.log('Audio Error,,,,', error);
    }
  };
  const handleVoiceMessagePausePress = async () => {
    TrackPlayer.pause();
    setIsVoiceMessagePlaying(false);
    setAudioStatus('paused');
  };

  const stopVoiceMessage = async () => {
    if (CommunicationPage) {
      TrackPlayer.stop();
      setAudioStatus('');
      setIsVoiceMessagePlaying(false);
    }
  };
  return (
    <Card
      style={[styles.card, CardContainerStyle]}
      onPress={() => {
        onPress();
        setCheckAppRead('1');
        stopVoiceMessage();
      }}
    >
      {Number(checkAppRead) === 0 && !noMarking ? (
        <View style={styles.countContainer} />
      ) : null}
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />

      <View style={styles.row}>
        <View
          style={[
            styles.titleContainer,
            {
              alignSelf: CommunicationPage ? 'flex-start' : null,
            },
          ]}
        >
          {CommunicationPage ? (
            <View style={{flexDirection: 'row'}}>
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
                <IconCommunication
                  name={
                    isVoiceMessage
                      ? ICON.MATERIAL_ICON_VOICE
                      : 'message-processing'
                  }
                  size={14}
                  color={
                    isEmergencyMessage
                      ? Constants.ORANGERED001
                      : Constants.WHITE_COLOR
                  }
                />
              </View>
              <Text
                style={
                  CommunicationPage ? styles.titleOnCommunication : styles.title
                }
                numberOfLines={cardIndex === selectedCard ? null : 1}
              >
                {capitalizeFirstChar(title)}
              </Text>
            </View>
          ) : (
            <View style={styles.titleLine}>
              <Text
                style={styles.title}
                numberOfLines={cardIndex === selectedCard ? null : 1}
              >
                {capitalizeFirstChar(title)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.dateTimeView}>
          <CommonDateTime date={date} time={time} />
        </View>
      </View>

      {cardIndex === selectedCard ? (
        <>
          {isVoiceMessage ? (
            <View style={styles.voiceBox}>
              <TouchableOpacity
                onPress={() => {
                  isVoiceMessagePlaying
                    ? handleVoiceMessagePausePress()
                    : handleVoiceMessagePlayPress(content);
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
                  durationfromBackend={duration}
                />
              ) : null}
            </View>
          ) : null}
          {!isVoiceMessage ? (
            <Text style={styles.description}>{content}</Text>
          ) : null}
          {AssignmentPage ? (
            <View style={[styles.row, {marginTop: 3}]}>
              <View style={{flex: 1}}>
                <Pill
                  text={sentbyname}
                  containerStyle={{...styles.pillContainerStyle}}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.submissionDateText}>Submission on</Text>

                <Pill
                  text={lastDateSubmission}
                  containerStyle={styles.pillContainerStyleDate}
                />
              </View>
            </View>
          ) : (
            <Pill
              text={sentbyname}
              containerStyle={[
                styles.pillContainerStyle,
                {
                  marginBottom:
                    (priority === 'p4' || priority === 'p5') && pillBottomSpace
                      ? 8
                      : null,
                },
              ]}
            />
          )}
          {newfilepath?.length && AssignmentPage ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 2, alignSelf: 'center'}}>
                {attachment ? (
                  <>
                    {newfilepath?.length && (
                      <View style={styles.attachmentWrapperStyle}>
                        <Pill
                          text={fileName.split(',').pop()}
                          icon={ICON.ATTACHMENTS}
                          containerStyle={styles.attachmentStyle}
                          textStyle={{fontFamily: FONT.primaryBold}}
                          numberOfLines={2}
                          onPress={onPressRowView}
                        />
                        {additionalCount > 0 && (
                          <Pill
                            text={`+${additionalCount}`}
                            containerStyle={styles.extraAttachmentStyle}
                            onPress={onPressRowView}
                          />
                        )}
                      </View>
                    )}
                  </>
                ) : null}
              </View>
            </View>
          ) : null}
          {priority !== 'p4' && priority !== 'p5' ? (
            <>
              <View style={[styles.row]}>
                <View
                  style={([styles.row], {flex: 1, marginTop: 7, paddingTop: 3})}
                >
                  <View style={styles.actionButtonContainer}>
                    {/* Delete feature is on discussion */}
                    {deleteButton && memberid.toString() === createdby ? (
                      <Button
                        style={[
                          styles.buttonBackground,
                          {
                            borderColor: Constants.BUTTON_RED_COLOR,

                            width: 'auto',
                            paddingHorizontal: 8,
                          },
                        ]}
                        onPress={deleteOnPress}
                      >
                        <Icon
                          name="delete"
                          size={16}
                          color={Constants.BUTTON_RED_COLOR}
                        />
                        {/* <Text
                          style={[
                            styles.ButtonText,
                            {color: Constants.BUTTON_RED_COLOR},
                          ]}
                        >
                          Delete
                        </Text> */}
                      </Button>
                    ) : null}
                    {editButton && memberid.toString() === createdby ? (
                      <Button
                        style={[
                          styles.buttonBackground,
                          {width: 'auto', paddingHorizontal: 8},
                        ]}
                        onPress={editOnPress}
                      >
                        {editButtonText ? (
                          <Forward
                            name="forward"
                            size={16}
                            color={Constants.BUTTON_SELECTED_COLOR}
                          />
                        ) : (
                          <Icon
                            name="edit"
                            size={16}
                            color={Constants.BUTTON_SELECTED_COLOR}
                          />
                        )}
                        {/* <Text style={styles.ButtonText}>
                          {editButtonText ? editButtonText : 'Edit'}
                        </Text> */}
                      </Button>
                    ) : null}

                    {viewButton ? (
                      <Button
                        style={[
                          styles.buttonBackground,
                          {
                            borderColor: Constants.GREEN002,
                            width: 'auto',
                            paddingHorizontal: 8,
                          },
                        ]}
                        onPress={viewOnPress}
                      >
                        <Icon
                          name="remove-red-eye"
                          size={16}
                          color={Constants.GREEN002}
                        />

                        <Text
                          style={[
                            styles.ButtonText,
                            {color: Constants.GREEN002},
                          ]}
                        >
                          {viewButtonText && submittedcount
                            ? `${viewButtonText}${
                                Number(submittedcount) > 1 ? 's' : ''
                              } (${submittedcount})`
                            : 'View'}
                        </Text>
                      </Button>
                    ) : null}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.row]}>
                <View
                  style={([styles.row], {flex: 1, marginTop: 7, paddingTop: 3})}
                >
                  <View style={styles.actionButtonContainer}>
                    {viewButton ? (
                      <View style={styles.actionButtonContainer}>
                        <Button
                          style={[
                            styles.buttonBackground,
                            {
                              borderColor: AssignmentPage
                                ? Constants.BUTTON_SELECTED_COLOR
                                : Constants.GREEN002,
                              width: 'auto',
                              paddingHorizontal: 8,
                            },
                          ]}
                          onPress={viewOnPress}
                        >
                          {!AssignmentPage ? (
                            <Icon
                              name="remove-red-eye"
                              size={16}
                              color={
                                AssignmentPage
                                  ? Constants.BUTTON_SELECTED_COLOR
                                  : Constants.GREEN002
                              }
                            />
                          ) : null}
                          <Text
                            style={[
                              styles.ButtonText,
                              {
                                color: AssignmentPage
                                  ? Constants.BUTTON_SELECTED_COLOR
                                  : Constants.GREEN002,
                                paddingLeft: AssignmentPage ? 0 : 5,
                              },
                            ]}
                          >
                            {viewButtonText ? viewButtonText : 'View'}
                          </Text>
                        </Button>
                      </View>
                    ) : null}
                    {submitButton ? (
                      <View style={styles.actionButtonContainer}>
                        <Button
                          style={[
                            styles.buttonBackground,
                            {
                              borderColor: Constants.GREEN002,
                              width: 'auto',
                              paddingHorizontal: 8,
                            },
                          ]}
                          onPress={submitOnPress}
                        >
                          {/* <Icon
                            name="remove-red-eye"
                            size={16}
                            color={Constants.GREEN002}
                          /> */}
                          <Text
                            style={[
                              styles.ButtonText,
                              {color: Constants.GREEN002, paddingLeft: 0},
                            ]}
                          >
                            Submit
                          </Text>
                        </Button>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
              {/* {endContent ? (
                <>
                  <Pill
                    text={sentbyname}
                    containerStyle={styles.pillContainerStyle}
                  />
                </>
              ) : null} */}
              {/* <View style={styles.horizontalLine} />
                  <View style={styles.footer}>
                    <Text style={[styles.postedName]}>Posted by: </Text>
                    <Pill text={sentbyname} />
                  </View> */}
            </>
          )}
        </>
      ) : null}
      {rowView ? (
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2, alignSelf: 'center'}}>
            {attachment ? (
              <>
                {newfilepath?.length && (
                  <View style={styles.attachmentWrapperStyle}>
                    <Pill
                      text={fileName.split(',').pop()}
                      icon={ICON.ATTACHMENTS}
                      containerStyle={styles.attachmentStyle}
                      textStyle={{fontFamily: FONT.primaryBold}}
                      numberOfLines={2}
                      onPress={onPressRowView}
                    />
                    {additionalCount > 0 && (
                      <Pill
                        text={`+${additionalCount}`}
                        containerStyle={styles.extraAttachmentStyle}
                        onPress={onPressRowView}
                      />
                    )}
                  </View>
                )}
              </>
            ) : (
              <TouchableOpacity
                onPress={onPressRowView}
                style={
                  CommunicationPage
                    ? styles.attachmentViewCommunication
                    : styles.attachmentView
                }
              >
                <Icons name="play" size={18} color={Constants.BLACK007} />
                <Text
                  style={
                    CommunicationPage
                      ? styles.attachmentTextCommunication
                      : styles.attachmentText
                  }
                >
                  {rowViewText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              right: -3,
              bottom: -3,
            }}
          >
            <More
              show={true}
              selectedCard={selectedCard}
              cardIndex={cardIndex}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            alignSelf: 'flex-end',
          }}
        >
          <More
            show={false}
            selectedCard={selectedCard}
            cardIndex={cardIndex}
          />
        </View>
      )}
    </Card>
  );
};

const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  collegeid: app.maindata?.colgid,
});

export default connect(mapStatetoProps, null)(CommonCard);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 2.5,
    // alignSelf: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginRight: 5,
  },
  dateTimeView: {
    flex: 0.75,
  },
  submissionDateText: {
    fontFamily: FONT.primaryBold,
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  voiceBox: {
    borderRadius: 26,
    backgroundColor: Constants.CARD_COLOR,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 36,
    maxWidth: '80%',
    marginVertical: 5,
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

  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 175, 130, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceMessageBgColor: {
    backgroundColor: 'rgba(130, 142, 255, 0.5)',
  },
  countContainer: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    height: 12,
    width: 12,
    position: 'absolute',
    right: -6,
    top: -6,
  },
  attachmentViewCommunication: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 85,
    borderColor: Constants.DARK_COLOR,
    borderRadius: 6,
    paddingVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  attachmentTextCommunication: {
    fontSize: 12,
    color: Constants.DARK_COLOR,
    paddingHorizontal: '1%',
    paddingLeft: 3,
  },
  attachmentView: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 100,
    borderColor: Constants.DARK_COLOR,
    borderRadius: 6,
    paddingVertical: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    paddingHorizontal: '1%',
    paddingLeft: 3,
  },
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: undefined,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 5,
    flex: 1,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.GREY091,
    // marginTop: 12,
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
  buttonBackground: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    width: '25%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  actionButtonText: {
    fontSize: Constants.FONT_BADGE,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pillContainerStyle: {
    backgroundColor: Constants.BLUE001,
    alignSelf: 'flex-start',
    height: 20,
    marginTop: 8,
  },
  pillContainerStyleDate: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-end',
    height: 20,
    marginTop: 1,
  },
  attachmentWrapperStyle: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 160,
  },
  extraAttachmentStyle: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  titleLine: {
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    lineHeight: Constants.FONT_BADGE * 1.3,
    marginStart: 8,
  },
  titleOnCommunication: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    lineHeight: Constants.FONT_BADGE * 1.3,
    marginStart: 3,
    width: '90%',
    flexWrap: 'wrap',
  },
  attachmentStyle: {
    borderWidth: 1,
    borderColor: Constants.GREY091,
    backgroundColor: 'transparent',
    maxWidth: 200,
    minHeight: 24,
    height: 'auto',
    paddingVertical: 2,
  },
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    color: Constants.BLACK003,
    lineHeight: Constants.FONT_BADGE * 1.3,
    marginTop: 8,
  },
  postedName: {
    color: Constants.BLACK000,
    fontSize: Constants.FONT_BADGE,
    fontFamily: FONT.primaryRegular,
  },
  footer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  row3: {
    top: 10,
    flexDirection: 'row',
    left: '-25%',
  },
});
