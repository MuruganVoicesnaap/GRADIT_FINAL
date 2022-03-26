import React, {useRef, useState, useEffect} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Constants} from '../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const screenWidth = Dimensions.get('screen').width;

const AudioProgress = ({
  isVoiceMessagePlaying,
  setIsVoiceMessagePlaying,
  setAudioRecord,
  audioRecord,
  onStopVoice,
}) => {
  const Icon = isVoiceMessagePlaying ? Icons : MaterialIcons;
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer()).current;

  const {currDurationSec, currPositionSec, playTime, duration} = audioRecord;

  let playWidth = (currDurationSec / currPositionSec) * (screenWidth - 56);

  if (!playWidth) {
    playWidth = 0;
  }

  const onStopPlay = () => {
    //function to stop playing an audio
    setIsVoiceMessagePlaying(false);
    audioRecorderPlayerRef.stopPlayer();
    audioRecorderPlayerRef.removePlayBackListener();
  };

  useEffect(() => {
    console.log('onStopVoiceUpload', onStopVoice);
    if (onStopVoice === true) {
      onStopPlay();
      console.log('onStopVoiceUploadDone', onStopVoice);
    }
  }, [onStopVoice]);
  const onStartPlay = async () => {
    setIsVoiceMessagePlaying(true);
    try {
      //function to play an audio after recording it.
      audioRecorderPlayerRef.setSubscriptionDuration(0.1);
      await audioRecorderPlayerRef.startPlayer();
      audioRecorderPlayerRef.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          onStopPlay();
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

  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 12}}
    >
      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={isVoiceMessagePlaying ? onStopPlay : onStartPlay}
      >
        <Icon
          color={Constants.WHITE_COLOR}
          size={16}
          name={isVoiceMessagePlaying ? 'pause' : 'play-arrow'}
        />
      </TouchableOpacity>
      <View>
        {playTime ? (
          <Text>{`${playTime.slice(0, -3)} / ${duration.slice(0, -3)}`}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default AudioProgress;

const styles = StyleSheet.create({
  viewPlayer: {
    marginTop: 60,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    // marginHorizontal: 28,
    // alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: Constants.GREEN001,
    height: 4,
    alignSelf: 'stretch',
    opacity: 0.3,
    width: 300,
  },
  viewBarPlay: {
    backgroundColor: Constants.GREEN001,
    height: 4,
    width: 0,
  },
  voiceRemainingBar: {
    height: 4,
    backgroundColor: Constants.GREEN001,
    opacity: 0.3,
  },
  playPauseButton: {
    backgroundColor: Constants.GREEN001,
    width: 40,
    height: 40,
    borderRadius: 22,
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});
