/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  VirtualizedList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../../components/Header/Header';
import Button from '../../../components/Button/button';
import Advertisement from '../../../components/Advertisement';
import {
  Constants,
  FONT,
  ICON,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../../constants/constants';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import PreviousSubmissionCard from '../../../components/Card/PreviousSubmissionCard';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import DeleteSubmission from '../../../components/Modal/DeleteSubmission';
import AppConfig from '../../../redux/app-config';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import {Provider} from 'react-native-paper';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const assignmentData = ({
  request,
  isImageType = true,
  isVideoType = true,
  ispdfType = true,
}) => {
  const Value =
    isImageType === true && isVideoType === false && ispdfType === false
      ? 'image'
      : isImageType === false && isVideoType === false && ispdfType === true
      ? 'pdf'
      : 'video';
  request.filetype = Value;

  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.VIEW_ASSIGNMENT}`,
      'POST',
      false,
      request,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
    ),
  );
};

const PreviousSubmissionLeft = ({navigation, route, memberid}) => {
  const [type, setType] = useState('image');
  const [refreshing, setRefreshing] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const [loading, setLoading] = useState(true);
  console.log(type);
  const getData = useCallback(() => {
    setLoading(true);
    console.log(
      route.params.assignmentid,
      route.params.assignmenttype,
      memberid,
    );
    if (memberid) {
      const request = {
        assignmentid: route.params.assignmentid,
        processby: memberid,
      };
      assignmentData({
        request,
        isImageType: true,
        ispdfType: false,
        isVideoType: false,
        // filetype: 'image',
      })
        .then(({data}) => {
          console.log('image', data);
          setImageList(data);
        })
        .then(() => setLoading(false))
        .catch(err => {
          console.error(err);
        });
      assignmentData({
        request,
        isImageType: false,
        ispdfType: true,
        isVideoType: false,
        // filetype: 'pdf',
      })
        .then(({data}) => {
          console.log(data, 'pdf');
          setPdfList(data);
        })
        .then(() => setLoading(false))
        .catch(err => {
          console.error(err);
        });
      assignmentData({
        request,
        isVideoType: true,
        // filetype: 'pdf',
      })
        .then(({data}) => {
          console.log(data, 'video');
          setVideoList(data);
        })
        .then(() => setLoading(false))
        .catch(err => {
          console.error(err);
        });
    }
  }, [memberid, setPdfList, setImageList, setVideoList]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(100).then(() => setRefreshing(false));
  }, [getData]);

  useEffect(() => {
    if (memberid) {
      getData();
    }
  }, [memberid, getData]);
  const renderItem = ({item}) => {
    return <PreviousSubmissionCard item={item} />;
  };
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />

        <TouchableOpacity
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          onPress={goBack}
        >
          <View style={styles.pageHeader}>
            <Icons name="arrow-left" size={16} color={Constants.WHITE_COLOR} />
            <Text style={styles.pageHeaderText}>Previous Submission</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            width: '100%',
            backgroundColor: 'green',
          }}
        >
          <TouchableOpacity
            style={type === 'image' ? styles.Selected : styles.normal}
            onPress={() => setType('image')}
          >
            <Text
              style={
                type === 'image'
                  ? styles.HeaderTextNameSelected
                  : styles.HeaderTextName
              }
            >
              Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={type === 'PDF' ? styles.Selected : styles.normal}
            onPress={() => setType('PDF')}
          >
            <Text
              style={
                type === 'PDF'
                  ? styles.HeaderTextNameSelected
                  : styles.HeaderTextName
              }
            >
              PDF
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={type === 'video' ? styles.Selected : styles.normal}
            onPress={() => setType('video')}
          >
            <Text
              style={
                type === 'video'
                  ? styles.HeaderTextNameSelected
                  : styles.HeaderTextName
              }
            >
              Video
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 470}}>
          {type === 'image' && imageList.length !== 0 ? (
            <>
              <VirtualizedList
                data={imageList}
                initialNumToRender={5}
                getItem={(data, index) => data[index]}
                getItemCount={data => data.length}
                renderItem={renderItem}
                contentContainerStyle={styles.viewLastCard}
                keyExtractor={item => item.assignmentid}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </>
          ) : (
            <>
              {type === 'image' && (
                <View style={styles.noData}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontFamily: FONT.primaryRegular,
                        color: Constants.DARK_COLOR,
                      },
                    ]}
                  >
                    No data found
                  </Text>
                </View>
              )}
            </>
          )}
          {type === 'PDF' && pdfList.length !== 0 ? (
            <>
              <VirtualizedList
                data={pdfList}
                initialNumToRender={5}
                getItem={(data, index) => data[index]}
                getItemCount={data => data.length}
                renderItem={renderItem}
                contentContainerStyle={styles.viewLastCard}
                keyExtractor={item => item.assignmentid}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </>
          ) : (
            <>
              {type === 'PDF' && (
                <View style={styles.noData}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontFamily: FONT.primaryRegular,
                        color: Constants.DARK_COLOR,
                      },
                    ]}
                  >
                    No data found
                  </Text>
                </View>
              )}
            </>
          )}
          {type === 'video' && videoList.length !== 0 ? (
            <>
              <VirtualizedList
                data={videoList}
                initialNumToRender={5}
                getItem={(data, index) => data[index]}
                getItemCount={data => data.length}
                renderItem={renderItem}
                contentContainerStyle={styles.viewLastCard}
                keyExtractor={item => item.assignmentid}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            </>
          ) : (
            <>
              {type === 'video' && (
                <View style={styles.noData}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontFamily: FONT.primaryRegular,
                        color: Constants.DARK_COLOR,
                      },
                    ]}
                  >
                    No data found
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </Provider>
  );
};
const mapStatetoProps = ({app}) => ({
  memberid: app?.maindata?.memberid,
});

export default connect(mapStatetoProps, null)(PreviousSubmissionLeft);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  noData: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 14,
    height: 40,
  },
  row: {
    flexDirection: 'row',
    marginTop: '10%',
    justifyContent: 'space-between',
  },
  normal: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
    borderWidth: 0.5,
    borderColor: Constants.DARK_COLOR,
  },
  Selected: {
    flex: 1,
    backgroundColor: Constants.SKY_BLUE_COLOR,
  },
  pageHeader: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
  descriptionView: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    height: 130,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discriptionHeight: {
    justifyContent: 'flex-start',
  },
  pageHeaderText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    paddingLeft: 10,
  },

  HeaderTextName: {
    color: Constants.SKY_BLUE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    marginVertical: 13,
    alignSelf: 'center',
  },
  HeaderTextNameSelected: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    marginVertical: 13,
    alignSelf: 'center',
  },
  mainView: {
    paddingHorizontal: '5%',
    paddingTop: '5%',
    // height: 400,
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_THIRTEEN,
    color: Constants.WHITE_COLOR,
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  textNormal: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 17,
    color: Constants.DARK_COLOR,
  },
  descriptionScroll: {
    height: 130,
  },
  inputStyle: {
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Constants.GREY004,
    marginBottom: 12,
  },
  addRecipientPill: {
    borderWidth: 1,
    borderColor: Constants.GREY004,
    height: 36,
    marginTop: 10,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  addRecipientText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
  },
  viewReceipent: {
    marginTop: 10,
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    color: Constants.GREEN002,
  },
  actionButton: {
    height: 40,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  targetContainer: {
    marginTop: '8%',
  },
});
