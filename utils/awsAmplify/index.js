import Amplify, {Storage} from 'aws-amplify';
import amplifyConfig from '../../awsAmplify.config';

class AwsAmplify {
  constructor(collegeId, screenName) {
    this.collegeId = collegeId;
    this.screenName = screenName;
    this.config = amplifyConfig;
    this.amplifyInstance = null;

    this.SetS3Config();
    this.initializeAmplify();
  }

  uploadFileToAwsS3 = (filename, file) => {
    var timeStampSplits = new Date().toISOString().split('T');
    var fileKey = `${this.collegeId}/${timeStampSplits[0]}/${this.screenName}-${filename}`;
    return new Promise((resolve, reject) => {
      fetch(file.uri)
        .then(fetchResponse => {
          fetchResponse
            .blob()
            .then(blobResponse => {
              Storage.put(fileKey, blobResponse, {
                contentType: file.type,
              })
                .then(res => {
                  var url = `https://${this.config.Storage.bucket}.s3.amazonaws.com/${res.key}`;
                  resolve(url);
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  };

  SetS3Config = () => {
    Storage.configure({
      bucket: this.config.Storage.bucket,
      region: this.config.Storage.region,
      identityPoolId: this.config.Auth.identityPoolId,
      level: 'public',
      customPrefix: {
        public: '',
      },
    });
  };

  initializeAmplify = () => {
    Amplify.configure({
      Auth: {
        identityPoolId: this.config.Auth.identityPoolId,
        region: this.config.Auth.region,
      },
      Storage: {
        bucket: this.config.Storage.bucket,
        region: this.config.Storage.region,
        customPrefix: {
          public: '',
        },
      },
    });
  };

  destructAmplify = () => {
    Amplify.configure({});
  };
}

export default AwsAmplify;
