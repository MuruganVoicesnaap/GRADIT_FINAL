/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import RenderListItem from 'react-native-dropdown-picker/src/components/RenderListItem';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Gradit from '../../assests/images/gradit.png';
import {Constants, FONT} from '../../constants/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import AppConfig from '../../redux/app-config';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const renderListItem = props => {
  const IconComponent = (
    <View style={styles.iconContainerStyle}>
      <Icons
        name={`radio-button-${!props.isSelected ? 'un' : ''}checked`}
        size={20}
        color="#18984B"
      />
    </View>
  );

  return (
    <RenderListItem
      {...props}
      IconComponent={IconComponent}
      listItemLabelStyle={{
        fontSize: Constants.FONT_BADGE,
      }}
      listItemContainerStyle={{
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 20,
      }}
    />
  );
};
const CountryChoose = ({navigation, getBaseUrl}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [countryopen, setcountryOpen] = useState(false);
  const [countryloading, setcountryLoading] = useState(true);
  const [countryvalue, setcountryValue] = useState(null);
  const [countryitems, setcountryItems] = useState([]);

  useEffect(() => {
    getCountry();
  }, []);

  const getCountry = () => {
    setcountryLoading(true);
    fetch(
      //'http://106.51.127.215:8090/api/AppDetailsBal/Getcountrylist?AppId=1',
      AppConfig.API_URL + 'Getcountrylist'+'?AppId='+1
    )
      .then(response => {
        console.log('You are here,,,,,');

        return response.json();
      })
      .then(json => {
        setcountryItems(json?.data)
        console.log('Countryresponse',json?.data);


      }

      )
      .catch(error => console.error(error))
      .finally(() => setcountryLoading(false));
  };

  const setBaseUrl = async () => {
    console.log(countryvalue.baseurls);
    // let valueToStore = countryvalue.slice(0, -3);
    try {
      await AsyncStorage.setItem('BaseUrl', countryvalue.baseurls);
      navigation.navigate(AppConfig.SCREEN.LOGIN_SCREEN);
    } catch (error) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View>
          <Image source={Gradit} style={styles.image} />
        </View>
        <View style={{marginTop: '5%'}}>
          <Text style={styles.textMild}>Choose your </Text>
          <Text style={styles.textBold}>Country </Text>

          <View style={{marginTop: '10%'}}>
            <DropDownPicker
              open={countryopen}
              value={countryvalue}
              items={countryitems?.map(item => ({
                label: '    +' + item.codecountry + '      ' + item.country,
                value: item,
              }))}
              setOpen={x => {
                setcountryOpen(x);
              }}
              setValue={x => {
                setcountryValue(x);
              }}
              setItems={x => {
                setcountryItems(x);
              }}
              containerProps={{
                height: countryopen ? 250 : undefined,
              }}
              renderListItem={renderListItem}
              loading={countryloading}
              // searchPlaceholder="Search..."
              showTickIcon={false}
              itemKey="value"
              placeholder="-- Select Country --"
              placeholderStyle={styles.placeholderStyle}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              style={styles.dropdown}
              searchTextInputStyle={styles.searchTextInputStyle}
              searchContainerStyle={styles.searchContainerStyle}
              listMode="SCROLLVIEW"
              ArrowUpIconComponent={({style}) => (
                <Icons name="arrow-drop-up" size={25} />
              )}
              ArrowDownIconComponent={({style}) => (
                <Icons name="arrow-drop-down" size={25} />
              )}
              // searchable
              closeAfterSelecting
              ActivityIndicatorComponent={({color, size}) => (
                <ActivityIndicator color={color} size={size} />
              )}
              zIndex={6000}
              zIndexInverse={1000}
              ListEmptyComponent={({message}) => (
                <Text style={{alignSelf: 'center'}}>No Data found</Text>
              )}
            />
          </View>

          <TouchableOpacity
            style={countryopen ? styles.buttonOnOpen : styles.button}
            onPress={() => {
              setBaseUrl(countryvalue);
            }}
          >
            <Text
              style={{
                ...styles.text,
                color: Constants.BRIGHT_COLOR,
                fontSize: Constants.FONT_MED,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(null, null)(CountryChoose);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  image: {
    marginTop: '40%',
    resizeMode: 'cover',
    width: 150,
    height: 90,
  },
  textMild: {
    color: Constants.MILD_COLOR,
    fontSize: Constants.FONT_MED,
  },
  textBold: {
    color: Constants.DARK_COLOR,
    fontSize: Constants.FONT_MED_LAR,
    fontFamily: FONT.primaryMedium,
  },
  input: {
    height: 50,
    flex: 1,
    paddingLeft: '3%',
    // paddingBottom: -5,
    fontSize: Constants.FONT_LOW,
    color: Constants.TEXT_INPUT_COLOR,
  },
  button: {
    height: 40,
    backgroundColor: Constants.SECONDARY_COLOR,
    marginTop: '55%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOnOpen: {
    height: 40,
    backgroundColor: Constants.SECONDARY_COLOR,
    marginTop: '5%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Constants.FONT_LOW,
    fontFamily: FONT.primaryMedium,
  },
  forgetText: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginHorizontal: '20%',
  },
  spinnerTextStyle: {
    color: '#3b5998',
  },
  placeholderStyle: {
    color: '#C0C0C0',
  },
  dropDownContainerStyle: {
    borderColor: '#222222',
    backgroundColor: '#F6FBFF',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#222222',
    // width: StyleSheet.hairlineWidth,
  },
  searchTextInputStyle: {
    borderColor: '#D4D4D4',
  },
  searchContainerStyle: {
    borderBottomColor: '#F6FBFF',
  },
  iconContainerStyle: {
    marginRight: 10,
  },
});
