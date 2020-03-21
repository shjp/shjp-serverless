import * as s3Manager from '../managers/s3_manager';

export async function uploadImageFile({
  entityType,
  entityId,
  relation,
  contentType,
  imageExtension,
  file,
}) {
  // Use upload time for file name
  const filename = `${new Date().toISOString()}.${imageExtension}`;
  const key = `${entityType}/${entityId}/${relation}/${filename}`;
  return await s3Manager.upload({
    key,
    contentType,
    content: file,
  });
}
