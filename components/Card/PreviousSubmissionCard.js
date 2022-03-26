import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Constants, FONT, ICON} from '../../constants/constants';
import Card from './card';
import Button from '../Button/button';
import Spinner from 'react-native-loading-spinner-overlay';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openFile} from '../../screen/DashboardHome/util/fileManager';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

const PreviousSubmissionCard = ({item, onDelete, bottomSheetAction}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const openAttachment = file_path => {
    console.log(item);
    if (
      item.file_name.includes('pdf') ||
      item.file_name.includes('jpg') ||
      item.file_name.includes('png') ||
      item.file_name.includes('jpeg') ||
      item.file_name.includes('JPG') ||
      item.file_name.includes('PNG') ||
      item.file_name.includes('JPEG')
    ) {
      setLoading(true);
      openFile(item.file_name, () => {
        setLoading(false);
      });
    } else {
      bottomSheetAction({hideSheet: true});
      navigation.navigate('VideoPlayerCommon', {video: item, assignment: true});
    }
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
        <TouchableOpacity onPress={() => openAttachment(item)}>
          <Icons style={styles.fileIcon} name={'file-outline'} size={35} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.topicStyle}>{item.submittedtime}</Text>
          <Text style={styles.title}>
            {item.file_name ? item.file_name.split('/').pop() : ''}
          </Text>
          {/* <Text style={styles.subTitle}>{item.dep}</Text> */}
        </View>
        {onDelete && (
          <View>
            {/* <Button
              style={styles.deleteButton}
              onPress={() => {
                onDelete(item);
              }}
            >
              <Icons
                name="delete"
                size={16}
                color={Constants.BUTTON_RED_COLOR}
              />
              <Text style={[styles.actionButtonText]}>Delete</Text>
            </Button> */}
          </View>
        )}
      </View>

      {expandedView ? (
        <>
          <View style={styles.horizontalLine}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </>
      ) : null}
    </Card>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    bottomSheetAction: bindActionCreators(setBottomSheetData, dispatch),
  };
};
export default connect(null, mapDispatchToProps)(PreviousSubmissionCard);

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
