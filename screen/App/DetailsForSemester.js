import React, { useState, useCallback, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Text,
    Alert,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Constants,FONT,TOUCHABLE_ACTIVE_OPACITY } from '../../constants/constants';
import { getSubjectDetails } from '../../redux/actions/getSubjectDetailsForSem';

const DetailsForSemester = ({ getSubjectDetails, state, navigation }) => {
    const [loading, setLoading] = useState(true);
    const [subjectDetails, setSubjectDetails] = useState([]);
    const reqData = state?.app?.maindata;

    useEffect(() => {
        setLoading(true);
        getSubjectDetails({
            user_id: reqData.memberid, college_id: reqData.colgid,
            dept_id: reqData.deptid, sem_id: reqData.semesterid, section_id: reqData.sectionid
        }).then(data => {
            setLoading(false);
            setSubjectDetails(data);

        })
            .catch(msg => {
                setLoading(false);
                Alert.alert(msg);
            });
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.cardStyle}>
                <View style={{ flexDirection: 'row' }}>

                    <View style={{ flex: 1, flexDirection: 'column' }}>

                        <View style={styles.view_one}>
                        </View>

                        <View style={styles.view_two}>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'column', flex: 9 }}>

                        <View style={{ flexDirection: 'row' }}>

                            <Text style={styles.textStyle}>Subject Name

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_name}

                            </Text>

                        </View>


                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <Text style={styles.textStyle}>Subject Type

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_type}

                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <Text style={styles.textStyle}>Subject Category

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_category}

                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <Text style={styles.textStyle}>Subject Credits

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_credits}

                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <Text style={styles.textStyle}>Subject Code

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_code}

                            </Text>

                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <Text style={styles.textStyle}>Subject Requirement

                            </Text>

                            <Text style={{ flex: 1 }}>{' :  ' + item.subject_requirement}

                            </Text>

                        </View>

                    </View>

                </View>
            </View>
        );
    }

    return (
      <SafeAreaView style={styles.styleContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
            style={{
              width: 50,
              height: 30,
              borderRadius: 60,
              justifyContent: 'center',
            }}
          >
            <Icons
              name="arrow-left"
              size={27}
              color={Constants.DARK_COLOR}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.text}>Course details</Text>
        </View>

        <ScrollView stickyHeaderIndices={[1]}>
          {loading ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spinner color="#3b5998" visible={loading} size="large" />
            </View>
          ) : (
            <FlatList
              data={subjectDetails}
              renderItem={renderItem}
              keyExtractor={item => item.subject_id}
            />
          )}
        </ScrollView>
        <View style={{height: 70}}></View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  view_one: {
    width: 5,
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: Constants.YELLOW000,
  },

  view_two: {
    width: 5,
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: Constants.GREEN001,
    marginTop: 10,
  },

  textStyle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    //fontFamily:'Roboto-Bold'
  },

  cardStyle: {
    elevation: 1,
    margin: 10,
    borderRadius: 10,
    borderWidth: 0,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: Constants.WHITE_COLOR,
    marginTop: 10,
  },

  styleContainer: {
    flex: 1,
  },

  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor:
  },
  text: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_TWENTY,
    marginLeft: 15,
  },
  icon: {
    marginLeft: 15,
  },
});

const mapStateToProps = state => ({
    state: state,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getSubjectDetails: data => dispatch(getSubjectDetails(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsForSemester);

