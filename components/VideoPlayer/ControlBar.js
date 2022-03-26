import React from 'react';

import PlayButton from './PlayButton';
import FullscreenButton from './FullscreenButton';
import ProgressSlider from './ProgressSlider';
import SpeedButton from './SpeedButton';
import BackButton from './BackButton';

import * as Styles from './Styles';

const ControllBar = ({
  onPause,
  paused,
  videoDuration,
  currentPosition,
  onSlide,
  onChangeSpeed,
  onFullscreen,
  fullscreen,
  onFinish,
  handleEnd,
}) => {
  return (
    <Styles.Container>
      {/* <Styles.TopBlock>
                <BackButton onPress={back} />
            </Styles.TopBlock> */}

      <Styles.LeftBlock>
        <PlayButton handleEnd={onPause} onPress={onPause} paused={paused} />
      </Styles.LeftBlock>

      <Styles.MiddleBlock>
        <ProgressSlider
          currentPosition={
            videoDuration > 0 ? currentPosition / videoDuration : 0
          }
          onSlide={onSlide}
        />
      </Styles.MiddleBlock>

      <Styles.RightBlock>
        {/* <SpeedButton onChangeSpeed={onChangeSpeed} /> */}

        <FullscreenButton onPress={onFullscreen} fullscreen={fullscreen} />
      </Styles.RightBlock>
    </Styles.Container>
  );
};

export default ControllBar;
