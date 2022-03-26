import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Styles from './Styles';

const BackButton = ({ onPress, back }) => {
    return (
        <Styles.Button onPress={onPress}>
            <Icon
                name={'arrow-back'}
                color="#fff" 
                size={20}
            />
        </Styles.Button>
    );
};

export default BackButton;