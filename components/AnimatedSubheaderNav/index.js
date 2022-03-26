import React, {useEffect, useState} from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';
// import {Constants} from '../../../constants/constants';
// import NoticeCard from '../../../components/NoticeBoardCard/NoticeBoardCard';

import AnimatedHeader from './AnimatedHeader';

export const scrollRangeForAnimation = 100;

const HeaderPlaceholder = (
  <View style={{flex: 0, height: 150, width: '100%'}} />
);

const AnimatedSubheaderNav = ({
  items,
  leftTab,
  rightTab,
  leftTabWrapperStyle,
  rightTabWrapperStyle,
  onRightTabPress,
  onLeftTabPress,
  headerContent,
  calendar,
  list = false,
}) => {
  let _scrollView = null;

  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [animationRange, setAnimationRange] = useState(
    scrollY.interpolate({
      inputRange: [0, scrollRangeForAnimation],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  );

  useEffect(() => {
    setAnimationRange(
      scrollY.interpolate({
        inputRange: [0, scrollRangeForAnimation],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    );
  }, [scrollY]); // Only re-run the effect if count changes

  const onScrollEndSnapToEdge = event => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 0 && y < scrollRangeForAnimation / 2) {
      if (_scrollView) {
        _scrollView.scrollTo({y: 0});
      }
    } else if (
      scrollRangeForAnimation / 2 <= y &&
      y < scrollRangeForAnimation
    ) {
      if (_scrollView) {
        _scrollView.scrollTo({y: scrollRangeForAnimation});
      }
    }
  };

  const animateCalendar = {
    transform: [
      {
        translateY: animationRange.interpolate({
          inputRange: [0, 1],
          outputRange: [150, 35],
        }),
      },
    ],
  };

  const AnimatedCalendar = () => {
    return (
      <Animated.View style={[animateCalendar, {flex: 1}]}>
        {calendar}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {list === true ? (
        items({
          LisHeaderComponent: HeaderPlaceholder,
          style: styles.scrollView,
          ref: scrollView => {
            _scrollView = scrollView ? scrollView._component : null;
          },
          onScrollEndDrag: onScrollEndSnapToEdge,
          onMomentumScrollEnd: onScrollEndSnapToEdge,
          onScroll: Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: scrollY}},
              },
            ],
            {
              useNativeDriver: false,
            },
          ),
        })
      ) : calendar !== undefined ? (
        <AnimatedCalendar />
      ) : (
        <Animated.ScrollView
          style={styles.scrollView}
          ref={scrollView => {
            _scrollView = scrollView ? scrollView._component : null;
          }}
          onScrollEndDrag={onScrollEndSnapToEdge}
          onMomentumScrollEnd={onScrollEndSnapToEdge}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: scrollY}},
              },
            ],
            {
              useNativeDriver: false,
            },
          )}
        >
          {HeaderPlaceholder}
          {typeof items === 'function' ? items({}) : items}
        </Animated.ScrollView>
      )}

      <AnimatedHeader
        leftTab={leftTab}
        rightTab={rightTab}
        onRightTabPress={onRightTabPress}
        onLeftTabPress={onLeftTabPress}
        rightTabWrapperStyle={rightTabWrapperStyle}
        leftTabWrapperStyle={leftTabWrapperStyle}
        headerContent={headerContent}
        animationRange={animationRange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 115,
  },
  scrollView: {
    flex: 1,
    zIndex: -1,
  },
});

export default AnimatedSubheaderNav;
