import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  VirtualizedList,
  Alert,
} from 'react-native';
import {Constants, ICON, FONT} from '../../constants/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import AnimatedSubheaderNav from '../AnimatedSubheaderNav';
import {NavTab} from '../Tab';
import {stylesForEachTabs} from '../CommonStyles';

const TabComponent = ({
  onLeftTabPress,
  onRightTabPress,
  onRefresh,
  renderItem,
  isDataAvailable,
  data,
  count,
  refreshing,
  departmentNoticeList,
  collegeNoticeList,
}) => {
  const [loading, setLoading] = useState(true);
  const [isLeftTabSelected, setIsLeftTabSelected] = useState(true);
  <AnimatedSubheaderNav
    list={!loading && isDataAvailable}
    items={itemProps => {
      return loading ? (
        <View
          style={{
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner color="#3b5998" visible={loading} size="large" />
        </View>
      ) : isDataAvailable ? (
        <VirtualizedList
          data={data}
          initialNumToRender={5}
          getItem={(data, index) => data[index]}
          getItemCount={data => data.length}
          renderItem={renderItem}
          contentContainerStyle={styles.viewLastCard}
          keyExtractor={item => item.detailsid}
          refreshing={refreshing}
          onRefresh={onRefresh}
          {...itemProps}
        />
      ) : (
        <View style={styles.noData}>
          <Text style={[styles.title, {fontFamily: FONT.primaryRegular}]}>
            No data found
          </Text>
        </View>
      );
    }}
    leftTab={
      <NavTab text="Department" active={isLeftTabSelected} count={count} />
    }
    rightTab={
      <NavTab text="College" active={!isLeftTabSelected} count={count} />
    }
    headerContent={
      <>
        <View style={styles.row}>
          <Text style={styles.title}>Notice Board</Text>
          {departmentNoticeList.length + collegeNoticeList.length ? (
            <View style={styles.badge}>
              <Text style={styles.buttonTextBadge}>
                {departmentNoticeList.length + collegeNoticeList.length}
              </Text>
            </View>
          ) : null}
        </View>
      </>
    }
    onLeftTabPress={onLeftTabPress}
    onRightTabPress={onRightTabPress}
    leftTabWrapperStyle={
      isLeftTabSelected
        ? styles.selectedTabWrapperStyle
        : styles.tabWrapperStyle
    }
    rightTabWrapperStyle={
      !isLeftTabSelected
        ? styles.selectedTabWrapperStyle
        : styles.tabWrapperStyle
    }
  />;
};

export default TabComponent;

const styles = StyleSheet.create({
  ...stylesForEachTabs,
});
