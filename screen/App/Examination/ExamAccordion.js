/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Card from '../../../components/Card/card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT} from '../../../constants/constants';
import SubCard from './subCard/SubCard';

const SubExamCard = ({
  sectionData = sectionData,
  startdate = '',
  enddate = '',
  differenceCheck = '',
  editSubjectOnly = false,
  editSectionid = '',
}) => {
  const [expandable, setExpandable] = useState(false);
  const renderItem = ({item}) => {
    // console.log(sectionData, item);
    return (
      <SubCard
        sectionData={sectionData}
        item={item}
        startingdate={startdate}
        endingdate={enddate}
        // onPress
      />
    );
  };
  // console.log(editSubjectOnly, 'check', differenceCheck);
  const checkExpandable = () => {
    if (editSubjectOnly === true) {
      if (editSectionid === sectionData.sectionid) {
        setExpandable(!expandable);
      } else {
        setExpandable(false);
      }
    } else {
      if (
        differenceCheck.includes(sectionData.sectionid) ||
        differenceCheck === ''
      ) {
        setExpandable(!expandable);
      } else {
        setExpandable(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Card style={[styles.card]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            ...styles.header,
            backgroundColor:
              editSubjectOnly === true
                ? editSectionid === sectionData.sectionid
                  ? Constants.BLUE002
                  : 'grey'
                : differenceCheck.includes(sectionData.sectionid) ||
                  differenceCheck === ''
                ? Constants.BLUE002
                : 'grey',
          }}
          onPress={() => checkExpandable()}
        >
          <View
            style={{
              ...styles.header,
              ...styles.leftView,
              backgroundColor:
                editSubjectOnly === true
                  ? editSectionid === sectionData.sectionid
                    ? Constants.BLUE002
                    : 'grey'
                  : differenceCheck.includes(sectionData.sectionid) ||
                    differenceCheck === ''
                  ? Constants.BLUE002
                  : 'grey',
            }}
          >
            <Icons
              name="check-circle"
              size={16}
              style={{
                color: expandable ? Constants.GREEN002 : Constants.WHITE_COLOR,
              }}
            />
            <Text style={styles.textHeader}>{sectionData.sectionname}</Text>
          </View>

          <View style={{flex: 1}}>
            <Icon
              name={!expandable ? 'arrow-drop-down' : 'arrow-drop-up'}
              size={25}
              style={styles.iconRight}
            />
          </View>
        </TouchableOpacity>

        {expandable && (
          <FlatList
            data={sectionData.subjectdetails}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.viewLastCard}
          />
        )}
      </Card>
    </View>
  );
};
export default SubExamCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: '2%',
    padding: 0,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Constants.BLUE002,
    height: 40,
  },
  leftView: {flex: 2, marginLeft: 5},
  textHeader: {
    fontFamily: FONT.primaryBold,
    fontSize: Constants.FONT_THIRTEEN,
    marginLeft: 10,
    color: Constants.WHITE_COLOR,
  },
  iconRight: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: Constants.WHITE_COLOR,
  },
});
