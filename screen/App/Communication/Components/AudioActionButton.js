import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Constants, ICON} from '../../../../constants/constants';

export const AudioActionButton = ({
  record = true,
  play,
  onPress = () => null,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        play
          ? {borderColor: 'rgba(24, 152, 75, 0.2)'}
          : record
          ? null
          : {borderColor: Constants.RED001},
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          play
            ? {backgroundColor: Constants.GREEN002}
            : record
            ? null
            : {backgroundColor: Constants.RED002},
        ]}
      >
        {play ? (
          <MaterialIcons
            name={ICON.MATERIAL_ICON_PLAY}
            size={30}
            color={Constants.BRIGHT_COLOR}
          />
        ) : record ? (
          <MaterialIcons
            name={ICON.MATERIAL_ICON_VOICE}
            size={30}
            color={Constants.BRIGHT_COLOR}
          />
        ) : (
          <View style={styles.stopBox} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 82,
    borderRadius: 82,
    borderWidth: 3,
    borderColor: Constants.BUTTON_SELECTED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 64,
    backgroundColor: Constants.SKY_BLUE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
});
