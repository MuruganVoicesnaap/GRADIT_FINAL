import React from 'react';
import {ViewBase, Text, Flatlist, StyleSheet} from 'react-native';

const VideoRestriction = () => {
  return (
    <View>
      <TouchableOpacity>
        <Text>CONFIRM</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
});
