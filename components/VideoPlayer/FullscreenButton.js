import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Styles from './Styles';

const FullscreenButton = ({ onPress, fullscreen }) => {
    return (
        <Styles.Button onPress={onPress}>
            <Icon
                name={fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                color="#fff"
                size={30}
            />
        </Styles.Button>
    );
};

export default FullscreenButton;