import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openFile} from '../../screen/DashboardHome/util/fileManager';

const AssignmentQuestion = ({navigation, item}) => {
  console.log(item, 'itemmmm');
  const [loading, setLoading] = useState(false);

  const openAttachment = file_path => {

    console.log('OpenAttachMent',"opening")
    setLoading(true);
    openFile(file_path, () => {
      setLoading(false);
    });
  };
  return (
    <Card style={styles.card} onPress={() => openAttachment(item)}>
      <Spinner
        color="#3b5998"
        visible={loading}
        size="large"
        textStyle={styles.spinnerTextStyle}
      />

      <View style={styles.row}>
        <TouchableOpacity onPress={() => openAttachment(item)}>
          <Icons style={styles.fileIcon} name={'file-outline'} size={35} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.topicStyle}>{item.submittedtime}</Text>
          <Text style={styles.title}>{item ? item.split('/').pop() : ''}</Text>
          {/* <Text style={styles.subTitle}>{item.dep}</Text> */}
        </View>
      </View>
    </Card>
  );
};

export default AssignmentQuestion;

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
  title: {
    fontFamily: FONT.primaryBold,
    fontSize: 13,
    color: Constants.DARK_COLOR,
  },
  subTitle: {
    fontSize: 10,
    color: '#8A8A8A',
  },
  deleteButton: {
    marginHorizontal: 3,
    borderColor: Constants.BUTTON_RED_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 9,
    fontFamily: FONT.primaryRegular,
    paddingLeft: 5,
    color: Constants.BUTTON_RED_COLOR,
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
    marginTop: 10,
  },
});
