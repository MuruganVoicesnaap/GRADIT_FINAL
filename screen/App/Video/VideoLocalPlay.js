import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import ControllBar from '../../../components/VideoPlayer/ControlBar';
import {Constants, FONT} from '../../../constants/constants';
import {connect} from 'react-redux';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Styles from '../../../components/VideoPlayer/Styles';
import Orientation from 'react-native-orientation';
import AppConfig from '../../../redux/app-config';

const CONTROLL_BAR_HEIGHT = 50;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? 25 : 0;
const PROPOTION_RATE_MULTIPLIER = 0.5625;

const VideoPlayer = ({video, onSubmit, setBottomSheetData, onClose}) => {
  const navigation = useNavigation();
  const [videoProps, setVideoProps] = useState(video);
  const [vimeoPlayableUrl, setVimeoPlayableUrl] = useState('');
  const [discription, setDiscription] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRef = useRef();
  const [showThumbnail, setAutoThumbnail] = useState(false);
  const [paused, setPaused] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentSpeedRate, setCurrentSpeedRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    Dimensions.get('window').width,
  );
  const [viewportHeight, setViewportHeight] = useState(
    Dimensions.get('window').height,
  );
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [backAction]);

  const handleLoad = ({duration}) => {
    setVideoDuration(duration);
  };

  const handleEnd = () => {
    handlePause();
  };

  const handlePause = () => {
    setPaused(prevState => !prevState);
  };

  useEffect(() => {
    setPaused(false);
  }, []);

  const handleSlide = newPositionPercent => {
    playerRef.current.seek(videoDuration * newPositionPercent);
  };

  const handleProgress = ({currentTime: newPosition}) => {
    setCurrentPosition(newPosition);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangeSpeed = newSpeed => {
    setCurrentSpeedRate(newSpeed);
  };

  const handleOnReady = () => {
    if (!showThumbnail) {
      setAutoThumbnail(true);
      setPaused(true);
    }
  };

  const handleFullscreen = () => {
    const newFullscreen = !fullscreen;
    setFullscreen(newFullscreen);

    if (newFullscreen) {
      setDiscription(false);
      Orientation.lockToLandscapeLeft();
    } else {
      setDiscription(true);
      Orientation.lockToPortrait();
    }
  };

  const onDimensionsChange = ({window}) => {
    setViewportWidth(window.width);
    setViewportHeight(window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onDimensionsChange);
    return () => {
      Dimensions.removeEventListener('change', onDimensionsChange);
    };
  });

  const videoHeight = Math.floor(
    !fullscreen
      ? viewportWidth * PROPOTION_RATE_MULTIPLIER
      : viewportHeight - CONTROLL_BAR_HEIGHT - STATUS_BAR_HEIGHT,
  );

  const backAction = useCallback(() => {
    setBottomSheetData({hideSheet: true});
    navigation.navigate(AppConfig.SCREEN.ADD_VIDEO_SCREEN);
  }, [navigation, setBottomSheetData]);

  useEffect(() => {
    return () => setBottomSheetData({hideSheet: true});
  }, [setBottomSheetData]);

  return (
    <SafeAreaView>
      <ScrollView>
        <Styles.ContainerMain
          fullscreen={fullscreen}
          viewportWidth={viewportWidth}
          viewportHeight={viewportHeight}
        >
          <Video
            resizeMode="contain"
            paused={paused}
            ref={playerRef}
            //onReadyForDisplay={() => setIsVideoReady(true)}
            source={{uri: video?.uri}}
            //back={handleBack}
            style={{
              width: parseInt(viewportWidth),
              height: parseInt(videoHeight),
            }}
            onLoad={handleLoad}
            onProgress={handleProgress}
            rate={currentSpeedRate}
            onLoadStart={() => console.log('OnLoadStart started...')}
            onReadyForDisplay={handleOnReady}
            onEnd={handleEnd}
            //onLoadStart={() => setIsVideoReady(false)}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
          />
          {/* {!isVideoReady && (
          <View style={styles.videoLoadingActivityIndicatorWrapper}>
            <ActivityIndicator
              size="large"
              color={Constants.MILD_BLACK_COLOR}
              animating={!isVideoReady}
            />
          </View>
           )} */}
          <ControllBar
            paused={paused}
            currentPosition={currentPosition}
            videoDuration={videoDuration}
            onPause={handlePause}
            onSlide={handleSlide}
            onChangeSpeed={handleChangeSpeed}
            onFullscreen={handleFullscreen}
            fullscreen={fullscreen}
            handleEnd={handleEnd}
          />
        </Styles.ContainerMain>
        <TouchableOpacity style={styles.AddButton} onPress={onSubmit}>
          <Text style={styles.text}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.AddButton, backgroundColor: 'red'}}
          onPress={onClose}
        >
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(null, {setBottomSheetData})(VideoPlayer);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  topView: {
    padding: 10,
  },
  videoWrapper: {
    //flex: 1,
    paddingTop: 20,
    height: '60%',
    width: '100%',
    //backgroundColor:'red'
  },
  fullScreenStyle: {
    width: '100%',
    height: '90%',
    padding: 5,
  },
  AddButton: {
    height: 40,
    backgroundColor: 'green',
    marginTop: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: Constants.FONT_LOW,
    fontFamily: FONT.primaryMedium,
  },
});
