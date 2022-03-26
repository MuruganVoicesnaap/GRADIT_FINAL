import React, {useEffect, useRef, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {Constants, FONT, ICON} from '../../../../constants/constants';
import {AudioActionButton} from './AudioActionButton';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Switch,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer from 'react-native-track-player';
import AudioProgress from '../../../../components/AudioProgress/AudioProgress';

const RECORDING = 'RECORDING';
const STOP_RECORD = 'STOP_RECORD';
const PLAY_RECORD = 'PLAY_RECORD';

export const VoiceRecord = ({
  setRecordTime = () => null,
  recordTime = 0,
  setFile,
  onConfirm = () => {},
  navigation,
  versionInfo,
  isEnabled,
  setIsEnabled,
  playerStoped,
  setPlayerStoped,
  //playTime,
}) => {
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer()).current;
  const [audioAction, setAudioAction] = useState(null);
  //const [playTime, setPlayTime] = useState(0);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [recordingShow, setRecordingShow] = useState(false);
  const [toggleToch, setToggleTouch] = useState(true);
  const [emergencyTimeLimit, setEmergencyTimeLimit] = useState('');
  const [nonemergencyTimeLimit, setNonEmergencyTimeLimit] = useState('');
  const screenWidth = Dimensions.get('screen').width;
  const [audioRecord, setAudioRecord] = useState({
    currDurationSec: 0,
    currPositionSec: 0,
    playTime,
    duration,
  });
  const {currDurationSec, currPositionSec, playTime, duration} = audioRecord;

  let playWidth = (currDurationSec / currPositionSec) * (screenWidth - 56);

  if (!playWidth) {
    playWidth = 0;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return async () => {
      setAudioAction(null);
      await audioRecorderPlayerRef.stopRecorder();
      audioRecorderPlayerRef.removeRecordBackListener();
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  // console.log(',,,,,,, version info,,,,,', versionInfo);
  // console.log(
  //   ',,,,,,, version info,,,,,',
  //   versionInfo.emergency,
  //   versionInfo.nonemergency,
  // );

  useEffect(() => {
    console.log('.......', playerStoped);
    onStopPlay();
    setPlayerStoped(false);
    setEmergencyTimeLimit(0);
    setNonEmergencyTimeLimit(0);
    setToggleTouch(true);
    recordTime = 0;
  }, [playerStoped, setPlayerStoped]);

  //const toggleEmergency = () => setIsEnabled(previousState => !previousState);
  // setEmergencyMessage(prevState => (prevState ? 0 : 1));

  const backAction = async () => {
    await audioRecorderPlayerRef.pauseRecorder();
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: async () => await audioRecorderPlayerRef.resumeRecorder(),
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: async () => {
          onStopPlay();
          setAudioAction(STOP_RECORD);
          await audioRecorderPlayerRef.stopRecorder();
          audioRecorderPlayerRef.removeRecordBackListener();
          return navigation.goBack();
        },
      },
    ]);
    return true;
  };
  //console.log(audioAction, typeof audioAction);
  // console.log('£££££', currDurationSec, currPositionSec);
  // console.log('£££££', currDurationSec);
  useEffect(() => {
    emergencyTime(versionInfo.emergency);
    nonEmergencyTime(versionInfo.nonemergency);
  }, []);
  const emergencyTime = e => {
    var m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, '0'),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, '0');
    setEmergencyTimeLimit(m + ':' + s);
    return console.log(m + ':' + s);
  };
  const nonEmergencyTime = e => {
    var m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, '0'),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, '0');
    setNonEmergencyTimeLimit(m + ':' + s);
    return console.log(m + ':' + s);
  };

  const onStartRecord = async audioAction => {
    setToggleTouch(false);
    setRecordingShow(true);
    try {
      await audioRecorderPlayerRef.startRecorder();
      audioRecorderPlayerRef?.addRecordBackListener(e => {
        setRecordTime(
          audioRecorderPlayerRef.mmssss(Math.floor(e.currentPosition)),
        );
        let currentTime = audioRecorderPlayerRef.mmssss(
          Math.floor(e.currentPosition),
        );
        console.log(currentTime.slice(0, 5));
        if (isEnabled && currentTime.slice(0, 5) === emergencyTimeLimit) {
          console.log('uyavwdbouyvbduiayvuo');
          onStopRecord();
          setAudioAction(STOP_RECORD);
          ToastAndroid.showWithGravityAndOffset(
            'You exceed maximum time of record time!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
        if (currentTime.slice(0, 5) === nonemergencyTimeLimit) {
          console.log(
            'uyavwdbouyvbduiayvuo',
            nonemergencyTimeLimit,
            versionInfo.nonemergency,
          );
          currentTime = nonemergencyTimeLimit;
          onStopRecord();
          setAudioAction(STOP_RECORD);
          ToastAndroid.showWithGravityAndOffset(
            'You exceed maximum time of record time!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
        return;
      });
    } catch (error) {
      console.log('ON start error', error);
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        // console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          onStartRecord(audioAction);
          setAudioAction(RECORDING);
        } else {
          Alert.alert('Required permissions not granted');
          // console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      onStartRecord(audioAction);
      setAudioAction(RECORDING);
    }
  };

  const onStopRecord = async () => {
    setToggleTouch(false);
    //setRecordingShow(false);
    try {
      const result = await audioRecorderPlayerRef.stopRecorder();
      audioRecorderPlayerRef.removeRecordBackListener();
      setFile(result);
      console.log({result});
      return;
    } catch (error) {
      console.log('on stop error', error);
    }
  };

  const onStartPlay = async () => {
    console.log('Playiing.., ');
    setToggleTouch(false);
    setRecordingShow(false);
    try {
      //function to play an audio after recording it.
      audioRecorderPlayerRef.setSubscriptionDuration(0.1);
      await audioRecorderPlayerRef.startPlayer();
      audioRecorderPlayerRef.addPlayBackListener(e => {
        // if (e.currentPosition === e.duration) {
        //   setPlayTime(0);
        //   setAudioAction(STOP_RECORD);
        //   audioRecorderPlayerRef.stopPlayer();
        // } else {
        //   setPlayTime(
        //     audioRecorderPlayerRef.mmssss(Math.floor(e.currentPosition)),
        //   );
        // }
        // return;
        if (e.currentPosition === e.duration) {
          onStopPlay();
          setAudioAction(STOP_RECORD);
        }
        setAudioRecord({
          currPositionSec: e.currentPosition,
          currDurationSec: e.duration,
          playTime: audioRecorderPlayerRef.mmssss(
            Math.floor(e.currentPosition),
          ),
          duration: audioRecorderPlayerRef.mmssss(Math.floor(e.duration)),
        });
      });
    } catch (error) {
      console.log('on start error', error);
    }
  };

  const onPausePlay = async () => {
    //function to pause an audio
    await audioRecorderPlayerRef.pausePlayer();
  };

  const onStopPlay = async () => {
    //function to stop playing an audio
    // console.log('onStopPlay');
    setToggleTouch(false);
    audioRecorderPlayerRef.stopPlayer();
    audioRecorderPlayerRef.removePlayBackListener();
  };

  const cancelRecord = () => {
    backAction();
    setFile('');
    setRecordingShow(false);
    //playTime('');
    //recordTime('');
    setAudioAction(null);
    return;
  };

  const onActionButtonPress = () => {
    if (audioAction === null) {
      getPermission();
    } else if (audioAction === RECORDING) {
      onStopRecord();
      setAudioAction(STOP_RECORD);
    } else if (audioAction === STOP_RECORD) {
      onStartPlay();
      setAudioAction(PLAY_RECORD);
    } else if (audioAction === PLAY_RECORD) {
      onStopPlay();
      setAudioAction(STOP_RECORD);
    }
  };
  console.log(recordTime, typeof recordTime, 'recordTime........');
  return (
    <View style={styles.container}>
      {toggleToch ? (
        <View style={styles.chatBanner}>
          <View
            style={{
              backgroundColor: isEnabled ? Constants.GREEN003 : '#767577',
              borderRadius: 50,
              paddingVertical: 1.5,
            }}
          >
            <Switch
              style={{
                // width: 40,
                // height: 20,
                // left: 3,
                // bottom: 0.5,
                transform: [{scaleX: 0.9}, {scaleY: 0.9}],
              }}
              trackColor={{false: '#767577', true: Constants.GREEN003}}
              thumbColor={Constants.WHITE_COLOR}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <Text style={styles.chatBannerText1}>
            Enable to send this message as Call
          </Text>
        </View>
      ) : null}
      <View style={styles.row}>
        {audioAction === STOP_RECORD ? (
          <TouchableOpacity
            style={[styles.icon, styles.cancelIcon]}
            onPress={cancelRecord}
          >
            <Icons name={ICON.CLOSE} size={24} color={Constants.BRIGHT_COLOR} />
          </TouchableOpacity>
        ) : null}
        <AudioActionButton
          record={
            audioAction === RECORDING || audioAction === PLAY_RECORD
              ? false
              : true
          }
          play={audioAction === STOP_RECORD}
          onPress={onActionButtonPress}
        />
        {audioAction === STOP_RECORD ? (
          <TouchableOpacity
            style={[styles.icon, styles.tickIcon]}
            onPress={() => {
              onConfirm();
              onStopPlay();
              console.log('()()()()()()');
            }}
          >
            <Icons name={ICON.CHECK} size={24} color={Constants.BRIGHT_COLOR} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.audioActionText}>
        {audioAction === null
          ? 'Click here, Start Recording'
          : audioAction === RECORDING
          ? 'Click here, Stop Recording'
          : null}
      </Text>
      {/* {audioAction === STOP_RECORD && (
        <Text style={styles.audioActionText}>{recordTime}</Text>
      )} */}
      {recordTime && recordingShow ? (
        <View style={styles.seekbarRecord}>
          {isEnabled ? (
            <Text>{`${recordTime.slice(0, -3)} / ${emergencyTimeLimit}`}</Text>
          ) : (
            <Text>{`${recordTime.slice(
              0,
              -3,
            )} / ${nonemergencyTimeLimit}`}</Text>
          )}
        </View>
      ) : null}
      {playTime ? (
        <View style={styles.seekbarRecord}>
          {playTime ? (
            <Text>{`${playTime.slice(0, -3)} / ${duration.slice(0, -3)}`}</Text>
          ) : null}
        </View>
      ) : null}
      {/* <AudioProgress
        isVoiceMessagePlaying={isVoiceMessagePlaying}
        setIsVoiceMessagePlaying={() =>
          setIsVoiceMessagePlaying(prevState => !prevState)
        }
        setAudioRecord={setAudioRecord}
        audioRecord={audioRecord}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  audioActionText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_FULL_MED,
    lineHeight: 19,
    color: Constants.GREY000,
    marginTop: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIcon: {
    backgroundColor: Constants.RED002,
  },
  tickIcon: {
    backgroundColor: Constants.GREEN002,
  },
  chatBanner: {
    backgroundColor: Constants.WHITE_COLOR,
    height: 40,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    top: '-20%',
  },
  chatBannerText1: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.BLACK000,
    marginLeft: 15,
    maxWidth: '130%',
    alignSelf: 'center',
    justifyContent: 'center',
    top: 0,
  },
  chatBannerText2: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_FULL_MED,
    color: Constants.BLUE000,
    maxWidth: '60%',
    top: -80,
    right: 0,
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  seekbar: {
    height: 30,
    minWidth: '50%',
    alignSelf: 'center',
    top: 50,
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  seekbarRecord: {
    height: 30,
    minWidth: '50%',
    top: 50,
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    //left: 30,
  },
});
