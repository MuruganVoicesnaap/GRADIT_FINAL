/* eslint-disable no-shadow */
import React from 'react';
import { Section } from '../Components/Section';
import { View, Text, Button } from 'react-native';
import { CommunicationCard } from '../../../components/CommunicationCard/CommunicationCard';

import { EventCard } from '../../../components/EventCard/EventCard';
import { UpcomingExamCard } from '../../../components/UpcomingExamCard/UpcomingExamCard';
import { NoticeCard } from '../../../components/NoticeCard/NoticeCard';
import { CircularCard } from '../../../components/CircularCard/CircularCard';
import { getTime } from '../../../utils/getTime';
import dayjs from 'dayjs';
import AppConfig from '../../../redux/app-config';
import {
  ASSIGNMENT_CARD_COLORS,
  CIRCULAR_CARD_COLORS,
  EVENTS_CARD_COLORS,
  NOTICE_CARD_COLORS,
  UPCOMING_EXAM_CARD_COLORS,
} from '../../../constants/constants';
import { DashboardAssignmentCard } from '../../../components/DashboardAssignmentCard/DashboardAssignmentCard';
import DashboardChartComponent from '../../../components/DashboardChartcard/DashboardChartCard';
import DashboardAttendanceComponent from '../../../components/DashboardAttendance/DashboardAttendance';
import StaffLeaveCard from '../../../components/Card/StaffLeaveCard';
import Advertisement from '../../../components/Advertisement';
import AdvertisementDashBoard from '../../../components/DashboardAd';
import { CommunicationCardEmergency } from '../../../components/CommunicationCard/CommunicationCardEmergency';
import CommonCard from '../../../components/CommonCard';
// import Toast from 'react-native-simple-toast';
const COMPONENT_TYPE = {
  emergencyNotification: 'Emergency Notification',
  upcomingEvents: 'Upcoming Events',
  upcomingExaminations: 'Upcoming Examinations',
  noticeBoard: 'Notice Board',
  circular: 'Circular',
  recentNotification: 'Recent Notifications',
  assignment: 'Assignments',
  dashboardCard: 'Chat',
  leaveApplication: 'Leave Request',
  Attendance: 'Attendance',
  Advertisement: 'Ad',
};

const getDate = dateString => {
  if (dateString && dateString.includes('/')) {
    const [dd, mm, yyyy] = dateString.split('/');
    return dayjs(`${yyyy}-${mm}-${dd}`).format('DD MMM, YY');
  } else {
    return dayjs(dateString).format('DD MMM, YY');
  }
};
const getTimeSeperate = dateString => {
  return dateString.slice(-12);
};
const getDateSeperate = dateString => {
  const dateSeperate = dateString.slice(0, 10);
  const [dd, mm, yyyy] = dateSeperate.split('/');
  return dayjs(`${yyyy}-${mm}-${dd}`).format('DD MMM, YY');
};

// const [selectedCard, setSelectedCard] = useState(-1);
export const getDashboardComponent = (
  componentData,
  index,
  navigation,
  setSelectedCard,
  selectedCard,
  selectedCardEmergency,
  setSelectedCardEmergency,
) => {
  const toggleCheck = (cardIndex, selectedCard) => {
    if (cardIndex !== selectedCard) {
      console.log('toggleCheck', cardIndex, selectedCard);
      setSelectedCard(cardIndex);
    } else if (cardIndex === selectedCard) {
      setSelectedCard(-1);
    }
  };
  switch (componentData.type) {


    case COMPONENT_TYPE.emergencyNotification: {
      // const [selectedCard, setSelectedCard] = useState(-1);
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.COMMUNICATON);
      return (


        <Section

          title="Emergency Notification"
          key={index}
          viewAction={componentData.data.length > 2 ? viewAction : null}
        >
          {componentData.data?.map((notification, index) => (
            <>
              <CommunicationCardEmergency
                title={notification.description}
                descripton={notification.topicbody}
                date={getDateSeperate(notification.createdon)}
                // time={getTime(notification.createdontime)}
                postedBy={notification.membername}
                isVoiceMessage={notification.voicefilepath}
                voiceMessageUrl={notification.voicefilepath}
                videoSec={notification.duration}
                isEmergencyMessage={true}
                checkRead={true}
                selectedCardEmergency={selectedCardEmergency}
                setSelectedCardEmergency={setSelectedCardEmergency}
                setSelectedCard={setSelectedCard}
                cardIndex={index}
                key={`emergency-${index}`}
              />
              <View
                style={
                  index < componentData.data.length - 1
                    ? { marginBottom: 12 }
                    : null
                }
              />


            </>
          ))}

        </Section>


      );
    }

    case COMPONENT_TYPE.Attendance: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.ATTENDANCE_STACK);


      const compData = componentData.data[0]?.message;
      return (
        <Section
          title="Attendance"
          viewAction={componentData.data.length > 0 ? viewAction : null}
          key={index}
        >
         

          {compData === "Today's attendance is not yet available" ? (
            <View>
              <Text>Today's attendance is not yet available</Text>
            </View>
          ) : (
            componentData.data?.map((attendanceList, index) => (
              <>
                <DashboardAttendanceComponent
                  attendancetype={attendanceList.attendancetype}
                  subjectname={attendanceList.subjectname}
                  attendancedate={getDate(attendanceList.attendancedate)}
                  key={`Attendance-${index}`}
                />
                <View
                  style={
                    index < componentData.data.length - 1
                      ? { marginBottom: 5 }
                      : null
                  }
                />
              </>
            ))
          )}
        </Section>
      );
    }

    case COMPONENT_TYPE.leaveApplication: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.ATTENDANCE_STACK.NAME);
      const compData = componentData.data[0]?.message;

      // const [selectedCard, setSelectedCard] = useState(-1);
      return (
        <Section
          title="Leave Application"
          viewAction={componentData.data.length > 0 ? viewAction : null}
          key={index}
        >
          {compData === 'No such record found!' ? (
            <View>
              <Text>No records</Text>
            </View>
          ) : (
            componentData.data?.map((item, index) => (
              <>
                <StaffLeaveCard
                  studentname={item.membername}
                  coursename={item.coursename}
                  departmentname={item.departmentname}
                  yearname={item.yearname}
                  sectionname={item.sectionname}
                  semestername="N/A" //{item.semestername}
                  applicationid={item.leaveapplicationid}
                  leavestatus={item.leavestatus}
                  leavefromdate={item.fromdate}
                  leavetodate={item.todate}
                  leavereason={item.reason}
                  numofdays={item.noofdays}
                  createdon={getDate(item.appliedon)}
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  checkRead={true}
                  cardIndex={index}
                  key={`leaveApplication-${index}`}
                />
                <View
                  style={
                    index < componentData.data.length - 1
                      ? { marginBottom: 5 }
                      : null
                  }
                />
              </>
            ))
          )}
        </Section>
      );
    }
    case COMPONENT_TYPE.Advertisement: {
      // const viewAction = () =>
      //   navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
      const compData = componentData.data[0];
      console.log(compData);
      return (
        <Section
          title="Advertisement"
          // viewAction={componentData.data.length > 0 ? viewAction : null}
          key={index}
        >
          {compData === 'No such record found!' ? (
            <View>
              <Text>No records</Text>
            </View>
          ) : (
            componentData.data?.map((ad, index) => (
              <>
                <AdvertisementDashBoard
                  add_title={ad.add_title}
                  add_content={ad.add_content}
                  background_image={ad.background_image}
                  add_image={ad.add_image}
                  add_url={ad.add_url}
                />

                <View
                  style={
                    index < componentData.data.length - 1
                      ? { marginBottom: 5 }
                      : null
                  }
                />
              </>
            ))
          )}
        </Section>
      );
    }
    case COMPONENT_TYPE.dashboardCard: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.CHAT_HOME_SCREEN);
      const compData = componentData.data[0]?.message;
      return (
        <Section
          title="Chat"
          viewAction={componentData.data.length > 0 ? viewAction : null}
          key={index}
        >
          {compData === 'No such record found!' ? (
            <View>
              <Text>No records</Text>
            </View>
          ) : (
            componentData.data?.map((student, index) => (
              <>
                <DashboardChartComponent
                  title={student.question}
                  descripton={student.studentname}
                  date={getDateSeperate(student.createdon)}
                  time={getTimeSeperate(student.createdon)}
                  key={`dashboard-${index}`}
                />
                <View
                  style={
                    index < componentData.data.length - 1
                      ? { marginBottom: 5 }
                      : null
                  }
                />
              </>
            ))
          )}
        </Section>
      );
    }

    case COMPONENT_TYPE.upcomingEvents: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.EVENT_STACK?.NAME);
      return (
        <Section
          title="Upcoming Events & Workshop"
          horizontalScroll={true}
          viewAction={componentData.data.length >= 2 ? viewAction : null}
          key={index}
        >
          {componentData.data?.map((upcomingExam, index) => (
            <EventCard
              title={upcomingExam.eventtopic}
              date={getDate(upcomingExam.eventdate)}
              time={getTime(upcomingExam.eventtime)}
              key={`events-${index}`}
              backgroundColor={EVENTS_CARD_COLORS[index % 2]}
            />
          ))}
        </Section>
      );
    }
    case COMPONENT_TYPE.upcomingExaminations: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.EXAMINATION_STACk?.NAME);
      return (
        <Section
          title="Upcoming Examinations"
          horizontalScroll={true}
          viewAction={viewAction}
          key={index}
        >
          {componentData.data?.map((upcomingExam, index) => (
            <UpcomingExamCard
              title={upcomingExam.eventtopic}
              date={getDate(upcomingExam.eventdate)}
              time={getTime(upcomingExam.eventtime)}
              key={`exams-${index}`}
              cardColor={UPCOMING_EXAM_CARD_COLORS[index % 2]}
            />
          ))}
        </Section>
      );
    }
    case COMPONENT_TYPE.noticeBoard: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.NOTICE_BOARD_STACK?.NAME);
      return (
        <Section
          title="Notice Board"
          horizontalScroll={true}
          viewAction={componentData.data.length > 2 ? viewAction : null}
          key={index}
        >
          {componentData.data?.map((notice, index) => (
            <NoticeCard
              title={notice.topicheading}
              descripton={notice.topicbody}
              date={getDate(notice.createddate)}
              time={getTime(notice.createdtime)}
              key={`notice-card-${index}`}
              cardColor={NOTICE_CARD_COLORS[index % 2]}
            />
          ))}
        </Section>
      );
    }
    case COMPONENT_TYPE.circular: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.CIRCULAR_STACK?.NAME);
      return (
        <Section
          title="Circular"
          horizontalScroll={true}
          viewAction={componentData.data.length > 2 ? viewAction : null}
          key={index}
        >
          {componentData.data?.map((circular, index) => (
            <CircularCard
              title={circular.title}
              description={circular.description}
              date={getDate(circular.createddate)}
              time={getTime(circular.createdtime)}
              attachmentLink={circular.filepaths?.[0]}
              key={`circular-${index}`}
              backgroundColor={CIRCULAR_CARD_COLORS[index % 2]}
            />
          ))}
        </Section>
      );
    }
    case COMPONENT_TYPE.assignment: {
      const viewAction = () => navigation.navigate(AppConfig.SCREEN.ASSIGNMENT);
      return (
        <Section
          title="Assignment"
          horizontalScroll={true}
          viewAction={componentData.data.length > 2 ? viewAction : null}
          key={index}
        >
          {componentData.data?.map((assignment, index) => (
            <DashboardAssignmentCard
              title={assignment.assignmenttopic}
              description={assignment.assignmentdescription}
              date={getDate(assignment.createddate)}
              time={getTime(assignment.createdtime)}
              attachmentLink={assignment.filepaths?.[0]}
              dueDate={getDate(assignment.submissiondate)}
              key={`assignments-${index}`}
              backgroundColor={ASSIGNMENT_CARD_COLORS[index % 2]}
            />
          ))}
        </Section>
      );
    }
    case COMPONENT_TYPE.recentNotification: {
      const viewAction = () =>
        navigation.navigate(AppConfig.SCREEN.COMMUNICATON);

      // const [selectedCard, setSelectedCard] = useState(-1);
      return (
        <Section
          title="Recent Notification"
          viewAction={componentData.data.length > 2 ? viewAction : null}
          key={index}
        >
          {componentData.data?.map((recentNotification, index) => (
            <>
              {/* <CommunicationCard
                title={recentNotification.description}
                descripton={recentNotification.topicbody}
                date={getDate(recentNotification.createdondate)}
                time={getTime(recentNotification.createdontime)}
                postedBy={recentNotification.sentbyname}
                isVoiceMessage={
                  recentNotification.typ === 'Voice' ||
                  recentNotification.content
                }
                voiceMessageUrl={recentNotification.content}
                videoSec={recentNotification.duration}
                checkRead="true"
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                setSelectedCardEmergency={setSelectedCardEmergency}
                cardIndex={index}
                key={`notification-${index}`}
              /> */}
              <CommonCard
                title={recentNotification.description}
                date={getDate(recentNotification.createdondate)}
                time={getTime(recentNotification.createdontime)}
                sentbyname={recentNotification.sentbyname}
                content={recentNotification.content}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                cardIndex={index}
                noMarking={true}
                isVoiceMessage={recentNotification.typ === 'Voice'}
                rowView={
                  recentNotification.typ === 'Voice' && selectedCard !== index
                }
                rowViewText="Play Voice"
                onPressRowView={() => toggleCheck(index, selectedCard)}
                onPress={() => toggleCheck(index, selectedCard)}
                CommunicationPage
                CardContainerStyle={{ marginHorizontal: -2, padding: 0 }}
                key={`notification-${index}`}
              />
              <View
                style={
                  index < componentData.data.length - 1
                    ? { marginBottom: 12 }
                    : null
                }
              />
            </>
          ))}
        </Section>
      );
    }

    //   case COMPONENT_TYPE.studentChat: {
    //     return (
    //       <Section title="Student" >

    //           <>
    //             <DashboardComponent
    //             // title={DashboardDummyData.data.data.title}
    //             // studentName={DashboardDummyData.data.data.studentName}
    //             // date={DashboardDummyData.data.data.date}
    //             // time={DashboardDummyData.data.data.date}

    //             />
    //             <View style={!index ? { marginBottom: 12 } : null} />
    //           </>

    //       </Section>
    //     );
    //   }
  }
};
