import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import {StyleSheet, SafeAreaView} from 'react-native';
import FeedbackComp from '../Feedback';

const Feedback = ({visible, loading, state, message}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView>
          <FeedbackComp loading={loading} state={state} message={message} />
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
});
