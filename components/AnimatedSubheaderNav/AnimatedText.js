import React, {useState} from 'react';
import {Animated, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import buildTransform from './utils/buildTransform';
import {Constants} from '../../constants/constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedText = ({
  animationRange,
  isRight,
  children,
  tabWrapperStyle,
  onPress,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const val = isRight ? windowWidth / 2 : 0;

  const [elementX, setX] = useState(0);
  const [elementY, setY] = useState(0);
  const [elementWidth, setWidth] = useState(0);
  const [elementHeight, setHeight] = useState(0);

  const onLayoutSetMeasurements = event => {
    setX(event.nativeEvent.layout.x);
    setY(event.nativeEvent.layout.y);
    setWidth(event.nativeEvent.layout.width);
    setHeight(event.nativeEvent.layout.height);
  };

  const animateView = buildTransform(
    animationRange,
    elementX,
    elementY,
    elementHeight,
    elementWidth,
    val,
    -100,
    1,
  );

  const animateWidth = {
    width: animationRange.interpolate({
      inputRange: [0, 1],
      outputRange: [140, windowWidth / 2],
    }),
    borderRadius: animationRange.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 0],
    }),
  };

  return (
    <Animated.View
      style={[tabWrapperStyle]}>
      <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedText;
