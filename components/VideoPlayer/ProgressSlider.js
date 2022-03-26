import React from 'react';

import Slider from '@react-native-community/slider';

const ProgressSlider = ({
    currentPosition,
    maximumValue = 1,
    minimumValue = 0,
    onSlide = () => { },
}) => {
    return (
        <Slider
            style={{ flex: 1 , bottom: 5}}
            onSlidingComplete={onSlide}
            value={currentPosition}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
        />
    );
};

export default ProgressSlider;