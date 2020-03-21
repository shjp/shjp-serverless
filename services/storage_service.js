import * as s3Manager from '../managers/s3_manager';

export async function uploadImageFile({ entityType, relation, contentType, imageExtension, file }) {
  // Use upload time for file name
  const filename = `${new Date().toISOString()}.${imageExtension}`;
  const key = `${entityType}/${relation}/${filename}`;
  return await s3Manager.upload({
    key,
    contentType,
    content: file,
  });
}

export async function uploadMassFile({ name, date, contentType, fileExtension, file }) {
  const filename = `${date}_${name}.${fileExtension}`;
  const key = `mass/${filename}`;
  return await s3Manager.upload({
    key,
    contentType,
    content: file,
  });
}
