import React from 'react';
import {Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Constants} from '../constants/constants';

const Feedback = ({loading, state, message}) => {
  return (
    <>
      {loading && <ActivityIndicator animating={true} />}
      {!loading && state && (
        <>
          <Icons
            name={'done'}
            size={50}
            color={'#229557'}
            style={{alignSelf: 'center'}}
          />
          <Text style={{alignSelf: 'center'}}>
            {message ? message : 'Updated successful'}
          </Text>
        </>
      )}
      {!loading && !state && (
        <>
          <Icons
            name={'cancel'}
            size={50}
            color={Constants.BUTTON_RED_COLOR}
            style={{alignSelf: 'center'}}
          />
          <Text style={{alignSelf: 'center'}}>
            {message ? message : 'Fetch failed'}
          </Text>
        </>
      )}
    </>
  );
};

export default Feedback;
