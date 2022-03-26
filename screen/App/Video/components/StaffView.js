import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Card from '../../../../components/Card/card';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, FONT} from '../../../../constants/constants';

const StaffViewCard = ({
  title = '',
  description = '',
  dateOnly = '',
  timeOnly = '',
  item = {},
  onPress = onPress,
  selectedCard,
  setSelectedCard,
  cardIndex,
  checkRead = '',
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const navigation = useNavigation();
  const [hide, setHide] = useState(false);

  const hideMore = () => {
    setHide(true);
  };

  return (
    <Card
      style={styles.cardOpen}
      onPress={() => {
        setSelectedCard(-1);
      }}
    >
      <View style={[styles.row, styles.centerAlign]}>
        <View style={styles.leftHeadView}>
          {/* <Icons
            name="video"
            size={30}
            color={Constants.BUTTON_SELECTED_COLOR}
            style={{marginTop: -5}}
          /> */}
          <Text style={styles.titleView} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.rightHeadView}>
          <View
            style={[{alignItems: 'flex-end', textAlign: 'right', bottom: '9%'}]}
          >
            <Text style={styles.dateView}>{dateOnly}</Text>
            <Text style={styles.timeView}>{timeOnly}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={onPress} style={styles.attachmentView}>
          <Icons name="play" size={20} color={Constants.BLACK007} />
          <Text style={styles.attachmentText}>Play Video</Text>
        </TouchableOpacity>
        {cardIndex === selectedCard ? (
          <>
            <View style={[styles.horizontalLine, styles.halfLine]} />
            <Text style={[styles.textnormal, styles.descriptionText]}>
              {description}
            </Text>
          </>
        ) : null}
        {cardIndex != selectedCard ? (
          <TouchableOpacity
            style={[styles.moreAttachmentView]}
            onPress={() => {
              setSelectedCard(cardIndex);
            }}
          >
            <Icons
              name="chevron-down"
              color={Constants.SKY_BLUE_COLOR}
              // backgroundColor={Constants.WHITE_COLOR}
              // borderColor={Constants.SKY_BLUE_COLOR}
              //color={Constants.WHITE_COLOR}
              size={20}
              // style={{right: '5%'}}
            />
            <Text
              style={{
                color: Constants.SKY_BLUE_COLOR,
                fontSize: 16,
                bottom: 2,
                // left: 0,
              }}
            >
              more
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Card>
  );
};
export default StaffViewCard;
const styles = StyleSheet.create({
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textnormal: {
    fontSize: Constants.FONT_FULL_LOW,
    fontWeight: Constants.FONT_WEI_NORMAL,
  },
  horizontalLine: {
    borderWidth: 0.5,
    borderColor: Constants.TEXT_INPUT_COLOR,
    width: '50%',
    alignSelf: 'flex-start',
    marginVertical: '2%',
    marginBottom: '2%',
  },
  halfLine: {
    borderBottomColor: '#000000',
    width: '50%',
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  row2: {
    top: 5,
    flexDirection: 'row',
  },
  cardOpen: {
    backgroundColor: Constants.CARD_COLOR,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    height: undefined,
    marginVertical: '2%',
    borderRadius: 5,
  },
  leftHeadView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderLeftColor: Constants.BUTTON_SELECTED_COLOR,
    marginVertical: '2.5%',
    flex: 2,
  },
  rightHeadView: {
    alignSelf: 'flex-start',
    flex: 1,
    marginVertical: '3%',
    flexDirection: 'column',
  },
  titleView: {
    fontWeight: Constants.FONT_WEI_BOLD,
    marginLeft: 5,
    maxWidth: '70%',
    color: Constants.DARK_COLOR,
  },
  descriptionText: {
    fontSize: Constants.FONT_FULL_LOW,
    color: Constants.DARK_COLOR,
    marginVertical: '2%',
  },
  attachmentView: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 100,
    borderColor: Constants.DARK_COLOR,
    borderRadius: 6,
    paddingVertical: '1%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAttachmentView: {
    flexDirection: 'row',
    borderWidth: 0,
    // maxWidth: '40%',
    borderColor: Constants.WHITE_COLOR,
    borderRadius: 0,
    //paddingVertical: '1%',
    //justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    //left: '60%',
    // backgroundColor: 'red',
  },
  attachmentText: {
    fontSize: Constants.FONT_BADGE,
    color: Constants.DARK_COLOR,
    paddingHorizontal: '1%',
    paddingLeft: 3,
  },
  dateView: {
    fontSize: Constants.FONT_TEN,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
    top: -3,
  },
  timeView: {
    fontSize: 12,
    marginLeft: 3,
    color: Constants.DARK_COLOR,
  },
});
