import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Button from '../Button/button';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import AppConfig from '../../redux/app-config';

const ViewSubmissionCard = ({
  navigation,
  item,
  assignmentid,
  assignmenttype,
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);

  const openAttachment = file_path => {
    setLoading(true);
    openFile(file_path, () => {
      setLoading(false);
    });
  };

  return (
    <Card style={styles.card} onPress={() => setExpandedView(!expandedView)}>
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />

      <View style={styles.row}>
        <Icons style={styles.fileIcon} name={'file-outline'} size={35} />
        <View style={styles.titleContainer}>
          <Text
            style={styles.topicStyle}
          >{`${item.course} | ${item.department}`}</Text>
          <Text style={styles.title}>{item.studentname}</Text>
          <Text
            style={styles.subTitle}
          >{`${item.year} | ${item.semester}`}</Text>
        </View>
        <View>
          <Text style={styles.submitted}>Submitted</Text>
          <Button
            style={styles.viewButton}
            onPress={() => {
              navigation.navigate(AppConfig.SCREEN.SUBMITTED_ASSIGNMENT, {
                assignmentid: assignmentid,
                assignmenttype: assignmenttype,
                memberid: item.studentid,
                studentname: item.studentname,
              });
            }}
          >
            <Icons
              name={ICON.ATTACHMENTS}
              size={16}
              color={Constants.WHITE_COLOR}
            />
            <Text style={[styles.actionButtonText]}>attachement</Text>
          </Button>
        </View>
      </View>

      {/* {expandedView ? (
        <>
          <View style={styles.horizontalLine}>
            <Text style={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit malesuada nunc et.</Text>
          </View>
        </>
      ) : null} */}
    </Card>
  );
};

export default ViewSubmissionCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  fileIcon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 2,
    alignSelf: 'flex-start',
  },
  topicStyle: {
    fontFamily: FONT.primaryRegular,
    fontSize: 10,
    color: '#1B82E1',
    marginTop: 3,
    paddingBottom: 2,
  },
  submitted: {
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
    color: '#229557',
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 12,
    color: Constants.DARK_COLOR,
  },
  subTitle: {
    marginTop: 5,
    fontSize: 10,
    color: '#8A8A8A',
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: Constants.BLACK000,
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
    color: Constants.WHITE_COLOR,
  },
  horizontalLine: {
    borderTopWidth: 0.5,
    borderColor: Constants.GREY091,
    marginTop: 12,
  },
  description: {
    fontFamily: FONT.primaryRegular,
    fontSize: 10,
    color: Constants.DARK_COLOR,
  },
});
