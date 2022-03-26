import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IMAGES} from '../../../assests';
import Card from '../../../components/Card/card';
import {Constants} from '../../../constants/constants';
import AppConfig from '../../../redux/app-config';
import {STUDENT, PARENT} from '../../../utils/getConfig';
import capitializeFirstChar from '../../DashboardHome/util/capitializeFirstChar';

const FacultyCard = ({profile, title, subTitle, priority, stafftype}) => {
  const navigation = useNavigation();

  const profileImage = profile.includes(('.jpg' || '.png' || 'jpeg') && 'http')
    ? profile
    : null;

  return (
    <Card style={styles.card}>
      <View style={styles.innerRoot}>
        <View style={styles.left}>
          <View style={styles.imgRoot}>
            <Image
              source={profileImage ? {uri: profileImage} : IMAGES.HumanProfile}
              style={styles.imgStyles}
            />
          </View>
        </View>
        <View style={styles.mid}>
          {priority === STUDENT || priority === PARENT ? (
            <Text
              style={{
                ...styles.texnormal,
                fontWeight: Constants.FONT_WEI_MED,
                color: Constants.FACULTY_HEAD_COLOR,
              }}
            >
              {capitializeFirstChar(stafftype)} | {capitializeFirstChar(title)}
            </Text>
          ) : (
            <Text
              style={{
                ...styles.texnormal,
                fontWeight: Constants.FONT_WEI_MED,
                color: Constants.FACULTY_HEAD_COLOR,
              }}
            >
              {capitializeFirstChar(title)}
            </Text>
          )}
          <View style={styles.horizontalLine} />
          <Text
            style={{
              ...styles.textHead,
              fontWeight: Constants.FONT_WEI_BOLD,
            }}
          >
            {capitializeFirstChar(subTitle)}
          </Text>
        </View>
        {priority === STUDENT ? (
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
              }}
            >
              <Text
                style={{
                  ...styles.midText,
                  fontWeight: Constants.FONT_WEI_MED,
                  color: Constants.BRIGHT_COLOR,
                }}
              >
                {'Interact'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </Card>
  );
};

export default FacultyCard;

const styles = StyleSheet.create({
  textHead: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
    paddingBottom: 5,
  },
  texnormal: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  midText: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
    backgroundColor: '#229557',
    borderRadius: 30,
    color: Constants.BRIGHT_COLOR,
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    height: 75,
    marginVertical: '2%',
    borderRadius: 5,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '50%',
    alignSelf: 'flex-start',
    marginVertical: '2%',
    marginBottom: '2%',
  },
  innerRoot: {flexDirection: 'row'},
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mid: {
    flex: 3,
  },
  right: {
    flex: 1.5,
  },
  imgRoot: {
    height: 32,
    width: 32,
    backgroundColor: 'grey',
    borderRadius: 25,
    alignSelf: 'center',
  },
  imgStyles: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
    alignSelf: 'center',
  },
});
