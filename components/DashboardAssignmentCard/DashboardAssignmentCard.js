import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  ASSIGNMENT_CARD_COLORS,
  Constants,
  FONT,
  ICON,
} from '../../constants/constants';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import {Pill} from '../Pill/Pill';
import Spinner from 'react-native-loading-spinner-overlay';
import {DateTime} from '../DateTime/DateTime';
import {useNavigation} from '@react-navigation/core';
import AppConfig from '../../redux/app-config';
export const DashboardAssignmentCard = ({
  title = '',
  date = '',
  time = '',
  dueDate = '',
  description = '',
  backgroundColor = ASSIGNMENT_CARD_COLORS[0],
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
  const navigation = useNavigation();
  return (
    <>
      <View
        style={[styles.container, backgroundColor ? {backgroundColor} : null]}
      >
        <View style={styles.leftcontainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.leftContent}>
            <Text numberOfLines={5} style={styles.description}>
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
        </View>
        <View style={styles.rightContainer}>
          <View>
            <DateTime date={date} time={time} />
          </View>
          <View>
            {dueDate ? (
              <>
                <Text style={[styles.dueDate]}>{'Due Date'}</Text>
                <Pill text={dueDate} containerStyle={styles.dueDatePill} />
                <Pill
                  text={'View'}
                  containerStyle={styles.viewPill}
                  textStyle={{color: Constants.WHITE_COLOR}}
                  onPress={() => {
                    navigation.navigate(AppConfig.SCREEN.ASSIGNMENT);
                  }}
                />
              </>
            ) : null}
          </View>
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
    width: 272,
    height: 166,
    padding: 14,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginEnd: 12,
  },
  leftcontainer: {
    width: '65%',
  },
  leftContent: {
    justifyContent: 'space-between',
    flex: 1,
    paddingEnd: 12,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginRight: 4,
  },
  rightContainer: {
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT.primaryBold,
    marginBottom: 4,
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
  dueDatePill: {
    width: 75,
    backgroundColor: Constants.WHITE_COLOR,
    marginBottom: 6,
  },
  viewPill: {
    backgroundColor: Constants.BLACK000,
  },
  dueDate: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 4,
    fontFamily: FONT.primaryMedium,
    paddingStart: 4,
  },
});
