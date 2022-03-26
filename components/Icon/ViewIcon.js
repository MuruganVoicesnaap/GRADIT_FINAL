import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '../../constants/constants'

const IconView = ({name, size = 18, color = Constants.BRIGHT_COLOR, style}) => {
  return <Icon name={name} size={size} color={color} style={style} />;
};

export default IconView;
