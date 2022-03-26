import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Constants, FONT} from '../../../constants/constants';
import {Pill} from '../../../components/Pill/Pill';
export const Section = ({
  title = 'Upcoming Events & Workshop',
  viewAction,
  horizontalScroll = false,
  children,
}) => {
  return (
    <View
      style={[styles.container, horizontalScroll ? styles.scrollStyle : null]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {viewAction ? <Pill onPress={viewAction} /> : null}
      </View>
      {horizontalScroll ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentHorizontalPadding}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.contentHorizontalPadding}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    color: Constants.BLACK000,
    fontFamily: FONT.primaryBold,
  },
  scrollStyle: {
    paddingEnd: 0,
  },
  contentHorizontalPadding: {
    paddingHorizontal: 16,
  },
});
