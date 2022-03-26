import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AddExamScreen from '../screen/App/Examination/AddExam';
import CreateExam from '../screen/App/Examination/CreateExams';
import ExaminationScreen from '../screen/App/Examination/Examination';
import UpcomingExam from '../screen/App/Examination/UpcomingExam';
import ExamListScreen from '../screen/App/Examination/ExamList';
import SubjectListScreen from '../screen/App/Examination/SubjectList';
import Faculty from '../screen/App/Faculty';
import Video from '../screen/App/Video/Video';
import VideoPlayer from '../screen/App/Video/VideoPlayer';
import CollegeNotice from '../screen/App/NoticeBoard/College';
import AddNotice from '../screen/App/NoticeBoard/AddNotice';
import CollegeCircular from '../screen/App/Circular/College';
import AddCircular from '../screen/App/Circular/AddCircular';
import AttendanceScreen from '../screen/App/Attendance/Attendance';
import LeaveHistory from '../screen/App/Attendance/LeaveHistory';
import AddLeave from '../screen/App/Attendance/AddLeave';
import UpcomingEvents from '../screen/App/Events/UpcomingEvents';
import PastEvents from '../screen/App/Events/PastEvents';
import AddEvents from '../screen/App/Events/AddEvents';
import VideoUploadScreen from '../screen/App/Video/VideoUpload';
import AssignmentScreen from '../screen/App/Assignment/Home';
import AssignmentPreviousSubmissionScreen from '../screen/App/Assignment/PreviousSubmission';
import StaffAssignmentScreen from '../screen/App/Assignment/Staff/Home';
import ViewAssignmentSubmissionScreen from '../screen/App/Assignment/Staff/ViewSubmission';
import ViewSubmittedAssigmentScreen from '../screen/App/Assignment/Staff/SubmittedAssigment';
import NewAssignmentScreen from '../screen/App/Assignment/Staff/NewAssignment';
import viewAssignmentQuestion from '../screen/App/Assignment/viewAssignmentQuestion';
import ChatHomeScreen from '../screen/App/Chat/Home';
import ChatRoomScreen from '../screen/App/Chat/Room';
import MyWeb from '../screen/App/WebViewFile';

import DashboardHome from '../screen/DashboardHome';
import Events from '../screen/App/Events/Events';
import AppConfig from '../redux/app-config';
import AddVoice from '../screen/App/Communication/AddVoice';
import AddMessage from '../screen/App/Communication/AddMessage';
import Communication from '../screen/App/Communication/Communication';
import Notification from '../screen/App/Notification';
import VideoLocalPlay from '../screen/App/Video/VideoLocalPlay';
import ChangeNewPassword from '../screen/App/ChangeNewPassword';
import VideoPlayerCommon from '../screen/App/VideoPlayerCommon';
import PreviousSubmissionLeft from '../screen/App/Assignment/PreviousSubmissionLeft';
import ViewCircular from '../screen/App/Circular/ViewCircular';

import DetailsForSemester from '../screen/App/DetailsForSemester';
import Profile from '../screen/App/Profile';
import SemsterStudentCredits from '../screen/App/SemsterStudentCredits';

import CategoryCredit from '../screen/App/CategoryCredit';
import { Constants } from '../constants/constants';

const ExaminationStack = createStackNavigator();
const CommunicationStack = createStackNavigator();
const CircularStack = createStackNavigator();
const NoticeBoardStack = createStackNavigator();
const AtttendanceStack = createStackNavigator();
const EventStack = createStackNavigator();
const VideoStack = createStackNavigator();
const EventStackScreen = ({ navigation }) => (
  <EventStack.Navigator headerMode="none" initialRouteName="UpcomingEvents">
    <EventStack.Screen name="UpcomingEvents" component={UpcomingEvents} />
    <EventStack.Screen name="PastEvents" component={PastEvents} />
    <EventStack.Screen name="Events" component={Events} />
    <EventStack.Screen name="AddEvents" component={AddEvents} />
  </EventStack.Navigator>
);

const AtttendanceStackScreen = ({ navigation }) => (
  <AtttendanceStack.Navigator
    headerMode="none"
    initialRouteName="AttendanceScreen"
  >
    <AtttendanceStack.Screen
      name="AttendanceScreen"
      component={AttendanceScreen}
    />
    <AtttendanceStack.Screen name="LeaveHistory" component={LeaveHistory} />
    <AtttendanceStack.Screen name="AddLeave" component={AddLeave} />
  </AtttendanceStack.Navigator>
);

const CommunicationStackScreen = ({ navigation }) => (
  <CommunicationStack.Navigator headerMode="none">
    <CommunicationStack.Screen
      name={AppConfig.SCREEN.COMMUNICATON}
      component={Communication}
    />
    <CommunicationStack.Screen
      name={AppConfig.SCREEN.ADD_VOICE}
      component={AddVoice}
    />
    <CommunicationStack.Screen
      name={AppConfig.SCREEN.ADD_MESSAGE}
      component={AddMessage}
    />
  </CommunicationStack.Navigator>
);

const ExaminationStackScreen = ({ navigation }) => (
  <ExaminationStack.Navigator headerMode="none" initialRouteName="UpcomingExam">
    <ExaminationStack.Screen name="UpcomingExam" component={UpcomingExam} />
    <ExaminationStack.Screen name="CreateExam" component={CreateExam} />
    <ExaminationStack.Screen name="ExamListScreen" component={ExamListScreen} />
    <ExaminationStack.Screen
      name="SubjectListScreen"
      component={SubjectListScreen}
    />
    <ExaminationStack.Screen
      name="ExaminationScreen"
      component={ExaminationScreen}
    />
    <ExaminationStack.Screen
      name={AppConfig.SCREEN.ADD_EXAM}
      component={AddExamScreen}
    />
  </ExaminationStack.Navigator>
);

const NoticeBoardStackScreen = ({ navigation }) => (
  <NoticeBoardStack.Navigator headerMode="none">
    <NoticeBoardStack.Screen name="CollegeNotice" component={CollegeNotice} />
    <NoticeBoardStack.Screen name="AddNotice" component={AddNotice} />
  </NoticeBoardStack.Navigator>
);

const CircularStackScreen = ({ navigation }) => (
  <CircularStack.Navigator headerMode="none" initialRouteName="CollegeCircular">
    <CircularStack.Screen name="CollegeCircular" component={CollegeCircular} />
    <CircularStack.Screen name="AddCircular" component={AddCircular} />
  </CircularStack.Navigator>
);
const VideoStackScreen = ({ navigation }) => (
  <VideoStack.Navigator headerMode="none" initialRouteName="Video">
    <VideoStack.Screen name="Video" component={Video} />
    <VideoStack.Screen name="VideoPlayer" component={VideoPlayer} />
    <VideoStack.Screen name="VideoLocalPlay" component={VideoLocalPlay} />
    <VideoStack.Screen name="VideoUploadScreen" component={VideoUploadScreen} />
  </VideoStack.Navigator>
);

const Stack = createStackNavigator();
export const DashboardStack = () => {
  return (
    <>
      <Stack.Navigator initialRouteName={AppConfig.SCREEN.DASHBOARD_HOME}>
        <Stack.Screen
          name={AppConfig.SCREEN.DASHBOARD_HOME}
          options={{ headerShown: false }}
          component={DashboardHome}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.EVENT_STACK?.NAME}
          component={EventStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.COMMUNICATION_STACK?.NAME}
          component={CommunicationStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.EXAMINATION_STACk?.NAME}
          component={ExaminationStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME}
          component={NoticeBoardStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.ATTENDANCE_STACK?.NAME}
          component={AtttendanceStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.CIRCULAR_STACK?.NAME}
          component={CircularStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewCircular"
          options={{ headerShown: false }}
          component={ViewCircular}
        />
        <Stack.Screen
          name="Faculty"
          component={Faculty}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Video"
          component={VideoStackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.CHAT_HOME_SCREEN}
          options={{ headerShown: false }}
          component={ChatHomeScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.CHAT_ROOM_SCREEN}
          options={{
            headerShown: false,
          }}
          component={ChatRoomScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.ASSIGNMENT}
          options={{ headerShown: false }}
          component={AssignmentScreen}
        />
        <Stack.Screen
          name="AssignmentTAb"
          options={{ headerShown: false }}
          component={PreviousSubmissionLeft}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.ASSIGNMENT_PREVIOUS_SUBMISSION}
          options={{ headerShown: false }}
          component={AssignmentPreviousSubmissionScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.VIEW_ASSIGNMENT_QUESTION}
          options={{ headerShown: false }}
          component={viewAssignmentQuestion}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.STAFF_ASSIGNMENT}
          options={{ headerShown: false }}
          component={StaffAssignmentScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.VIEW_ASSIGNMENT_SUBMISSION}
          options={{ headerShown: false }}
          component={ViewAssignmentSubmissionScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.NEW_ASSIGNMENT}
          options={{ headerShown: false }}
          component={NewAssignmentScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.SUBMITTED_ASSIGNMENT}
          options={{ headerShown: false }}
          component={ViewSubmittedAssigmentScreen}
        />
        <Stack.Screen
          name={AppConfig.SCREEN.CHANGE_NEW_PASSWORD}
          options={{ headerShown: false }}
          component={ChangeNewPassword}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoPlayerCommon"
          component={VideoPlayerCommon}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyWeb"
          component={MyWeb}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={AppConfig.SCREEN.DETAILS_FOR_SEMESTER}
          options={{ headerShown: false }}
          component={DetailsForSemester}
        />

        <Stack.Screen
          name={AppConfig.SCREEN.PROFILE}
          options={{
            headerShown: false,
          }}
          component={Profile}
        />

        <Stack.Screen
          name={AppConfig.SCREEN.SEMESTER_CREDITS_SCREEN}
          options={{ headerShown: false }}
          component={SemsterStudentCredits}
        />

        <Stack.Screen
          name={AppConfig.SCREEN.CATEGORY_CREDITS}
          options={{ headerShown: false }}
          component={CategoryCredit}
        />
      </Stack.Navigator>
    </>
  );
};
