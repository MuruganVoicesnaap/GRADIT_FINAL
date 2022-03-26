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
  BackHandler,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import ControllBar from '../../components/VideoPlayer/ControlBar';
import {Constants} from '../../constants/constants';
import {connect} from 'react-redux';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Styles from '../../components/VideoPlayer/Styles';
import Orientation from 'react-native-orientation';
const CONTROLL_BAR_HEIGHT = 50;
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? 25 : 0;
const PROPOTION_RATE_MULTIPLIER = 0.5625;

const VideoPlayerCommon = ({route, setBottomSheetData}) => {
  const navigation = useNavigation();
  const [videoProps, setVideoProps] = useState(route?.params?.video);
  const [vimeoPlayableUrl, setVimeoPlayableUrl] = useState('');
  const [showThumbnail, setAutoThumbnail] = useState(false);

  const assignment = useState(
    route?.params?.assignment === true ? true : false,
  );
  const [discription, setDiscription] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRef = useRef();
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

  const handleLoad = ({duration}) => {
    setVideoDuration(duration);
  };

  const handleEnd = () => {
    fetchData();
    handlePause();
  };

  const handlePause = () => {
    setPaused(prevState => !prevState);
  };

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
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Ok', onPress: () => goBack()},
    ]);
    return true;
  };
  useEffect(() => {
    fetchData();
    handlePause();
  }, [route.params.video]);

  const fetchData = () => {
    const parseVimeoLink = () => {
      var subject =
        route?.params?.assignment === true
          ? route?.params?.video.file_name
          : route?.params?.video.file_path;

      var result = subject.match(
        /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i,
      );

      var vimeoVideoId = result[1];
      fetch(`https://player.vimeo.com/video/${vimeoVideoId}/config`)
        .then(res => res.json())
        .then(res => {
          setVimeoPlayableUrl(
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
          );
        });
    };
    parseVimeoLink();
    setVideoProps(route.params.video);
  };
  const goBack = () => {
    Orientation.lockToPortrait();
    navigation.goBack();
  };

  // useEffect(() => {
  //   console.log('start...', vimeoPlayableUrl, '....end');
  // }, [vimeoPlayableUrl]);

  useEffect(() => {
    return () => setBottomSheetData({hideSheet: false});
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {discription ? (
          <View style={styles.topView}>
            <TouchableOpacity onPress={goBack} style={{paddingTop: 5}}>
              <Icon name={'arrow-back'} color={Constants.BLACK007} size={30} />
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', padding: 5}}>Title</Text>
            <Text style={{paddingLeft: 5}}>{videoProps.topic}</Text>
            <Text style={{fontWeight: 'bold', padding: 5}}>Description</Text>
            <Text style={{paddingLeft: 5}}>{videoProps.description}</Text>
          </View>
        ) : null}
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
            source={{uri: vimeoPlayableUrl}}
            //back={handleBack}
            style={{
              width: parseInt(viewportWidth),
              height: parseInt(videoHeight),
            }}
            onLoad={handleLoad}
            onProgress={handleProgress}
            rate={currentSpeedRate}
            onEnd={handleEnd}
            onReadyForDisplay={handleOnReady}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(null, {setBottomSheetData})(VideoPlayerCommon);
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
});
