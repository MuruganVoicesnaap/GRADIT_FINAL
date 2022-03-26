import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Button from './Button/button';
import {Constants, FONT} from '../constants/constants';

export const AddRecipientModal = ({
  selectedName = '',
  onAddRecepient = onAddRecepient,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => setModalVisible(prevState => !prevState);

  const checkName = () => {
    if (selectedName === 'Add receipent') {
      toggleModal();
      onAddRecepient();
    } else {
      toggleModal();
    }
  };
  return (
    <>
      {selectedName !== 'Add receipent' ? (
        <View style={{width: '100%'}}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.titleMain}>
              Click here to view added receipents
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title, styles.titlePosition]}>
              Selected Recipients
            </Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                checkName();
              }}
            >
              <Text style={[styles.title, {color: Constants.BRIGHT_COLOR}]}>
                {selectedName}
              </Text>
            </TouchableOpacity>
            <Button
              style={styles.buttonStyle}
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={[styles.title, {color: Constants.BRIGHT_COLOR}]}>
                OK
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
  },

  contentContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    height: '30%',
    width: '60%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.primaryMedium,
    fontSize: Constants.FONT_LOW,
    color: Constants.DARK_COLOR,
  },
  titleMain: {
    marginTop: 10,
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    color: Constants.GREEN002,
  },
  titlePosition: {
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    height: 40,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Constants.FACULTY_HEAD_COLOR,
    marginTop: 30,
  },
  addRecipientPill: {
    borderWidth: 1,
    borderColor: Constants.GREY004,
    height: 36,
    marginTop: 10,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    width: '100%',
  },
  addRecipientText: {
    fontFamily: FONT.primaryRegular,
    fontSize: 12,
  },
});
