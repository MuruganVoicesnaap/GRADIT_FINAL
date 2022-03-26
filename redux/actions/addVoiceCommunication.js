import triggerSimpleAjax from '../../context/Helper/httpHelper';
import AppConfig from '../app-config';

const {API_URL, API} = AppConfig;

export const addVoiceCommunication = ({
  request = {},
  voiceFile = '',
  fileDuration,
  isEntireCollege = true,
}) => {
  const fileName = voiceFile ? voiceFile.split('/').slice(-1).pop() : '';
  const [mm, sec, ms] = fileDuration.split(':');
  const secs = Math.floor(
    parseInt(mm, 10) * 60 + parseInt(sec, 10) + parseInt(ms, 10) * 0.001,
  );
  const url = isEntireCollege
    ? API.ADD_VOICE_COMMUNICATION_ENTIRE_COLLEGE
    : API.ADD_VOICE_COMMUNICATION_PARTICULAR;
  const req = {
    file: {
      uri: voiceFile,
      // Platform.OS === 'android'
      //   ? voiceFile
      //   : voiceFile.replace('file://', ''),
      name: fileName,
      type: `audio/x-${fileName.split('.').slice(-1).pop()}`,
    },
    '': JSON.stringify({
      ...request, // {collegeid,staffid,callerType,isparent, isstudent, isEmergency, Isemergencyvoice}
      filetype: voiceFile ? 1 : 0,
      fileduration: voiceFile ? secs : 0,
    }),
  };

  console.log('VoiceRequest',req)
  console.log('VoiceRequest123',request)

  return new Promise((resolve, reject) =>
    triggerSimpleAjax(
      `${API_URL}${url}`,
      'POST',
      true,
      req,
      result => {
        resolve(result);
      },
      result => {
        reject(result);
      },
      {
        'Content-Type': 'multipart/form-data',
      },
    ),
  );
};

// ADD_VOICE_COMMUNICATION_PARTICULAR
