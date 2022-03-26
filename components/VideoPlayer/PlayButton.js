import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Styles from './Styles';

const PlayButton = ({onPress, paused}) => {
  return (
    <Styles.Button onPress={onPress}>
      <Icon name={paused ? 'play-arrow' : 'pause'} color="#fff" size={30} />
    </Styles.Button>
  );
};

export default PlayButton;
