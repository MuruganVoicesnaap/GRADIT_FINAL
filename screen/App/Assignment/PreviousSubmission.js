/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  VirtualizedList,
} from 'react-native';
import Advertisement from '../../../components/Advertisement';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import PreviousSubmissionCard from '../../../components/Card/PreviousSubmissionCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import DeleteSubmission from '../../../components/Modal/DeleteSubmission';
import AppConfig from '../../../redux/app-config';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import FeedbackModal from '../../../components/Modal/Feedback';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav';
import {NavTab} from '../../../components/Tab';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const assignmentData = ({request, isImageType = true}) => {
  request.filetype = isImageType ? 'image' : 'pdf';
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

const PreviousSubmission = ({
  navigation,
  route,
  maindata,
  bottomSheetAction,
}) => {
  const {memberid} = maindata;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [feedbackModalVisible, setfeedbackModalVisible] = useState(false);
  const [deleting, isDeleting] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [imageList, setImageList] = useState([]);
  const [pdfList, setPdfList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(-1);
  const isDataAvailable = isLeftTabSelected
    ? imageList.length !== 0
    : pdfList.length !== 0;

  const [delModalVisible, setDelModalVisible] = useState(false);
  const [delModalItem, setDelModalItem] = useState(false);

  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const showDelModal = item => {
    setDelModalItem(item);
    setDelModalVisible(true);
  };
  const hideDelModal = () => setDelModalVisible(false);

  const deleteAssignement = () => {
    hideDelModal();
    setfeedbackModalVisible(true);
    isDeleting(true);

    const request = {
      staffid: '',
      collegeid: '',
      deptid: '',
      courseid: '',
      callertype: '',
      sectionid: '',
      yearid: '',
      subjectid: '',
      assignmenttopic: '',
      assignmentdescription: '',
      submissiondate: '',
      assignmenttype: '',
      receivertype: '',
      receiverid: '',
      processtype: 'delete',
      assignmentid: delModalItem.assignmentid,
    };
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.DELETE_ASSIGNMENT}`,
      'POST',
      false,
      request,
      result => {
        const {Status, data} = result;
        if (Status === 1) {
          isDeleting(false);
          setSubmitState(true);
          wait(500).then(() => {
            setfeedbackModalVisible(false);
            getData();
          });
        }
      },
      result => {
        console.error(result);
        isDeleting(false);
        setSubmitState(false);
        wait(1000).then(() => {
          setfeedbackModalVisible(false);
        });
      },
    );
  };

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
        // filetype: 'pdf',
      })
        .then(({data}) => {
          console.log(data);
          setPdfList(data);
        })
        .then(() => setLoading(false))
        .catch(err => {
          console.error(err);
        });
    }
  }, [memberid, setPdfList, setImageList]);

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
    return <PreviousSubmissionCard item={item} onDelete={showDelModal} />;
  };

  return (
    <Provider>
      <FeedbackModal
        visible={feedbackModalVisible}
        loading={deleting}
        state={submitState}
      />
      <SafeAreaView style={styles.container}>
        <DeleteSubmission
          visible={delModalVisible}
          hideModal={hideDelModal}
          onDelete={deleteAssignement}
        />
        <Header
          onRefreshingPage={() => {
            onRefresh();
          }}
        />
        <Advertisement />

        <AnimatedSubheaderNav
          list={!loading && isDataAvailable}
          items={itemProps => {
            return loading ? (
              <Spinner color="#3b5998" visible={loading} size="large" />
            ) : isDataAvailable ? (
              <VirtualizedList
                data={isLeftTabSelected ? imageList : pdfList}
                initialNumToRender={5}
                getItem={(data, index) => data[index]}
                getItemCount={data => data.length}
                renderItem={renderItem}
                contentContainerStyle={styles.viewLastCard}
                keyExtractor={item => item.detailsid}
                refreshing={refreshing}
                onRefresh={onRefresh}
                {...itemProps}
              />
            ) : (
              <View style={styles.noData}>
                <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                  No data found
                </Text>
              </View>
            );
          }}
          leftTab={
            <NavTab
              text="Images"
              active={isLeftTabSelected}
              count={imageList.length}
            />
          }
          rightTab={
            <NavTab
              text="PDF"
              active={!isLeftTabSelected}
              count={pdfList.length}
            />
          }
          headerContent={
            <>
              <View style={styles.row}>
                <Text style={styles.title}>Previous Submission</Text>
                {imageList.length + pdfList.length ? (
                  <View style={styles.badge}>
                    <Text style={styles.buttonTextBadge}>
                      {imageList.length + pdfList.length}
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* <Text style={styles.titleDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              suscipit malesuada nunc et.
            </Text> */}
            </>
          }
          onLeftTabPress={onLeftTabPress}
          onRightTabPress={onRightTabPress}
          leftTabWrapperStyle={
            isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
          rightTabWrapperStyle={
            !isLeftTabSelected
              ? styles.selectedTabWrapperStyle
              : styles.tabWrapperStyle
          }
        />

        {/* <View style={{flex: 1, marginTop: 10, padding: 10}}>
          <Text style={styles.title}>Previous Submission</Text>

          {loading ? (
            <View
              style={{
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>Please Wait</Text>
            </View>
          ) : data.length ? (
            <VirtualizedList
              data={data}
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data.length}
              renderItem={renderItem}
              contentContainerStyle={styles.viewLastCard}
              keyExtractor={item => item.assignmentid}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                No data found
              </Text>
            </View>
          )}
        </View> */}
      </SafeAreaView>
    </Provider>
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(PreviousSubmission);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
  },
  tabWrapperStyle: {
    width: 120,
    minWidth: 120,
    padding: 10,
    height: 45,
    borderRadius: 4,
    marginVertical: 4,
    marginHorizontal: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.BUTTON_NORMAL_COLOR,
  },
  selectedTabWrapperStyle: {
    width: 120,
    minWidth: 120,
    padding: 10,
    height: 45,
    borderRadius: 4,
    marginVertical: 4,
    marginHorizontal: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.BUTTON_SELECTED_COLOR,
  },
  titleDescription: {
    fontFamily: FONT.primaryRegular,
    color: Constants.MILD_BLACK_COLOR,
    fontSize: Constants.FONT_THIRTEEN,
  },
  noData: {
    alignSelf: 'center',
    marginVertical: 14,
  },
  viewLastCard: {
    paddingVertical: '40%',
  },
  badge: {
    backgroundColor: Constants.BADGE_COLOR,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonTextBadge: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.WHITE_COLOR,
  },
});
