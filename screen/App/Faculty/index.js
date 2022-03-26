/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Header from '../../../components/Header/Header';
import Advertisement from '../../../components/Advertisement';
import { Constants } from '../../../constants/constants';
import { connect } from 'react-redux';
import { HOD, PRINCIPAL, STAFF } from '../../../utils/getConfig';
import PrincipalFlow from './PrincipalFlow';
import OtherFlow from './OtherFlow';
import { getDivisionList } from '../../../redux/actions/getCourseList';
import StaffFlow from './StaffFlow';

const Faculty = props => {
  const { priority, colgid, memberid } = props.maindata;
  useEffect(() => {
    props.getList({

      user_id: memberid,
      college_id: colgid,
      // idcollege: colgid,
      // "user_id":"3519",
    });
  }, []);

  return (
    <SafeAreaView>
      <Header />
      <Advertisement />
      <ScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.textHead}>Faculty</Text>
          {/* <Text
            style={{...styles.textnormal, color: Constants.MILD_BLACK_COLOR}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            suscipit malesuada nunc et.
          </Text> */}
        </View>
        {
          priority === PRINCIPAL ? (
            <PrincipalFlow />
          )
            : priority === HOD ? (
              <StaffFlow />
            )

              : priority === STAFF ? (
                <StaffFlow />
              )
                : (
                  <OtherFlow />
                )}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    getList: bindActionCreators(getDivisionList, dispatch),
  };
};

const mapStateToPropes = ({ app }) => {
  const { maindata } = app;
  return {
    maindata,
    memberid: app?.maindata?.memberid,

    // departmentid: app?.maindata?.deptid,
  };
};

export default connect(mapStateToPropes, mapDispatchToProps)(Faculty);

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
    fontSize: Constants.FONT_LOW,
    fontWeight: Constants.FONT_WEI_BOLD,
    paddingBottom: 5,
  },
  texnormal: {
    fontSize: Constants.FONT_BADGE,
    fontWeight: Constants.FONT_WEI_NORMAL,
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
  cardRoot: {
    marginTop: 10,
    paddingBottom: 10,
  },
  noRecord: {
    backgroundColor: '#fff',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
