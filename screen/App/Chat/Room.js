/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Keyboard,
  Alert,
  Modal,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppConfig from '../../../redux/app-config';
import {Constants, FONT, ICON} from '../../../constants/constants';
import Header from '../../../components/Header/Header';
// import Advertisement from '../../../components/Advertisement';
import {connect} from 'react-redux';
import HeaderHuman from '../../../assests/images/HeaderHuman.png';
import ReplyIcon from '../../../assests/images/reply.png';
import triggerSimpleAjax from '../../../context/Helper/httpHelper';
import {STUDENT, STAFF} from '../../../utils/getConfig';
import Hyperlink from 'react-native-hyperlink';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import moment from 'moment';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const getDate = utc => {
  return moment(utc).format('L');
};
const getTime = utc => {
  // Main Difference Logic

  const currentTime = moment().format('MM/DD/YYYY HH:mm:ss');
  const givenTime = moment(utc).format('MM/DD/YYYY HH:mm:ss');
  const ms = moment(currentTime).diff(moment(givenTime));
  const duration = moment.duration(ms);
  const Difference = duration.as('hours');

  if (Difference > 24) {
    return moment(utc).format('lll');
  } else {
    return moment(utc).fromNow();
  }
};

const windowWidth = Dimensions.get('window').width;

const Room = ({navigation, route, maindata: {colgid, memberid, priority}}) => {
  const {
    staffname,
    subjectname,
    sectionid,
    staffid,
    subjectid,
    isclassteacher,
    coursename,
    yearname,
    sectionname,
    semestername,
  } = route.params.item;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const dattaLengthStaff = chats?.data;
  const dattaLengthStudent = chats?.List;
  const isIterateAble =
    priority === STUDENT
      ? dattaLengthStudent?.length > 0
        ? true
        : false
      : dattaLengthStaff?.length > 0
      ? true
      : false;

  const [reply, setReplying] = useState(null);
  const [itemBeforeReply, setItemBeforeReply] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [pagePsoition, setPagePsoition] = useState(0);
  const copyToClipboard = copyClipText => {
    Clipboard.setString(copyClipText);
    Toast.show('message copied', Toast.LONG);
  };

  let requestParam = {
    offset: 0,
    section_id: sectionid,
    subject_id: subjectid,
    is_classteacher: isclassteacher,
  };

  if (priority === STUDENT) {
    requestParam = {
      ...requestParam,
      student_id: memberid,
      staff_id: staffid,
    };
  } else {
    requestParam = {
      ...requestParam,
      staff_id: memberid,
    };
  }

  const getList = () => {
    console.log(requestParam);
    setLoading(true);
    triggerSimpleAjax(
      `${AppConfig.API_URL}${
        priority === STUDENT
          ? AppConfig.API.GET_STUDENT_CHAT
          : AppConfig.API.GET_STAFF_CHAT
      }`,
      'POST',
      false,
      requestParam,
      res => {
        const {Status, data, Message} = res;
        if (Status === 1) {
          console.log(data);
          setChats(priority === STUDENT ? data[0] : data);
        }
        setLoading(false);
      },
      err => {
        setChats(err);
        setLoading(false);
      },
    );
  };

  const postQuestion = question => {
    if (validateMessage(question)) {
      triggerSimpleAjax(
        `${AppConfig.API_URL}${AppConfig.API.STUDENT_POST_QUESTION}`,
        'POST',
        false,
        {
          offset: 0,
          student_id: memberid,
          staff_id: staffid,
          section_id: sectionid,
          subject_id: subjectid,
          is_classteacher: isclassteacher,
          college_id: colgid,
          question,
        },

        res => {
          const {Status, data, Message} = res;
          if (Status === 1) {
            getList();
            setMessage('');
          } else if (Status === 0 && Message.includes('blocked')) {
            Toast.show(Message, Toast.LONG);
          }
        },
        err => {},
      );
    }
  };
  const validateMessage = message => {
    if (message === '' || message === undefined) {
      Alert.alert('Message should not be empty');
      return false;
    }
    return true;
  };
  const replyTo = message => {
    if (validateMessage(message)) {
      console.log(
        {
          reply_type: isEnabled ? 1 : 2,
          answer: message,
          question_id: reply.questionid,
          is_changeanswer: reply.answeredon === '' ? 0 : 1,
          staff_id: memberid,
        },
        reply.answeredon,
        typeof reply.answeredon,
      );
      triggerSimpleAjax(
        `${AppConfig.API_URL}${AppConfig.API.ANSWER_STUDENT_QUESTION}`,
        'POST',
        false,
        {
          reply_type: isEnabled ? 1 : 2,
          answer: message,
          question_id: reply.questionid,
          is_changeanswer: reply.answeredon === '' ? 0 : 1,
          staff_id: memberid,
        },
        res => {
          const {Status, data} = res;
          if (Status === 1) {
           // debugger;
            getList();
            setReplying(null);
            setMessage('');
          }
        },
        err => {},
      );
    }
  };

  useEffect(() => {
    if (memberid) {
      getList();
    }
  }, [colgid, memberid]);

  const onRefresh = () => {
    setRefreshing(true);
    getList();
    wait(100).then(() => setRefreshing(false));
  };
  const checkReplying = item => {
    setItemBeforeReply(item);
    setModalVisible(!modalVisible);
  };
  const giveAlert = (studId, studName) => {
    setModalVisible(!modalVisible);
    Alert.alert('Trying to block ' + studName, 'press OK to confirm', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'destructive',
      },
      {text: 'OK', onPress: () => BlockStudent(studId, memberid)},
    ]);
  };

  const giveAlertUnblock = (studId, studName) => {
    setModalVisible(!modalVisible);
    Alert.alert('Trying to Unblock ' + studName, 'press OK to confirm', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'destructive',
      },
      {text: 'OK', onPress: () => UnBlockStudent(studId, memberid)},
    ]);
  };
  const BlockStudent = (studId, memberid) => {
    setLoading(true);
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.BLOCK_STUDENT_FOR_APP}`,
      'POST',
      false,

      {
        student_id: studId,
        staff_id: memberid,
        college_id: colgid,
      },
      res => {
        const {Status, data} = res;
        setLoading(false);
        Toast.show(String(res.Message), Toast.LONG);
        getList();
      },
      err => {
        setLoading(false);
      },
    );
  };
  const UnBlockStudent = (studId, memberid) => {
    setLoading(true);
    triggerSimpleAjax(
      `${AppConfig.API_URL}${AppConfig.API.UNBLOCK_STUDENT_FOR_APP}`,
      'POST',
      false,

      {
        student_id: studId,
        staff_id: memberid,
        college_id: colgid,
      },
      res => {
        const {Status, data} = res;
        setLoading(false);
        Toast.show(String(res.Message), Toast.LONG);
        getList();
      },
      err => {
        setLoading(false);
      },
    );
  };
  console.log(
    itemBeforeReply,
    'kkk',
    itemBeforeReply.changeanswer,
    itemBeforeReply.changeanswer === String(0),
    typeof itemBeforeReply.changeanswer,
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Constants.HEADER_COLOR}
        barStyle="light-content"
      />
      <Header
        onRefreshingPage={() => {
          onRefresh();
        }}
      />
      <Modal
        // animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          onPressOut={() => setModalVisible(!modalVisible)}
        >
          <TouchableOpacity
            style={{
              ...styles.modalView,
              top: pagePsoition,
              right: 4,
              justifyContent: 'space-evenly',
            }}
          >
            <TouchableOpacity
              style={[styles.modalRow, styles.topSpace]}
              onPress={() => {
                setModalVisible(!modalVisible);
                setReplying(itemBeforeReply);
              }}
            >
              {/* <Image source={ReplyIcon} style={{height: 21, width: 21}} />  */}
              <Icons name={'forward'} size={20} color={Constants.DARK_COLOR} />
              <Text style={styles.modalText}>
                {itemBeforeReply.changeanswer === String(0)
                  ? 'Reply'
                  : 'Change Answer'}
              </Text>
            </TouchableOpacity>
            {itemBeforeReply.is_student_blocked === String(0) && (
              <TouchableOpacity
                style={[styles.modalRow, styles.topSpace]}
                onPress={() => {
                  giveAlert(
                    itemBeforeReply.studentid,
                    itemBeforeReply.studentname,
                  );
                }}
              >
                <Icons
                  name={ICON.HIGHLIGHT_OFF}
                  size={20}
                  color={Constants.DARK_COLOR}
                />
                <Text style={styles.modalText}>Block Student</Text>
              </TouchableOpacity>
            )}
            {itemBeforeReply.is_student_blocked === String(1) && (
              <TouchableOpacity
                style={[styles.modalRow, styles.topSpace]}
                onPress={() => {
                  giveAlertUnblock(
                    itemBeforeReply.studentid,
                    itemBeforeReply.studentname,
                  );
                }}
              >
                <Icon
                  name={ICON.RELOAD}
                  size={20}
                  color={Constants.DARK_COLOR}
                />
                <Text style={styles.modalText}>Unblock Student</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <View style={styles.contentWrapper}>
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderRow}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{color: Constants.WHITE_COLOR}}>
                <Icons name={ICON.ARROW_LEFT} size={25} />
              </Text>
            </TouchableOpacity>
            <View style={[styles.chatHeaderRow, {marginLeft: 15}]}>
              <Image source={HeaderHuman} style={{height: 31, width: 32}} />
              <View style={{marginLeft: 8}}>
                <View style={{alignSelf: 'flex-start'}}>
                  {priority === STUDENT ? (
                    <Text style={styles.title}> {subjectname}</Text>
                  ) : (
                    <Text style={styles.title}>
                      {yearname} | {semestername} | {sectionname}
                    </Text>
                  )}
                </View>
                {priority === STUDENT ? (
                  <Text style={styles.titleDescription}>{staffname}</Text>
                ) : (
                  <Text style={styles.titleDescription}>
                    {coursename} | {subjectname}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View
          style={styles.chatArea}
          onTouchStart={e => {
            setPagePsoition(e.nativeEvent.pageY);
          }}
        >
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
          ) : !loading && isIterateAble ? (
            <FlatList
              inverted
              data={priority === STUDENT ? chats.List : chats.data}
              contentContainerStyle={{paddingBottom: 20}}
              renderItem={({item}) => {
                // console.log(item);
                let copyClipText =
                  item.answeredon !== '' ? item.answer : item.question;
                return (
                  <>
                    <View
                      key={item.questionid}
                      style={[
                        styles.chatView,
                        {
                          alignSelf:
                            priority === 'p4' || priority === 'p5'
                              ? item.answeredon !== ''
                                ? 'flex-start'
                                : 'flex-end'
                              : item.answeredon === ''
                              ? 'flex-start'
                              : 'flex-end',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.chatViewWrapper,
                          {
                            backgroundColor:
                              item.answeredon !== ''
                                ? '#ECF6FF'
                                : Constants.GREY006,
                          },
                        ]}
                      >
                        {item.answeredon !== '' ? (
                          <View style={styles.chatViewReplyHeader}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text style={styles.chatSenderName}>
                                {item.studentname}
                              </Text>
                              {/* {item.changeanswer === '1' ? (
                                <Text
                                  style={
                                    ([styles.chatSentDate],
                                    {color: Constants.GREEN001})
                                  }
                                >
                                  EDITED
                                </Text>
                              ) : null} */}
                            </View>
                            <Text style={styles.chatText}>{item.question}</Text>
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.chatSenderName,
                              {marginTop: 5, marginLeft: 10},
                            ]}
                          >
                            {item.studentname}
                          </Text>
                        )}
                        <TouchableOpacity
                          onLongPress={() => copyToClipboard(copyClipText)}
                        >
                          <View style={{padding: 10}}>
                            <Hyperlink
                              linkDefault={true}
                              linkStyle={{color: '#2980b9'}}
                            >
                              <Text style={styles.chatText}>
                                {copyClipText}
                              </Text>
                            </Hyperlink>
                            <Text style={styles.chatSentDate}>
                              {item.answeredon !== ''
                                ? getTime(item.answeredon)
                                : getTime(item.createdon)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {priority !== STUDENT && item.answeredon === '' && (
                        <TouchableOpacity
                          onPress={() => {
                            checkReplying(item);
                          }}
                        >
                          {/* <Image
                            source={ReplyIcon}
                            style={{height: 21, width: 21}}
                          /> */}

                          <Icons
                            name={ICON.THREE_DOTS_VERTICAL}
                            size={21}
                            color={Constants.DARK_COLOR}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {priority !== 'p4' &&
                    priority !== 'p5' &&
                    item.answeredon !== '' ? (
                      <View
                        key={item.questionid}
                        style={[
                          styles.chatView,
                          {
                            alignSelf: 'flex-start',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.chatViewWrapper,
                            {
                              backgroundColor: Constants.GREY006,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            // style={{backgroundColor: 'red'}}
                            onLongPress={() => copyToClipboard(item.question)}
                          >
                            <View style={{padding: 10}}>
                              {priority !== 'p4' || priority !== 'p5' ? (
                                <Text style={[styles.chatSenderName]}>
                                  {item.studentname}
                                </Text>
                              ) : null}
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{color: '#2980b9'}}
                              >
                                <Text style={styles.chatText}>
                                  {item.question}
                                </Text>
                              </Hyperlink>
                              <Text style={styles.chatSentDate}>
                                {getTime(item.createdon)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        {priority !== STUDENT && item.answeredon !== '' && (
                          <TouchableOpacity
                            onPress={() => {
                              checkReplying(item);
                            }}
                          >
                            {/* <Image
                              source={ReplyIcon}
                              style={{height: 21, width: 21}}
                            /> */}

                            <Icons
                              name={ICON.THREE_DOTS_VERTICAL}
                              size={21}
                              color={Constants.DARK_COLOR}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : item.answeredon !== '' ? (
                      <View
                        key={item.questionid}
                        style={[
                          styles.chatView,
                          {
                            alignSelf: 'flex-end',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.chatViewWrapper,
                            {
                              backgroundColor: Constants.GREY006,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            onLongPress={() => copyToClipboard(item.question)}
                          >
                            <View style={{padding: 10}}>
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{color: '#2980b9'}}
                              >
                                <Text style={styles.chatText}>
                                  {item.question}
                                </Text>
                              </Hyperlink>
                              <Text style={styles.chatSentDate}>
                                {getTime(item.createdon)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </>
                );
              }}
              keyExtractor={item => item.questionid}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{padding: 20}}
            />
          ) : (
            !loading &&
            isIterateAble === false && (
              <>
                <View
                  style={{
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>Chat is not stated yet!</Text>
                </View>
              </>
            )
          )}
        </View>
        <View style={styles.chatInputWrapper}>
          {priority !== STUDENT && reply !== null && (
            <>
              <View
                style={[
                  styles.chatInnerWrapper,
                  {backgroundColor: Constants.GREY007},
                ]}
              >
                <View style={styles.chatHeaderRow}>
                  <Text style={styles.chatReplyHeaderText}>
                    {reply.question}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setReplying(null);
                    }}
                  >
                    <Icons
                      style={styles.chatSendIcon}
                      name={ICON.HIGHLIGHT_OFF}
                      size={20}
                      color={Constants.WHITE_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.chatInnerWrapper}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={message}
                    style={styles.chatInput}
                    placeholder="Chat Message"
                    onChangeText={message => setMessage(message)}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      if (reply !== null) {
                        replyTo(message);
                      } else {
                        postQuestion(message);
                      }
                    }}
                  >
                    <Icons
                      style={styles.chatSendIcon}
                      name={ICON.SEND}
                      size={20}
                      color={'#3F6EE8'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.chatBanner}>
                <View
                  style={{
                    backgroundColor: isEnabled ? Constants.GREEN003 : '#767577',
                    borderRadius: 50,
                    paddingVertical: 1.5,
                  }}
                >
                  <Switch
                    style={{
                      // width: 40,
                      // height: 15,
                      transform: [{scaleX: 1}, {scaleY: 1}],
                    }}
                    trackColor={{false: '#767577', true: Constants.GREEN003}}
                    thumbColor={Constants.WHITE_COLOR}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
                <Text style={styles.chatBannerText1}>OFF/ON</Text>
                <Text style={styles.chatBannerText2}>
                  If you enable this button, the text will send to all the
                  students.
                </Text>
              </View>
            </>
          )}
          {priority === STUDENT && (
            <View style={styles.chatInnerWrapper}>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={message}
                  style={styles.chatInput}
                  placeholder="Chat Message"
                  onChangeText={message => setMessage(message)}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    if (reply !== null) {
                      replyTo(message);
                    } else {
                      postQuestion(message);
                    }
                  }}
                >
                  <Icons
                    style={styles.chatSendIcon}
                    name={ICON.SEND}
                    size={20}
                    color={'#3F6EE8'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const mapStatetoProps = ({app}) => ({
  maindata: app.maindata,
});

export default connect(mapStatetoProps, null)(Room);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.WHITE_COLOR,
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 0,
    alignSelf: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    height: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '50%',
    position: 'absolute',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 30,
    width: '100%',
    alignItems: 'center',
    paddingLeft: 15,
    marginVertical: 3,
  },
  Text: {
    fontFamily: FONT.primaryRegular,
  },
  modalText: {
    fontFamily: FONT.primaryMedium,
    color: Constants.DARK_COLOR,
    paddingLeft: 10,
  },
  contentWrapper: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: Constants.BLACK000,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: '#1B82E1',
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
    borderBottomColor: Constants.WHITE_COLOR,
    paddingBottom: 3,
  },
  titleDescription: {
    fontFamily: FONT.primaryBold,
    color: Constants.WHITE_COLOR,
    fontSize: Constants.FONT_BADGE,
  },
  chatArea: {
    flex: 1,
  },
  chatView: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  chatText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
  },
  linkText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_ELEVEN,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  chatSentDate: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_TEN,
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  chatSenderName: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: Constants.RED002,
    fontFamily: FONT.primaryMedium,
  },
  chatViewWrapper: {
    borderRadius: 4,
    width: windowWidth - 150,
    marginRight: 5,
  },
  chatViewReplyHeader: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#D2EAFF',
    borderRadius: 4,
  },
  chatReplyHeaderText: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    backgroundColor: Constants.WHITE_COLOR,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: windowWidth - 100,
  },
  chatInputWrapper: {
    marginBottom: 115,
  },
  chatInnerWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Constants.GREY006,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.WHITE_COLOR,
    borderRadius: 4,
  },
  chatSendIcon: {
    padding: 10,
  },
  chatInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Constants.WHITE_COLOR,
    color: Constants.BLACK000,
  },
  chatBanner: {
    backgroundColor: Constants.BLACK000,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  chatBannerText1: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_TEN,
    color: Constants.WHITE_COLOR,
    marginLeft: 5,
  },
  chatBannerText2: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_NINE,
    color: Constants.WHITE_COLOR,
    marginLeft: 20,
    width: '70%',
  },
});
