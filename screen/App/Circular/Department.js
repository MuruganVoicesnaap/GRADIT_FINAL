import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {Constants} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import NoticeCard from '../../../components/NoticeBoardCard/NoticeBoardCard';

const DepartmentCircular = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <Header name="SathyaLakshmi" />

      <View style={styles.innerContainer}>
        <Text style={styles.textHead}>Circular</Text>
        <Text style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          suscipit malesuada nunc et.
        </Text>
        <View style={{...styles.row, marginTop: 10}}>
          <Button style={[styles.buttonSelected]}>
            <View style={styles.row}>
              <Text style={styles.buttonText}> Department</Text>
              <View style={styles.badge}>
                <Text style={styles.buttonTextBadge}>11</Text>
              </View>
            </View>
          </Button>
          <Button
            style={[styles.button, {marginHorizontal: 5}]}
            onPress={() => navigation.navigate('CollegeCircular')}
          >
            <View style={styles.row}>
              <Text style={styles.buttonNormalText}>College</Text>
              <View style={styles.badge}>
                <Text style={styles.buttonTextBadge}>11</Text>
              </View>
            </View>
          </Button>
        </View>
      </View>

      <View>
        <NoticeCard />

        <NoticeCard />
      </View>
    </SafeAreaView>
  );
};
export default DepartmentCircular;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  innerContainer: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  textHead: {
    fontSize: Constants.FONT_LOW_MED,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
  texnormal: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  row: {
    flexDirection: 'row',
  },
  buttonSelected: {
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
    padding: '2%',
  },
  buttonText: {
    fontSize: Constants.FONT_LOW,
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_MED,
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 25,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextBadge: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
  },
  button: {
    backgroundColor: Constants.BUTTON_NORMAL_COLOR,
    padding: '2%',
  },
  buttonNormalText: {
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_MED,
    color: Constants.DARK_COLOR,
  },
  card: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: Constants.TEXT_INPUT_COLOR,
    // paddingHorizontal:"2%",
    marginLeft: '4%',
    marginRight: '4%',
  },
  verticalLineCard: {
    borderLeftWidth: 2,
  },

  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '100%',
    alignSelf: 'center',
    marginVertical: '4%',
  },
});
