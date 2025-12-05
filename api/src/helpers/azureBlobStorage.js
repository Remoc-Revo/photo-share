const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString || !containerName) {
  throw new Error('Azure Storage connection string or container name is not configured. Please check your .env file.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const setupContainer = async () => {
    try {
        const createContainerResponse = await containerClient.createIfNotExists({
            access: 'blob' // public access for blobs
        });
        if (createContainerResponse.succeeded) {
            console.log(`Container '${containerName}' was created successfully.`);
        } else {
            console.log(`Container '${containerName}' already exists.`);
        }
    } catch (error) {
        console.error(`Error creating container: ${error.message}`);
    }
};


const uploadBlob = async (blobName, buffer, size) => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, size);
  return blockBlobClient.url;
};

const deleteBlob = async (blobName) => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};

module.exports = {
  uploadBlob,
  deleteBlob,
  setupContainer,
  containerClient
};
