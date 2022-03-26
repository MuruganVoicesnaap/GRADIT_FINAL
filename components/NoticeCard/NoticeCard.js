import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../../assests';
import {
  Constants,
  FONT,
  ICON,
  NOTICE_CARD_COLORS,
} from '../../constants/constants';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';

import {useNavigation} from '@react-navigation/native';
import AppConfig from '../../redux/app-config';

export const NoticeCard = ({
  title = '',
  descripton = '',
  date = '',
  time = '',
  cardColor = NOTICE_CARD_COLORS[0],
}) => {
  const navigation = useNavigation();
  const timeFinal = time.slice(0, 5) + ' ' + time.slice(-2).toUpperCase();
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate(AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME)
      }
    >
      <Image source={IMAGES.NoticeBoardPin} style={styles.image} />
      <View
        style={[
          styles.contentContainer,
          cardColor ? {backgroundColor: cardColor.bgColor} : null,
        ]}
      >
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.descripton} numberOfLines={4}>
          {descripton}
        </Text>
        <DateTime
          date={date}
          time={timeFinal}
          containerStyle={styles.dateTime}
          textStyle={styles.text}
        />
      </View>
      <View
        style={[
          cardColor ? {borderColor: cardColor.foldColor} : null,
          styles.fold,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: 10,
    width: 159,
    height: 226,
    marginEnd: 12,
  },
  contentContainer: {
    padding: 8,
    paddingTop: 26,
    borderRadius: 6,
    width: '100%',
    height: 216,
  },
  title: {
    fontSize: 11,
    lineHeight: 16,
    color: Constants.BLACK002,
    fontFamily: FONT.primaryBold,
  },
  descripton: {
    fontSize: 10,
    lineHeight: 14,
    color: Constants.BLACK005,
    marginTop: 8,
    fontFamily: FONT.primaryRegular,
  },
  attachmentBlock: {
    backgroundColor: Constants.BLACK000,
    marginTop: 6,
    width: 106,
  },
  attachment: {
    color: Constants.WHITE_COLOR,
  },
  image: {
    position: 'absolute',
    width: 21,
    height: 27,
    left: '45%',
    top: 0,
    zIndex: 1,
  },
  fold: {
    borderWidth: 24,
    width: 0,
    height: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderEndColor: Constants.WHITE_COLOR,
    borderBottomColor: Constants.WHITE_COLOR,
  },
  dateTime: {
    fontSize: 10,
    lineHeight: 14,
    color: Constants.BLACK002,
    marginTop: 8,
    marginBottom: 0,
    fontFamily: FONT.primaryRegular,
    position: 'absolute',
    bottom: 5,
    left: 8,
  },
  text: {
    fontSize: 11,
    fontFamily: FONT.primaryRegular,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
});
