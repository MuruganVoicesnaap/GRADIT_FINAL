import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  CIRCULAR_CARD_COLORS,
  Constants,
  FONT,
  ICON,
} from '../../constants/constants';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import {Pill} from '../Pill/Pill';
import Spinner from 'react-native-loading-spinner-overlay';

export const CircularCard = ({
  title = '',
  date = '',
  time = '',
  description = '',
  backgroundColor = CIRCULAR_CARD_COLORS[0],
  attachmentLink = '',
}) => {
  const [fileLoading, setFileLoading] = useState(false);
  const toggleFileLoading = () => setFileLoading(prevState => !prevState);
  const onPress = () => {
    if (attachmentLink) {
      toggleFileLoading();
      openFile(attachmentLink, toggleFileLoading);
    }
  };
  return (
    <>
      <View
        style={[styles.container, backgroundColor ? {backgroundColor} : null]}>
        <View style={styles.leftcontainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          <Pill
            icon={ICON.ATTACHMENTS}
            text="attachement"
            containerStyle={[
              styles.attachmentBlock,
              !attachmentLink ? styles.hide : null,
            ]}
            textStyle={styles.attachment}
            onPress={onPress}
            disabled={!attachmentLink}
          />
        </View>
        <View>
          <Text style={styles.dataTime}>{date}</Text>
          <Text style={styles.dataTime}>{time}</Text>
        </View>
      </View>
      <Spinner
        color="#3b5998"
        visible={fileLoading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 243,
    height: 125,
    padding: 14,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginEnd: 12,
  },
  leftcontainer: {
    width: '75%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT.primaryBold,
  },
  dataTime: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 2,
    textAlign: 'right',
    fontFamily: FONT.primaryRegular,
  },
  description: {
    fontSize: 10,
    lineHeight: 14,
    color: Constants.BLACK005,
    fontFamily: FONT.primaryRegular,
  },
  attachmentBlock: {
    backgroundColor: Constants.BLACK000,
    marginTop: 4,
    width: 106,
  },
  attachment: {
    color: Constants.WHITE_COLOR,
  },
  hide: {
    display: 'none',
  },
});
