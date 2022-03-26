import React from 'react';

import {Modal, Portal} from 'react-native-paper';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
import Button from '../Button/button';
import {Constants, FONT} from '../../constants/constants';

const ChooseRecipient = ({visible, onSelect, onCancel}) => {
  return (

    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={styles.modalContainerStyle}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleContainer}>Choose the Department</Text>
            <Button
              style={styles.editButtonView}
              onPress={() => {
                onCancel();
              }}
            >
              <Text style={[styles.editButton]}>close</Text>
            </Button>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.button}
              onPress={() => {
                onSelect('myDepartment');
              }}
            >
              <Text style={[styles.actionButtonText]}>My Department</Text>
            </Button>
            <Button
              style={styles.outlineButton}
              onPress={() => {
                onSelect('otherDepartment');
              }}
            >
              <Text style={[styles.actionButtonText, {color: '#1B82E1'}]}>
                Other Department
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

export default ChooseRecipient;

const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    // backgroundColor: 'red',
    marginHorizontal: 10,

    // padding: 50,
    // top: '30%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingVertical: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  container: {
    paddingHorizontal: 10,
  },
  titleContainer: {
    fontFamily: FONT.primaryRegular,
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  buttonWrapper: {
    justifyContent: 'center',
    marginVertical: 15,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: FONT.primaryRegular,
    color: Constants.WHITE_COLOR,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1B82E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
    marginVertical: 10,
  },
  outlineButton: {
    flexDirection: 'row',
    borderColor: '#1B82E1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginRight: 15,
    marginVertical: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#BBBBBB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 15,
  },
  editButtonView: {
    backgroundColor: Constants.RED003,
    width: '20%',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW_MED,
    color: Constants.WHITE_COLOR,
  },
});
