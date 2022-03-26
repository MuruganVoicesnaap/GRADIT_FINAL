/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Constants,
  FONT,
  TOUCHABLE_ACTIVE_OPACITY,
} from '../../constants/constants';
import {setBottomSheetData} from '../../redux/actions/setBottomSheetData';
import Advertisement from '../Advertisement';
import Button from '../Button/button';
import Header from '../Header/Header';
import DeleteSubmission from '../Modal/DeleteSubmission';
import {Provider} from 'react-native-paper';

export const AddDataLayout = ({
  children,
  onConfirm,
  onCancel,
  uploading = false,
  title,
  goBack = () => null,
  rightButtonText,
  rightButtonDisabled,
}) => {
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);
  useEffect(() => {
    return () => dispatch(setBottomSheetData({hideSheet: false}));
  }, []);
  const toggleModal = () => setShowCancelModal(prevState => !prevState);
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <Header />
        <Advertisement />
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={styles.header}
        >
          <Icons name="arrow-left" size={18} color={Constants.WHITE_COLOR} />
          <Text style={styles.headerText}>{title}</Text>
        </TouchableOpacity>
        {/* <ScrollView style={{flex:1}}>{children}</ScrollView> */}
        {children}
        <View style={styles.footer}>
          <Button
            style={[styles.actionButton, {backgroundColor: Constants.GREY004}]}
            onPress={toggleModal}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>
          <Button
            style={[
              styles.actionButton,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: Constants.GREEN002,
                opacity: rightButtonDisabled || uploading ? 0.5 : 1,
              },
            ]}
            onPress={onConfirm}
            disabled={uploading || rightButtonDisabled}
          >
            <Text style={styles.buttonText}>
              {uploading ? 'Uploading..' : rightButtonText || 'Confirm'}
            </Text>
          </Button>
        </View>
        <DeleteSubmission
          visible={showCancelModal}
          hideModal={toggleModal}
          onDelete={onCancel || goBack}
        />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  header: {
    backgroundColor: Constants.DARK_COLOR,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
  },
  headerText: {
    color: Constants.WHITE_COLOR,
    fontFamily: FONT.primaryBold,
    fontSize: 14,
    paddingLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: 20,
  },
  actionButton: {
    height: 40,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONT.primaryMedium,
    fontSize: 13,
    color: Constants.WHITE_COLOR,
  },
});
