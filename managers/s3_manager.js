import AWS from 'aws-sdk';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
const AWS_S3_BUCKET = 'shjp-youth';

const S3_RESULT = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

export async function upload({ key, contentType, content }) {
  AWS.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3();
  const body = content;
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: body,
    ACL: 'public-read',
    ContentType: contentType,
    ContentEncoding: 'base64',
  };
  console.log('params = ', params);
  console.log('body = ', body);

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('Uploaded to S3: ', JSON.stringify(data));
      resolve({
        result: S3_RESULT.SUCCESS,
        url: data.Location,
      });
    });
  });
}
