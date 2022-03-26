import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Styles from './Styles';

const SpeedButton = ({ onChangeSpeed }) => {
    const [showSelector, setShowSelector] = useState(false);

    const handleButtonPress = () => {
        setShowSelector(prevState => !prevState);
    };

    const handleSpeedSelect = newSpeed => {
        onChangeSpeed(newSpeed);
        setShowSelector(false);
    };

    return (
        <>
            <Styles.Button onPress={handleButtonPress}>
                <Icon name={'speed'} color="#fff" size={30} />
            </Styles.Button>

            {showSelector && (
                <Styles.SelectorContainer>
                    <Styles.SelectorButton onPress={() => handleSpeedSelect(0.5)}>
                        <Styles.SelectorButtonText>0.5x</Styles.SelectorButtonText>
                    </Styles.SelectorButton>
                    <Styles.SelectorButton onPress={() => handleSpeedSelect(1)}>
                        <Styles.SelectorButtonText>1.0x</Styles.SelectorButtonText>
                    </Styles.SelectorButton>
                    <Styles.SelectorButton onPress={() => handleSpeedSelect(2)}>
                        <Styles.SelectorButtonText>2.0x</Styles.SelectorButtonText>
                    </Styles.SelectorButton>
                </Styles.SelectorContainer>
            )}
        </>
    );
};

export default SpeedButton;