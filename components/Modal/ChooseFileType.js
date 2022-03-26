import React from 'react';
import {Modal, Portal} from 'react-native-paper';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Constants, FONT} from '../../constants/constants';
import Button from '../Button/button';

const ChooseFileType = ({visible, hideModal, onSelect}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView>
          <View style={styles.deleteWrapper}>
            <Text style={styles.deleteHeading}>Choose File Type</Text>
            <View style={styles.buttonWrapper}>
              <Button
                style={styles.viewButton}
                onPress={() => {
                  onSelect('pdf');
                }}
              >
                <Text style={[styles.actionButtonText]}>PDF</Text>
              </Button>
              <Button
                style={styles.viewButton}
                onPress={() => {
                  onSelect('image');
                }}
              >
                <Text style={[styles.actionButtonText]}>IMAGE</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default ChooseFileType;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
  },
  deleteWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginTop: 15,
  },
  viewButton: {
    marginHorizontal: 3,
    flexDirection: 'row',
    backgroundColor: Constants.GREEN002,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
});
