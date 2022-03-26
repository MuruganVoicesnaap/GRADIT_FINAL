/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Button from '../Button/button';
import Spinner from 'react-native-loading-spinner-overlay';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import AppConfig from '../../redux/app-config';
import {appReadStatus} from '../../redux/actions/appReadStatus';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {bindActionCreators} from 'redux';

const ViewAssignmentCard = ({
  navigation,
  item,
  onDelete,
  memberid,
  priority,
  cardIndex,
  selectedCard,
  setSelectedCard,
  bottomSheetAction,
  getData = () => {},
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(typeof item.createdby, memberid, typeof memberid);
  const openAttachment = item => {
    console.log(item);
    if (item.assignmenttype !== 'video') {
      setLoading(true);
      openFile(item.file_path, () => {
        setLoading(false);
      });
    } else if (item.assignmenttype === 'video') {
      bottomSheetAction({hideSheet: true});
      navigation.navigate('VideoPlayerCommon', {video: item});
    }
  };
  const toggleCheck = () => {
    if (cardIndex !== selectedCard) {
      appReadStatus({
        userid: memberid,
        msgtype: 'assignment',
        detailsid: item.assignmentdetailid,
        priority: priority,
      });
    }
  };

  const additionalCount = item.newfilepath ? item.newfilepath.length - 1 : 0;
  // console.log('check......', cardIndex);
  return (
    <Card
      style={styles.card}
      onPress={() => {
        toggleCheck();
        {
          cardIndex === selectedCard
            ? setSelectedCard(-1)
            : setSelectedCard(cardIndex);
        }
      }}
    >
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />

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
                        assignmenttype: item.assignmenttype,
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
            <Text style={styles.submissionDateText}>Submission On:</Text>
            <Pill
              text={moment(item.submissiondate, 'DD/MM/yyyy').format(
                'Do MMM, YY',
              )}
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

          <View style={styles.actionButtonContainer}>
            <Button
              style={styles.viewButton}
              onPress={() => {
                navigation.navigate(
                  AppConfig.SCREEN.VIEW_ASSIGNMENT_SUBMISSION,
                  {
                    assignmentid: item.assignmentid,
                    assignmenttype: item.assignmenttype,
                  },
                );
              }}
            >
              <Icons
                name={ICON.ATTACHMENTS}
                size={16}
                color={Constants.WHITE_COLOR}
              />
              <Text style={styles.actionButtonText}>
                {item.submittedcount} Submission
              </Text>
            </Button>
            <Button
              style={styles.fwdButton}
              onPress={() => {
                navigation.navigate(AppConfig.SCREEN.NEW_ASSIGNMENT, {
                  item: item,
                });
              }}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  {color: Constants.BRIGHT_COLOR},
                ]}
              >
                Forward
              </Text>
            </Button>

            {Number(item.createdby) === memberid &&
              moment().diff(
                moment(item.createdon, 'DD MMM yyyy - LTS'),
                'hours',
              ) <= 24 && (
                <Button
                  style={styles.deleteButton}
                  onPress={() => onDelete(item)}
                >
                  <Icons
                    name="delete"
                    size={16}
                    color={Constants.BUTTON_RED_COLOR}
                  />
                </Button>
              )}
          </View>
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
export default connect(mapStatetoProps, mapDispatchToProps)(ViewAssignmentCard);

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
    paddingHorizontal: 5,
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
  deleteButton: {
    marginLeft: 10,
    borderColor: Constants.BUTTON_RED_COLOR,
    borderWidth: 1,
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fwdButton: {
    marginLeft: 10,
    backgroundColor: '#1B82E1',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: '#229557',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  actionButtonText: {
    fontSize: 11,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.WHITE_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
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
