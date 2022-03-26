import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Constants} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Card from '../../../components/Card/card';
import Button from '../../../components/Button/button';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const PastExam = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.textHead}>Upcoming Exams List</Text>
          <Text
            style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            suscipit malesuada nunc et.
          </Text>
          <View style={{...styles.row, marginTop: 10}}>
            <Button
              style={{...styles.button}}
              onPress={() => navigation.navigate('UpcomingExam')}
            >
              <View style={styles.row}>
                <Text style={styles.buttonNormalText}> Upcoming Exams</Text>
                <View style={styles.badge}>
                  <Text style={styles.buttonTextBadge}>11</Text>
                </View>
              </View>
            </Button>
            <Button style={[styles.buttonSelected, (marginHorizontal: 5)]}>
              <View style={styles.row}>
                <Text style={styles.buttonText}> Past Exams</Text>
                <View style={styles.badge}>
                  <Text style={styles.buttonTextBadge}>11</Text>
                </View>
              </View>
            </Button>
          </View>
        </View>

        <View>
          <Card
            style={{...styles.card, backgroundColor: Constants.WHITE_COLOR}}
          >
            <View
              style={{
                ...styles.verticalLineCard,
                borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
                marginVertical: '3%',
              }}
            >
              <Text
                style={{
                  ...styles.textnormal,
                  fontWeight: Constants.FONT_WEI_BOLD,
                  marginLeft: 5,
                  color: Constants.DARK_COLOR,
                }}
              >
                First Revision Test
              </Text>
            </View>

            <View
              style={{
                ...styles.row,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={styles.row}>
                <Icons
                  name="calendar-blank"
                  size={16}
                  color={Constants.DARK_COLOR}
                />
                <Text
                  style={{
                    fontSize: Constants.FONT_FULL_LOW,
                    marginLeft: 3,
                    color: Constants.DARK_COLOR,
                  }}
                >
                  22nd May, 21 - 29th May, 21
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: '2%',
                  backgroundColor: 'green',
                  borderRadius: 25,
                  paddingHorizontal: '3%',
                }}
              >
                <Text
                  style={{
                    ...styles.textnormal,
                    fontWeight: Constants.FONT_WEI_MED,
                    color: Constants.WHITE_COLOR,
                  }}
                >
                  View Marks
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          <Card
            style={{...styles.card, backgroundColor: Constants.WHITE_COLOR}}
          >
            <View
              style={{
                ...styles.verticalLineCard,
                borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
                marginVertical: '3%',
              }}
            >
              <Text
                style={{
                  ...styles.textnormal,
                  fontWeight: Constants.FONT_WEI_BOLD,
                  marginLeft: 5,
                  color: Constants.DARK_COLOR,
                }}
              >
                First Revision Test
              </Text>
            </View>

            <View
              style={{
                ...styles.row,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={styles.row}>
                <Icons
                  name="calendar-blank"
                  size={16}
                  color={Constants.DARK_COLOR}
                />
                <Text
                  style={{
                    fontSize: Constants.FONT_FULL_LOW,
                    marginLeft: 3,
                    color: Constants.DARK_COLOR,
                  }}
                >
                  22nd May, 21 - 29th May, 21
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: '2%',
                  backgroundColor: 'green',
                  borderRadius: 25,
                  paddingHorizontal: '3%',
                }}
                onPress={() => navigation.navigate('Examination')}
              >
                <Text
                  style={{
                    ...styles.textnormal,
                    fontWeight: Constants.FONT_WEI_MED,
                    color: Constants.WHITE_COLOR,
                  }}
                >
                  View Marks
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default PastExam;

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
  textnormal: {
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
  verticalLineCard: {
    borderLeftWidth: 2,
  },
});
