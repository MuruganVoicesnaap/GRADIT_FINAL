import React, {useState} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import {SafeAreaView, ScrollView, StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Header from '../../components/Header/Header';
import {Constants} from '../../constants/constants';
import {dashboardData} from '../../redux/actions/dashboardData';
import getMenuList from '../../redux/actions/getMenuList';
import {getDashboardComponent} from './util/getDashboardComponent';
import Spinner from 'react-native-loading-spinner-overlay';

const DashboardDummyData = {
  Status: 1,
  Message: 'Success',
  data: [
    {
      type: 'Emergency Notification',
      order: 1,
      data: [
        {
          description: 'Teachers b ready',
          voicefilepath:
            'https://college-app-files.s3.amazonaws.com/53/15-07-2021/File_20210715150128340.mp4',
          duration: 6,
          membername: 'Principal',
          createdon: '15/07/2021 03:07:24 PM',
        },
      ],
    },
    {
      type: 'Attendance',
      order: 2,
      data: [
        {
          subjectname: 'Ethics',
          attendancetype: 'Present',
          attendancedate: '27/08/2020',
        },
        {
          subjectname:
            'Music Festival - Data Structures With C/C++ Laboratory Music Festival - Data Structures With C/C++ Laboratory',
          attendancetype: 'Present',
          attendancedate: '27/08/2020',
        },
      ],
    },
    {
      type: 'Upcoming Events',
      order: 3,
      data: [
        {
          eventtopic: 'Music Festival - Data Structures With C/C++ Laboratory',
          eventdate: '2023-09-11',
          eventtime: '14:55:00 pm',
        },
        {
          eventtopic: 'Hackathon VX21 - Object-Oriented Programming With C++',
          eventdate: '2023-09-11',
          eventtime: '12:55:00 pm',
        },
      ],
    },
    {
      type: 'Upcoming Examinaitons',
      order: 4,
      data: [
        {
          examname: 'First Revision Test',
          examdate: '2023-08-29',
          examsession: 'FN',
          venue: 'MCA Block - 234',
          subjectname: 'Data Structures With C/C++ Laboratory',
        },
      ],
    },
    {
      type: 'Assignments',
      order: 5,
      data: [
        {
          assignmenttopic: 'Electronic Circuits and Logic Design',
          assignmentdescription: 'test',
          submissiondate: '2020-09-08',
          filepaths: [
            'https://college-app-files.s3.amazonaws.com/1112186150File_20200320111214031.jpg',
          ],
        },
      ],
    },
    {
      type: 'Notice Board',
      order: 6,
      data: [
        {
          topicheading: 'Data Structures With C/C++ Laboratory',
          topicbody:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi suscipit malesuada nunc et.',
          createddate: '2020-09-10',
          createdtime: '11:48:41 AM',
        },
      ],
    },
    {
      type: 'Circular',
      order: 7,
      data: [
        {
          title: 'Electronic Circuits and Logic Design',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit....',
          filepaths: [
            'https://college-app-files.s3.amazonaws.com/53/30-04-2021/File_20210430142729114.jpg',
          ],
          createddate: '2021-04-30',
          createdtime: '12:56:37 PM',
        },
      ],
    },
    {
      type: 'Recent Notifications',
      order: 8,
      data: [
        {
          typ: 'Image',
          sentbyname: 'Priya',
          createdondate: '30/03/2021',
          createdontime: '05:52:44 PM',
          content:
            'https://college-app-files.s3.amazonaws.com/85/30-03-2021/File_20210330175024_IMG_20210 330_174954_846218543373898204.jpg',
          description: 'test app\n',
          duration: 0,
        },
        {
          typ: 'Image',
          sentbyname: 'Priya',
          createdondate: '30/03/2021',
          createdontime: '05:52:44 PM',
          content:
            'https://college-app-files.s3.amazonaws.com/85/30-03-2021/File_20210330175024_IMG_20210 330_174954_846218543373898204.jpg',
          description: 'test app\n',
          duration: 0,
        },

        {
          typ: 'Image',
          sentbyname: 'Priya',
          createdondate: '30/03/2021',
          createdontime: '05:52:44 PM',
          content:
            'https://college-app-files.s3.amazonaws.com/85/30-03-2021/File_20210330175024_IMG_20210 330_174954_846218543373898204.jpg',
          description: 'test app\n',
          duration: 0,
        },
      ],
    },

    {
      type: 'Leave Request',
      order: 10,
      data: [
        {
          leaveapplicationid: 228,
          studentid: 5971,
          membername: 'Student1',
          coursename: 'BL',
          departmentname: 'Law',
          yearname: 'Year 1',
          sectionname: 'Morning',
          reason: 'ஒரே நாளில் மட்டும் ',
          fromdate: '26/07/2021',
          todate: '30/07/2021',
          leavestatus: 'WaitingForApproval',
          noofdays: '4',
          appliedon: '16/07/2021 01:07:25 PM',
        },
      ],
    },

    {
      type: 'Chat',
      order: 11,
      data: [
        {
          coursename: 'BL',
          departmentname: 'Law',
          yearname: 'Year 1',
          sectionname: 'Evening',
          studentname: 'Student2',
          question: '👀',
          createdon: '14/07/2021 12:07:00 AM',
        },
        {
          coursename: 'BL',
          departmentname: 'Law',
          yearname: 'Year 1',
          sectionname: 'Evening',
          studentname: 'Student2',
          question: '👀',
          createdon: '14/07/2021 12:07:00 AM',
        },
        {
          coursename: 'BL',
          departmentname: 'Law',
          yearname: 'Year 1',
          sectionname: 'Evening',
          studentname: 'Student2',
          question: '👀',
          createdon: '14/07/2021 12:07:00 AM',
        },
      ],
    },
    {
      type: 'Ad',
      order: 12,
      data: [
        {
          add_title: 'Test Add',
          add_content: 'Voice Snap first add',
          company: 'Voicesnap',
          background_image:
            'https://school-app-files.s3.amazonaws.com/File_20210426160033_images.jpeg',
          add_image:
            'https://school-app-files.s3.amazonaws.com/File_20210426160033_images.jpeg',
          add_url: 'http://106.51.127.215:8090/',
          video_url: 'https://www.youtube.com/watch?v=s7pcWnlwcjA',
        },
      ],
    },
  ],
};
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const DashboardHome = ({
  dashboard,
  navigation,
  getDashboardData,
  maindata,
  getMenuLists,
}) => {
  const [selectedCard, setSelectedCard] = useState(-1);
  const [selectedCardEmergency, setSelectedCardEmergency] = useState(-1);
  const [responseFromAPi, setResponseFromAPi] = useState('');
  const {memberid, colgid, priority} = maindata;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };
  const getData = () => {
    getDashboardData({
      userid: memberid,
      collegeid: colgid,
      priority: priority,
    }).then(response => {
      if (response.Message !== 'Success') {
        setResponseFromAPi(response.Message);
      } else {
        setResponseFromAPi('');
      }
    });
    getMenuLists({
      collegeid: colgid,
      userid: memberid,
      countryid: '1',
      langid: '1',
    }).then(response => {
      if (response.Message !== 'Success') {
        Alert.alert(response.Message);
      }
    });
    wait(100).then(() => setRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.fullscreen}>
      <Header
        onRefreshingPage={() => {
          onRefresh();
        }}
      />
      <View style={styles.container}>
        {refreshing ? (
          <>
            <Spinner color="#3b5998" visible={refreshing} size="large" />
          </>
        ) : (
          <>
            {responseFromAPi !== '' && (
              <View style={{alignItems: 'center'}}>
                <Text>{responseFromAPi}</Text>
              </View>
            )}
            <ScrollView>
              <>
                {dashboard.error === true && (
                  <View>
                    <ActivityIndicator color="#3b5998" size="large" />
                  </View>
                )}
                {dashboard.data?.map((componentData, index) =>
                  getDashboardComponent(
                    componentData,
                    index,
                    navigation,
                    setSelectedCard,
                    selectedCard,
                    selectedCardEmergency,
                    setSelectedCardEmergency,
                  ),
                )}
              </>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
const mapStatetoProps = ({app}) => {
  const {maindata} = app;
  return {
    dashboard: app.dashboard || {},
    maindata,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getDashboardData: data => dispatch(dashboardData(data)),
    getMenuLists: data => dispatch(getMenuList(data)),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(DashboardHome);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    backgroundColor: Constants.WHITE_COLOR,
    paddingBottom: '20%',
  },
  verticalGap: {
    marginBottom: 12,
  },
  fullscreen: {
    flex: 1,
  },
});
