import busboy from 'busboy';

import * as storageService from '../services/storage_service';
import { extractContentTypeFromImageBase64, sendResponse } from './utils';

export async function handler(event, context) {
  console.log('event: ', event);
  console.log('context: ', context);

  const payload = await parse(event);
  console.log('payload: ', payload);

  const result = await storageService.uploadImageFile(payload);
  console.log('result = ', result);

  return sendResponse(200, result);
}

function parse(event) {
  const contentType = event.headers['Content-Type'] || event.headers['content-type'];
  const result = {};

  return new Promise((resolve, reject) => {
    if (contentType.indexOf('application/json') > -1) {
      result.fields = JSON.parse(event.body);
      return resolve(result);
    }

    const bb = new busboy({
      headers: { 'content-type': contentType },
      limits: {
        fileSize: 31457280, // 30 megabytes
        files: 10, // limit to 10 files
      },
    });

    bb.on('field', (fieldname, val) => {
      // We're taking file data as base64 since netlify-lambda doesn't support properly
      // parsing file stream nor configuring API Gateway
      if (fieldname === 'file') {
        const { contentType, imageExtension } = extractContentTypeFromImageBase64(val);
        result.contentType = contentType;
        result.imageExtension = imageExtension;

        // Convert Base64 encoding to blob
        result.file = new Buffer(val.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        return;
      }
      result[fieldname] = val;
    });
    bb.on('finish', () => {
      resolve(result);
    });
    bb.on('error', err => {
      console.error('error parsing multipart/form-data body ', err);
      reject('Form data is invalid: parsing error');
    });

    bb.write(event.body);
    bb.end();
  });
}
