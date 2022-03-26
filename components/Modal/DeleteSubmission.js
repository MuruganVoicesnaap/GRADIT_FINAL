import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';
import DeleteSubmissionImage from '../../assests/images/DeleteSubmission.png';
import {Constants, FONT} from '../../constants/constants';
import Button from '../Button/button';

const DeleteSubmission = ({visible, hideModal, onDelete}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView>
          <View style={styles.deleteWrapper}>
            <Image
              source={DeleteSubmissionImage}
              style={{height: 116, width: 154}}
            />
            <Text style={styles.deleteHeading}>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button style={styles.cancelButton} onPress={hideModal}>
              <Text
                style={[
                  styles.actionButtonText,
                  {color: Constants.BRIGHT_COLOR},
                ]}
              >
                Cancel
              </Text>
            </Button>
            <Button style={styles.deleteButton} onPress={onDelete}>
              <Text
                style={[
                  styles.actionButtonText,
                  {color: Constants.BRIGHT_COLOR},
                ]}
              >
                Delete
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default DeleteSubmission;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
  },
  deleteWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteHeading: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.GREY001,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 20,
  },
  deleteButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.BUTTON_RED_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.BUTTON_SELECTED_COLOR,
  },
});
