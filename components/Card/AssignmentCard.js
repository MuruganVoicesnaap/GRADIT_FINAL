/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../Button/button';
import Spinner from 'react-native-loading-spinner-overlay';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import AppConfig from '../../redux/app-config';
import {appReadStatus} from '../../redux/actions/appReadStatus';
import DeleteSubmission from '../Modal/DeleteSubmission';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {bindActionCreators} from 'redux';

const AssignmentCard = ({
  navigation,
  item,
  onSubmit,
  memberid,
  priority,
  cardIndex,
  selectedCard,
  setSelectedCard,
  bottomSheetAction,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);

  const openAttachment = item => {
    console.log(item);
    if (item.assignmenttype !== 'video') {
      setLoading(true);
      openFile(item.file_path, () => {
        setLoading(false);
      });
    } else if (item.assignmenttype === 'video') {
      bottomSheetAction({hideSheet: true});
      navigation.navigate('VideoPlayerCommon', {
        video: item,
        assignment: false,
      });
    }
  };
  console.log(priority, 'hufufjvjfuyjv');
  var dueDate = moment(item.submissiondate, 'DD/MM/yyyy').format('Do MMM, YY');

  console.log('itemmmmm', item);
  const lateSubmission = () => {
    if (dueDate) {
      var date1 = new Date(moment(item.submissiondate, 'DD/MM/yyyy').format());
      var date2 = new Date();
      if (date1 <= date2) {
        Alert.alert('Submission date has crossed', 'still want to submit', [
          {
            text: 'Cancel',

            style: 'Cancel',
          },
          {text: 'Yes', onPress: () => onSubmit(item)},
        ]);
      } else {
        onSubmit(item);
        return;
      }
    }
  };
  const toggleCheck = () => {
    if (cardIndex !== selectedCard) {
      appReadStatus({
        userid: memberid,
        msgtype: 'assignment',
        detailsid: null,
        priority: priority,
      });
    }
  };
  const additionalCount = item.newfilepath ? item.newfilepath.length - 1 : 0;
  return (
    <Card
      style={styles.card}
      onPress={() => {
        //setSelectedCard(cardIndex);
        toggleCheck();
        {
          cardIndex === selectedCard
            ? setSelectedCard(-1)
            : setSelectedCard(cardIndex);
        }
      }}
    >
      <Spinner color="#3b5998" visible={loading} size="large" />

      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={styles.topicStyle}>{item.sentbyname}</Text>
          </View>
          <View style={styles.titleLine}>
            <Text style={styles.title}>{item.topic}</Text>
          </View>
          {item.newfilepath?.length && (
            <View style={styles.attachmentWrapperStyle}>
              <Pill
                text={item.userfilename.split(',').pop()}
                icon={ICON.ATTACHMENTS}
                containerStyle={styles.attachmentStyle}
                textStyle={{fontFamily: FONT.primaryBold}}
                onPress={() => openAttachment(item)}
                numberOfLines={2}
              />
              {additionalCount > 0 && (
                <Pill
                  text={`+${additionalCount}`}
                  containerStyle={styles.extraAttachmentStyle}
                  onPress={() => {
                    navigation.navigate(
                      AppConfig.SCREEN.VIEW_ASSIGNMENT_QUESTION,
                      {
                        assignmentid: item.newfilepath,
                        // assignmenttype: item.assignmenttype,
                      },
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
        <View>
          <DateTime
            date={moment(item.createdon, 'DD MMM yyyy - LTS').format(
              'Do MMM, YY',
            )}
            time={moment(item.createdon, 'DD MMM yyyy - LTS').format('LT')}
            textStyle={{fontSize: 9}}
          />
          <View style={{marginTop: 10}}>
            {moment().diff(moment(item.submissionDate, 'DD/MM/yyyy'), 'days') <=
              1 && (
              <Text
                style={[
                  styles.submissionDateText,
                  {color: Constants.BUTTON_RED_COLOR},
                ]}
              >
                One Day to Submit
              </Text>
            )}
            <Text style={styles.submissionDateText}>Submission On:</Text>
            <Pill
              text={dueDate}
              containerStyle={styles.submissionDate}
              textStyle={{fontSize: 9}}
            />
          </View>
          {cardIndex != selectedCard ? (
            <TouchableOpacity
              style={[styles.row3, styles.moreAttachmentView]}
              onPress={() => {
                setSelectedCard(cardIndex);
              }}
            >
              <Icons
                name="chevron-down-circle-outline"
                color={Constants.SKY_BLUE_COLOR}
                backgroundColor={Constants.WHITE_COLOR}
                // borderColor={Constants.SKY_BLUE_COLOR}
                //color={Constants.WHITE_COLOR}
                size={18}
                style={{right: '5%'}}
              />
              <Text
                style={{
                  color: Constants.SKY_BLUE_COLOR,
                  fontSize: 18,
                  bottom: 1,
                  left: 4,
                }}
              >
                more
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {cardIndex === selectedCard ? (
        <>
          <View style={[styles.horizontalLine, styles.halfWidth]} />
          <Text style={styles.description}>{item.description}</Text>

          {priority === 'p4' ? (
            <View style={styles.actionButtonContainer}>
              <Button
                style={styles.prevButton}
                onPress={() => {
                  navigation.navigate('AssignmentTAb', {
                    assignmentid: item.assignmentid,
                    assignmenttype: item.assignmenttype,
                  });
                }}
              >
                <Text style={styles.actionButtonText}>Prev Submission</Text>
              </Button>
              <Button
                style={styles.submitButton}
                onPress={() => {
                  lateSubmission();
                }}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    {color: Constants.BRIGHT_COLOR},
                  ]}
                >
                  Submit
                </Text>
              </Button>
            </View>
          ) : null}
        </>
      ) : null}
    </Card>
  );
};

const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
});
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(AssignmentCard);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: Constants.BRIGHT_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: undefined,
    marginVertical: 7,
    marginHorizontal: 16,
    borderRadius: 5,
    flex: 1,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.GREY091,
    marginTop: 12,
  },
  halfWidth: {
    width: '50%',
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 11,
    color: '#1B82E1',
    borderBottomColor: Constants.GREY001,
    borderBottomWidth: 0.5,
    marginTop: 3,
    paddingBottom: 2,
  },
  titleContainer: {
    flex: 2,
    alignSelf: 'flex-start',
  },
  titleLine: {
    marginTop: 5,
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 13,
    color: Constants.DARK_COLOR,
    marginStart: 8,
  },
  attachmentWrapperStyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 160,
  },
  attachmentStyle: {
    borderWidth: 1,
    borderColor: Constants.GREY091,
    backgroundColor: 'transparent',
    maxWidth: 200,
    minHeight: 24,
    height: 'auto',
    paddingVertical: 2,
  },
  extraAttachmentStyle: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  submissionDateText: {
    fontFamily: FONT.primaryBold,
    fontSize: 9,
  },
  submissionDate: {
    borderWidth: 1,
    borderColor: Constants.BLACK000,
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  prevButton: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: '#229557',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  actionButtonText: {
    fontSize: 9,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 8,
  },
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: 10,
    color: Constants.BLACK003,
    marginTop: 8,
  },
  moreAttachmentView: {
    flexDirection: 'row',
    borderWidth: 0,
    width: 100,
    borderColor: Constants.WHITE_COLOR,
    borderRadius: 0,
    paddingVertical: '1%',
    //justifyContent: 'center',
    alignItems: 'center',
    left: '-4%',
  },
  row3: {
    top: 10,
    flexDirection: 'row',
  },
});
