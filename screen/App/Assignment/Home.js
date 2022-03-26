/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  VirtualizedList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Provider} from 'react-native-paper';
import AnimatedSubheaderNav from '../../../components/AnimatedSubheaderNav/index';
import Advertisement from '../../../components/Advertisement';
import {Constants, FONT} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import AppConfig from '../../../redux/app-config';
import {STUDENT, STAFF, PARENT} from '../../../utils/getConfig';
import {NavTab} from '../../../components/Tab';
import {setBottomSheetData} from '../../../redux/actions/setBottomSheetData';
import AssignmentSubmission from '../../../components/Modal/AssignmentSubmission';
import AssignmentCard from '../../../components/Card/AssignmentCard';
import ViewAssignmentCard from '../../../components/Card/ViewAssignmentCard';
import DeleteSubmission from '../../../components/Modal/DeleteSubmission';
import {AddButton} from '../../../components/AddButton/AddButton';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {stylesForEachTabs} from '../../../components/CommonStyles';
import CommonCard from '../../../components/CommonCard';
import {openFile} from '../../DashboardHome/util/fileManager';
import {appReadStatus} from '../../../redux/actions/appReadStatus';
import moment from 'moment';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const assignmentData = ({request = {}, isPast = false}) => {
  request.type = isPast ? 'pastassignments' : 'upcomingassignments';
  //debugger;
  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.GET_ASSIGNMENT_LIST}`,
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

const Home = ({navigation, maindata, bottomSheetAction, searchText}) => {
  const {priority, memberid, colgid, deptid, sectionid, courseid} = maindata;
  const [loading, setLoading] = useState(true);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upcommingList, setUpcommingList] = useState([]);
  const [pastList, setPastList] = useState([]);

  const [subModalVisible, setSubModalVisible] = useState(false);
  const [subModalItem, setSubModalItem] = useState(false);
  const [selectedCard, setSelectedCard] = useState(-1);

  const showSubModal = item => {
    setSubModalItem(item);
    setSubModalVisible(true);
  };
  const hideSubModal = () => setSubModalVisible(false);

  const [delModalVisible, setDelModalVisible] = useState(false);
  const [delModalItem, setDelModalItem] = useState(false);

  const showDelModal = item => {
    setDelModalItem(item);
    setDelModalVisible(true);
  };
  const hideDelModal = () => setDelModalVisible(false);

  const [FilteredReadSource, setFilteredReadSource] = useState(upcommingList);

  const [FilteredUnreadSource, setFilteredUnreadSource] = useState(pastList);
  const isDataAvailable = !isLeftTabSelected
    ? FilteredUnreadSource.length !== 0
    : FilteredReadSource.length !== 0;

  useEffect(() => {
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      const newData = pastList.filter(item => {
        return Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter),
        );
      });
      const newDataCollege = upcommingList.filter(item => {
        return Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter),
        );
      });
      setFilteredUnreadSource(newData);
      setFilteredReadSource(newDataCollege);
    } else {
      setFilteredUnreadSource(pastList);
      setFilteredReadSource(upcommingList);
    }
  }, [searchText, pastList, upcommingList]);
  useEffect(() => {
    bottomSheetAction({hideSheet: subModalVisible});
  }, [subModalVisible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      bottomSheetAction({hideSheet: false});
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );
  const onAssignmentDelete = () => {
    const request = {
      staffid: `${memberid}`,
      collegeid: `${colgid}`,
      callertype: priority,
      assignmenttopic: delModalItem.topic,
      assignmentdescription: delModalItem.description,
      submissiondate: delModalItem.submissiondate,
      assignmenttype: delModalItem.assignmenttype,
      assignmentid: delModalItem.assignmentid,
      processtype: 'delete',

      deptid: deptid,
      courseid: courseid,
      sectionid: '0',
      yearid: '0',
      subjectid: '0',
      receivertype: '',
      receiverid: '0',
    };
    let formdata = new FormData();
    formdata.append(
      '',
      JSON.stringify({
        ...request,
      }),
    );

    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.DELETE_ASSIGNMENT}`,
      // 'https://gradit.voicesnap.com/api/AppDetailsBal/AssignmentDelete',
      'POST',
      false,
      request,
      result => {
        const {Status, data} = result;
        if (Status === 1) {
          hideDelModal();
          getData();
        }
      },
      result => {
        hideDelModal();
        getData();
      },
    );
  };

  const getData = useCallback(() => {
    setLoading(true);
    if (memberid) {
      const request = {
        userid: memberid,
        collegeid: colgid,
        departmentid: deptid || 0,
        sectionid: sectionid || 0,
        appid: '1',
        priority,
      };
      assignmentData({
        request,
        isPast: false,
      })
        .then(({data}) => {
          setUpcommingList(data);
          console.log(data, 'llkl upcoming');
        })
        .then(() => setLoading(false))
        .then(() => {
          assignmentData({
            request,
            isPast: true,
          })
            .then(({data}) => {
              setPastList(data);
              console.log(data, 'llkl');
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [memberid, priority, setUpcommingList, setPastList]);

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

  const onLeftTabPress = () => {
    setIsLeftTabSelected(true);
    setSelectedCard(-1);
  };

  const onRightTabPress = () => {
    setIsLeftTabSelected(false);
    setSelectedCard(-1);
  };

  const toggleCheck = (cardIndex, selectedCard, item) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
      statusChange(item);
    } else if (cardIndex === selectedCard) {
      console.log('toggleCheck else', cardIndex, selectedCard);
      setSelectedCard(-1);
    }
  };
  const statusChange = item => {
    if (Number(item.isappread) === 0) {
      appReadStatus({
        userid: memberid,
        msgtype: 'assignment',
        detailsid: item.assignmentdetailid,
        priority: priority,
      });
    } else {
      console.log('already read');
    }
  };
  const openAttachment = item => {
    console.log(item);
    if (item.newfilepath.length > 1) {
      navigation.navigate(AppConfig.SCREEN.VIEW_ASSIGNMENT_QUESTION, {
        assignmentid: item.newfilepath,
        assignmenttype: item.assignmenttype,
      });
    } else {
      if (item.assignmenttype !== 'video') {
        setLoading(true);
        openFile(item.file_path, () => {
          setLoading(false);
        });
      } else if (item.assignmenttype === 'video') {
        bottomSheetAction({hideSheet: true});
        navigation.navigate('VideoPlayerCommon', {video: item});
      }
    }
  };
  const renderItem = ({item, index}) => {
    console.log({item, index});
    let dtStr = item.createdon;
    let dateTimeSplit = dtStr.split(' - ');
    let dateSplit = dateTimeSplit[0];
    let timeSplit = dateTimeSplit[1].split(':');
    let timeOnly =
      timeSplit[0] + '.' + timeSplit[1] + ' ' + timeSplit[2].split(' ')[1];
    if (priority === STUDENT || priority === PARENT) {
      return (
        <>
          {/* <AssignmentCard
            key={item.assignmentid}
            navigation={navigation}
            item={item}
            onSubmit={showSubModal}
            cardIndex={index}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          /> */}
          <CommonCard
            title={item.topic}
            date={dateSplit}
            time={timeOnly}
            sentbyname={item.sentbyname}
            content={item.description}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            createdby={item.createdby}
            getData={getData}
            cardIndex={index}
            appReadStatus={item.isappread}
            endContent
            AssignmentPage
            onPressRowView={() => {
              openAttachment(item);
            }}
            attachment
            newfilepath={item.newfilepath}
            userfilename={item.userfilename}
            onPress={() => toggleCheck(index, selectedCard, item)}
            submittedcount={item.submittedcount}
            lastDateSubmission={moment(
              item.submissiondate,
              'DD/MM/yyyy',
            ).format('Do MMM, YY')}
            viewButton
            viewButtonText="Prev Submission"
            submitButton
            submitOnPress={() => showSubModal(item)}
            viewOnPress={() => {
              navigation.navigate(AppConfig.SCREEN.VIEW_ASSIGNMENT_SUBMISSION, {
                assignmentid: item.assignmentid,
                assignmenttype: item.assignmenttype,
              });
            }}
          />
        </>
      );
    }

    return (
      <>
        {/* <ViewAssignmentCard
          navigation={navigation}
          item={item}
          onDelete={showDelModal}
          cardIndex={index}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        /> */}

        <CommonCard
          title={item.topic}
          date={dateSplit}
          time={timeOnly}
          sentbyname={item.sentbyname}
          content={item.description}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          createdby={item.createdby}
          getData={getData}
          cardIndex={index}
          appReadStatus={item.isappread}
          endContent
          AssignmentPage
          onPressRowView={() => {
            openAttachment(item);
          }}
          attachment
          newfilepath={item.newfilepath}
          userfilename={item.userfilename}
          onPress={() => toggleCheck(index, selectedCard, item)}
          viewButton={Number(item.submittedcount) !== 0}
          submittedcount={item.submittedcount}
          lastDateSubmission={moment(item.submissiondate, 'DD/MM/yyyy').format(
            'Do MMM, YY',
          )}
          viewButtonText="Submission"
          viewOnPress={() => {
            navigation.navigate(AppConfig.SCREEN.VIEW_ASSIGNMENT_SUBMISSION, {
              assignmentid: item.assignmentid,
              assignmenttype: item.assignmenttype,
            });
          }}
          deleteOnPress={() => showDelModal(item)}
          deleteButton={
            Number(item.createdby) === memberid &&
            moment().diff(
              moment(item.createdon, 'DD MMM yyyy - LTS'),
              'hours',
            ) <= 24
          }
          editButton
          editOnPress={() => {
            navigation.navigate(AppConfig.SCREEN.NEW_ASSIGNMENT, {
              item: item,
            });
          }}
          editButtonText="Forward"
        />
      </>
    );
  };
  const onAddAssignment = () => {
    bottomSheetAction({hideSheet: true});
    navigation.navigate('NewAssignment');
  };
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <AssignmentSubmission
          assignment={subModalItem}
          visible={subModalVisible}
          hideModal={hideSubModal}
        />
        <DeleteSubmission
          visible={delModalVisible}
          hideModal={hideDelModal}
          onDelete={onAssignmentDelete}
        />
        <Header
          onSearch
          onRefreshingPage={() => {
            onRefresh();
          }}
        />
        <ScrollView stickyHeaderIndices={[1]}>
          <Advertisement />
          <AnimatedSubheaderNav
            leftTab={
              <NavTab
                text="Upcoming"
                active={isLeftTabSelected}
                count={upcommingList.length}
              />
            }
            rightTab={
              <NavTab
                text="Past"
                active={!isLeftTabSelected}
                count={pastList.length}
              />
            }
            headerContent={
              <>
                <View style={styles.row}>
                  <Text style={styles.title}>Assignment</Text>
                </View>
                {/* <Text style={styles.titleDescription}>
                {priority === 'p1' || priority === 'p2' || priority === 'p3'
                  ? 'Create Assignment Schedule and share with Students from here'
                  : 'Receive your Assignment Schedules and Check previous submission here'}
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
          {/* list={!loading && isDataAvailable}
          items={itemProps => {
            return loading ? (
              <View
                style={{
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner color="#3b5998" visible={loading} size="large" />
              </View>
            ) :  */}
          {isDataAvailable ? (
            <VirtualizedList
              data={
                isLeftTabSelected ? FilteredReadSource : FilteredUnreadSource
              }
              initialNumToRender={5}
              getItem={(data, index) => data[index]}
              getItemCount={data => data.length}
              renderItem={renderItem}
              contentContainerStyle={styles.viewLastCard}
              keyExtractor={item => item.assignmentid}
              refreshing={refreshing}
              onRefresh={onRefresh}
              //{...itemProps}
            />
          ) : (
            <ScrollView
              style={styles.noData}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
                No data found
              </Text>
            </ScrollView>
          )}
        </ScrollView>
        {priority !== STUDENT && priority !== PARENT && (
          <AddButton onPress={onAddAssignment} />
        )}
      </SafeAreaView>
    </Provider>
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
  searchText: app.searchText,
});

const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};

export default connect(mapStatetoProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  ...stylesForEachTabs,
});
