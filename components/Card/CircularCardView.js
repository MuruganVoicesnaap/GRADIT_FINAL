import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Button from '../Button/button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import {DateTime} from '../DateTime/DateTime';
import {Pill} from '../Pill/Pill';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import {appReadStatus} from '../../redux/actions/appReadStatus';
import {connect} from 'react-redux';
import {deleteCircular} from '../../redux/actions/addCircular';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
const CircularCardComponent = ({
  headerid = '',
  priority = '',
  memberid = '',
  detailsid = '',
  createdondate = '',
  createdontime = '',
  description = '',
  filePath = '',
  sentbyname = '',
  title = '',
  onPress = onPress,
  collegeid = '',
  selectedCard,
  setSelectedCard,
  newfilepath,
  cardIndex,
  userfilename,
  checkRead = '',
  getData = () => {},
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const openAttachment = () => {
    setLoading(true);
    openFile(filePath, () => {
      setLoading(false);
    });
  };

  const toggleCheck = () => {
    if (cardIndex !== selectedCard) {
      statusChange();
    }
  };
  const statusChange = () => {
    if (cardIndex === selectedCard) {
      appReadStatus({
        userid: memberid,
        msgtype: 'circular',
        detailsid: detailsid,
        priority: priority,
      });
    }
  };

  const onDelete = () => {
    deleteCircular({
      headerid: headerid,
      userid: memberid,
      collegeid: collegeid,
    })
      .then(data => {
        getData();
        Toast.show('Deleted successfully', Toast.LONG);
      })
      .catch(data => {
        Toast.show('Failed to Fetch', Toast.LONG);
      });
  };
  const deleteConfirm = () =>
    Alert.alert('Delete Circular', "Once done can't be changed", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onDelete()},
    ]);
  const additionalCount = newfilepath ? newfilepath.length - 1 : 0;
  const fileName = userfilename?.split('/').pop();
  const checkStatusOpen = () => {
    if (newfilepath.length > 1) {
      navigation.navigate('ViewCircular', {
        assignmentid: newfilepath,
      });
    } else {
      openAttachment();
    }
  };
  return (
    <Card
      style={styles.card}
      onPress={() => {
        toggleCheck();
        setSelectedCard(-1);
      }}
    >
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />
      {priority !== 'p4' && priority !== 'p5' && (
        <Pill text={sentbyname} containerStyle={styles.pillContainerStyle} />
      )}

      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <View style={styles.titleLine}>
            <Text style={styles.title}>{title}</Text>
          </View>
          {newfilepath?.length && (
            <View style={styles.attachmentWrapperStyle}>
              <Pill
                text={fileName.split(',').pop()}
                icon={ICON.ATTACHMENTS}
                containerStyle={styles.attachmentStyle}
                textStyle={{fontFamily: FONT.primaryBold}}
                onPress={checkStatusOpen}
                numberOfLines={2}
              />
              {additionalCount > 0 && (
                <Pill
                  text={`+${additionalCount}`}
                  containerStyle={styles.extraAttachmentStyle}
                  onPress={() => {
                    navigation.navigate('ViewCircular', {
                      assignmentid: newfilepath,
                    });
                  }}
                />
              )}
            </View>
          )}
        </View>
        <View style={styles.dateTimeView}>
          <View style={{...styles.row}}>
            <Icon
              name="calendar-blank"
              size={16}
              color={Constants.DARK_COLOR}
            />
            <Text style={styles.dateShown}>{createdondate}</Text>
          </View>
          <View style={{...styles.row}}>
            <Icon
              name="clock-time-five-outline"
              size={16}
              color={Constants.DARK_COLOR}
            />
            <Text style={styles.timeShown}>{createdontime}</Text>
          </View>
          {cardIndex != selectedCard ? (
            <TouchableOpacity
              style={[styles.row3, styles.moreAttachmentView]}
              onPress={() => {
                setSelectedCard(cardIndex);
              }}
            >
              <Icon
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
          <Text style={styles.description}>{description}</Text>

          {priority !== 'p4' && priority !== 'p5' ? (
            <View style={styles.actionButtonContainer}>
              {/* Delete feature is on discussion */}
              {/* <Button
                style={styles.deleteButton}
                onPress={() => {
                  deleteConfirm();
                }}
              >
                <Icon name="delete" size={16} color={Constants.WHITE_COLOR} />
                <Text
                  style={[
                    styles.actionButtonText,
                    {color: Constants.BRIGHT_COLOR},
                  ]}
                >
                  Delete
                </Text>
              </Button> */}
            </View>
          ) : (
            <>
              <View style={styles.horizontalLine} />
              <View style={styles.footer}>
                <Text style={[styles.postedName]}>Posted by: </Text>
                <Pill text={sentbyname} />
              </View>
            </>
          )}
        </>
      ) : null}
    </Card>
  );
};

const mapStatetoProps = ({app}) => ({
  priority: app.maindata?.priority,
  memberid: app.maindata?.memberid,
  collegeid: app.maindata?.colgid,
});
export default connect(mapStatetoProps, null)(CircularCardComponent);

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
  editButton: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    borderWidth: 1,
    flexDirection: 'row',
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.BUTTON_RED_COLOR,
    width: 78,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Constants.FONT_BADGE,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pillContainerStyle: {
    backgroundColor: Constants.BLUE001,
    alignSelf: 'flex-start',
    height: 20,
    marginBottom: 8,
  },
  attachmentWrapperStyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 160,
  },
  extraAttachmentStyle: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  titleContainer: {
    flex: 2,
    alignSelf: 'flex-start',
  },
  titleLine: {
    borderLeftWidth: 2,
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    marginStart: 8,
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
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: Constants.FONT_BADGE,
    color: Constants.BLACK003,
    marginTop: 8,
  },
  postedName: {
    color: Constants.BLACK000,
    fontSize: Constants.FONT_BADGE,
    lineHeight: 12,
    fontFamily: FONT.primaryRegular,
  },
  footer: {
    paddingTop: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moreAttachmentView: {
    //flexDirection: 'row',
    top: 10,
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
    left: '-25%',
  },
});
