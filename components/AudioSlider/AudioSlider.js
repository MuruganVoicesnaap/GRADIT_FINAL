import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {useTrackPlayerProgress} from 'react-native-track-player';
// import {useTrackPlayerProgress} from 'react-native-track-player/lib/hooks';
import {PLAYBACK_TRACK_CHANGED} from 'react-native-track-player/lib/eventTypes';
import {Constants, FONT} from '../../constants/constants';

export const AudioSlider = ({
  setIsVoiceMessagePlaying,
  isVoiceMessagePlaying,
  audioStatus,
  isSelectedCard,
  durationfromBackend,
}) => {
  const {position, duration} = useTrackPlayerProgress(1000, null);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seek, setSeek] = useState(0);

  useEffect(() => {
    TrackPlayer.addEventListener(PLAYBACK_TRACK_CHANGED, res => {
      setIsSeeking(false);
      if (res.track) {
        setIsVoiceMessagePlaying(false);
      }
    });
  }, []);

  const formatTime = secs => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  };
  const formatTimeFUll = secs => {
    // console.log(secs, 'lnbli');
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);
    // console.log(minutes + 1, 'minutes');
    if (seconds === 60) {
      return `${minutes + 1}:00`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  };

  const handleChange = val => {
    TrackPlayer.seekTo(val);
    TrackPlayer.play().then(() => {
      setTimeout(() => {
        setIsSeeking(false);
      }, 1000);
    });
  };

  return (
    <>
      <Slider
        style={{width: '60%'}}
        minimumValue={0}
        value={
          isSeeking
            ? seek
            : Math.floor(position) == Math.floor(duration)
            ? 0
            : position
        }
        onValueChange={value => {
          TrackPlayer.pause();
          setIsSeeking(true);
          setSeek(value);
        }}
        maximumValue={duration}
        onSlidingComplete={handleChange}
        thumbTintColor={Constants.GREEN001}
        minimumTrackTintColor={Constants.GREEN001}
        maximumTrackTintColor="#ccc"
      />

      <Text style={styles.timers}>
        {`${formatTime(
          isSeeking
            ? seek
            : Math.floor(position) === Math.floor(duration)
            ? 0
            : position,
        )}/${
          isSelectedCard && audioStatus.length
            ? durationfromBackend
              ? formatTimeFUll(durationfromBackend)
              : formatTimeFUll(duration)
            : '0:00'
        }`}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  timers: {
    color: Constants.BLACK000,
    fontSize: 10,
    lineHeight: 12,
    fontFamily: FONT.primaryRegular,
  },
});
