import React from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import {Constants} from '../../constants/constants';
import AnimatedText from './AnimatedText';

const HeaderBackground = ({animationRange, headerContent}) => {
  const animateHeader = {
    transform: [
      {
        translateY: animationRange.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.headerBackground, animateHeader]}>
      {headerContent}
    </Animated.View>
  );
};

const AnimatedHeader = ({
  animationRange,
  leftTab,
  rightTab,
  leftTabWrapperStyle,
  rightTabWrapperStyle,
  onLeftTabPress,
  onRightTabPress,
  headerContent,
}) => {
  return (
    <View style={styles.container}>
      <HeaderBackground
        animationRange={animationRange}
        headerContent={headerContent}
      />
      <Animated.View style={styles.animatedTextWrapper}>
        <AnimatedText
          animationRange={animationRange}
          tabWrapperStyle={leftTabWrapperStyle}
          onPress={onLeftTabPress}
        >
          {leftTab}
        </AnimatedText>
        <AnimatedText
          animationRange={animationRange}
          tabWrapperStyle={[rightTabWrapperStyle, styles.rightView]}
          isRight={true}
          onPress={onRightTabPress}
        >
          {rightTab}
        </AnimatedText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    flex: 0,
    zIndex: 2,
    marginTop: 0,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  animatedTextWrapper: {
    flexDirection: 'row',
    flex: 0,
    zIndex: 2,
    height: 45,
    paddingHorizontal: 10,
    top: 40,
    width: '100%',
    alignItems: 'stretch',
  },
  headerBackground: {
    position: 'absolute',
    flex: 0,
    padding: 20,
    height: undefined,
    top: 0,
    width: '100%',
    backgroundColor: Constants.WHITE_COLOR,
    zIndex: 0,
  },
  rightView: {
    right: -11,
  },
});

export default AnimatedHeader;
