import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Constants, ICON} from '../constants/constants';

const More = ({cardIndex, selectedCard, show}) => {
  return (
    <>
      {cardIndex !== selectedCard ? (
        <Icons
          name={ICON.CHEVRON_DOWN}
          color={Constants.SKY_BLUE_COLOR}
          size={20}
          style={{right: '-1%'}}
        />
      ) : show === true && cardIndex === selectedCard ? (
        <Icons
          name={ICON.CHEVRON_UP}
          color={Constants.SKY_BLUE_COLOR}
          size={20}
          style={{right: '-1%'}}
        />
      ) : null}
    </>
    // <TouchableOpacity
    //   style={[styles.moreAttachmentView]}
    //   onPress={() => {
    //     moreInfo();
    //   }}
    // >
    // <Icons
    //   name={ICON.CHEVRON_DOWN}
    //   color={Constants.SKY_BLUE_COLOR}
    //   size={20}
    //   style={{right: '-1%'}}
    // />
    /* <Text
        style={{
          color: Constants.SKY_BLUE_COLOR,
          fontSize: 16,
          bottom: 2,
          // left: 0,
        }}
      >
        more
      </Text>
     </TouchableOpacity> */
  );
};

export default More;

const styles = StyleSheet.create({
  moreAttachmentView: {
    flexDirection: 'row',
    borderWidth: 0,
    width: '40%',
    borderColor: 'red',
    borderRadius: 0,
    paddingVertical: '1%',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingTop: 8,
    // backgroundColor: 'red',
  },
});
