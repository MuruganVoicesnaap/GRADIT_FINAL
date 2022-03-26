import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {List, Provider} from 'react-native-paper';

import {Constants} from '../../constants/constants';

const RecepientSelector = ({route, isVisible, onHide}) => {
  useEffect(() => {}, []);

  const [filterFields, setFilterFields] = useState([
    {
      filterName: 'Course',
      filterOptions: ['ENGINEERING', 'MANAGEMENT'],
      isFilterExpaned: false,
      isEnabled: true,
      selectedValue: 'All Courses',
      defaultValue: 'All Courses',
    },
    {
      filterName: 'Department',
      filterOptions: ['ECE', 'EEE', 'CS'],
      isFilterExpaned: false,
      isEnabled: false,
      selectedValue: 'All Departments',
      defaultValue: 'All Departments',
    },
    {
      filterName: 'Year',
      filterOptions: ['1', '2', '3'],
      isFilterExpaned: false,
      isEnabled: false,
      selectedValue: 'All Years',
      defaultValue: 'All Years',
    },
    {
      filterName: 'Semester',
      filterOptions: ['3', '4', '5'],
      isFilterExpaned: false,
      isEnabled: false,
      selectedValue: 'All Semesters',
      defaultValue: 'All Semesters',
    },
    {
      filterName: 'Section',
      filterOptions: ['A', 'B', 'C'],
      isFilterExpaned: false,
      isEnabled: false,
      selectedValue: 'All Sections',
      defaultValue: 'All Sections',
    },
  ]);

  const handleFilterOptionSelect = (fieldIndex, filterOption) => {
    filterFields[fieldIndex].selectedValue = filterOption;
    // if the current field value is equal to the default value, the upcoming fields has to be disabled and their values has to be set to default values
    // if not, only the next field value should be enabled and next fields should be disabled
    var isCurrentFieldValueDefaultValue =
      filterFields[fieldIndex].selectedValue ===
      filterFields[fieldIndex].defaultValue;
    setFilterFields(
      filterFields.map((tempFilterField, tempFieldIndex) => {
        if (isCurrentFieldValueDefaultValue) {
          if (tempFieldIndex > fieldIndex) {
            tempFilterField.isEnabled = false;
            tempFilterField.isFilterExpaned = false;
            tempFilterField.selectedValue = tempFilterField.defaultValue;
          }
        } else {
          if (tempFieldIndex === fieldIndex + 1) {
            tempFilterField.isEnabled = true;
            tempFilterField.isFilterExpaned = false;
            tempFilterField.selectedValue = tempFilterField.defaultValue;
          }
        }

        return tempFilterField;
      }),
    );
  };
  const handleFilterPressForExpandOrCollapse = fieldIndex => {
    setFilterFields(
      filterFields.map((tempFilterField, tempFieldIndex) => {
        if (fieldIndex === tempFieldIndex) {
          tempFilterField.isFilterExpaned = !tempFilterField.isFilterExpaned;
        } else {
          tempFilterField.isFilterExpaned = false;
        }
        return tempFilterField;
      }),
    );
  };

  return (
    <Provider>
      <View>
        <Modal
          animationType="slide"
          visible={isVisible}
          transparent={true}
          onRequestClose={() => {
            onHide();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.modalHeading}>Add Recepients</Text>
              </View>
              <View>
                <List.Section>
                  {filterFields.map((field, fieldIndex) => {
                    return (
                      <View pointerEvents={field.isEnabled ? 'auto' : 'none'}>
                        <List.Accordion
                          expanded={field.isFilterExpaned}
                          style={[
                            {
                              padding: 0,
                              backgroundColor: Constants.WHITE_COLOR,
                            },
                            {opacity: field.isEnabled ? 1 : 0.5},
                          ]}
                          disabled
                          title={field.filterName}
                          onPress={ev =>
                            handleFilterPressForExpandOrCollapse(fieldIndex)
                          }>
                          <ScrollView style={{maxHeight: 200}}>
                            <List.Item
                              style={{padding: 0, marginLeft: 5}}
                              onPress={() =>
                                handleFilterOptionSelect(
                                  fieldIndex,
                                  field.defaultValue,
                                )
                              }
                              title={field.defaultValue}
                            />
                            {field.filterOptions.map(
                              (filterOption, filterOptionIndex) => {
                                return (
                                  <List.Item
                                    style={{padding: 0, marginLeft: 5}}
                                    onPress={() =>
                                      handleFilterOptionSelect(
                                        fieldIndex,
                                        filterOption,
                                      )
                                    }
                                    title={filterOption}
                                  />
                                );
                              },
                            )}
                          </ScrollView>
                        </List.Accordion>
                      </View>
                    );
                  })}
                </List.Section>
              </View>
              <View style={styles.modalActionsWrapper}>
                <TouchableOpacity
                  onPress={() => onHide()}
                  style={styles.modalActionCancel}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onHide()}
                  style={styles.modalActionAdd}>
                  <Text style={styles.modalActionText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
};
export default RecepientSelector;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 24,
    paddingVertical: 36,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  modalHeading: {
    fontWeight: Constants.FONT_WEI_BOLD,
    fontSize: 16,
  },
  modalActionsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActionCancel: {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: Constants.GREY004,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionAdd: {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: Constants.GREEN002,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionText: {
    color: Constants.WHITE_COLOR,
    fontWeight: Constants.FONT_WEI_BOLD,
    fontSize: 16,
  },
});
