import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import {connect} from 'react-redux';
import {STUDENT, STAFF} from '../../../utils/getConfig';
import StudentHome from './Student/Home';
import StaffHome from './Staff/Home';

const Home = ({navigation, priority}) => {
  const [selectedCard, setSelectedCard] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <Header
        onRefreshingPage={() => {
          setSelectedCard(true);
        }}
      />
      <ScrollView stickyHeaderIndices={[1]}>
        <Advertisement />

        <View style={styles.innerContainer}>
          <Text
            style={[
              styles.textHead,
              {
                padding: 15,
                paddingBottom: 0,
                backgroundColor: Constants.WHITE_COLOR,
              },
            ]}
          >
            Chat
          </Text>
          {/* <Text style={styles.titleDescription}>
            {priority === 'p1' || priority === 'p2' || priority === 'p3'
              ? 'Respond to your students’ queries. Block/Unblock them too'
              : 'Here you can Post your queries to the Teaching Staff'}
          </Text> */}
        </View>

        {priority === STUDENT && (
          <StudentHome
            navigation={navigation}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        )}

        {priority !== STUDENT && (
          <StaffHome
            navigation={navigation}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
});

export default connect(mapStatetoProps, null)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },

  titleDescription: {
    fontFamily: FONT.primaryRegular,
    color: Constants.MILD_BLACK_COLOR,
    fontSize: Constants.FONT_ELEVEN,
  },
  innerContainer: {
    marginTop: 0,
    paddingHorizontal: '5%',
    width: '100%',
    backgroundColor: Constants.WHITE_COLOR,
  },
  textHead: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
  },
});
