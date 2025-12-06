const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Centralized validation. The application's entry point (index.js) is responsible for loading .env.
// This module just consumes the variables.
if (!connectionString || !containerName) {
  throw new Error('Azure Storage connection string or container name is not configured. Please check your .env file.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Ensures the Azure Blob Storage container exists. If not, it creates it with public blob access.
 */
const setupContainer = async () => {
    try {
        const createContainerResponse = await containerClient.createIfNotExists({
            access: 'blob' // public access for blobs
        });
        if (createContainerResponse.succeeded) {
            console.log(`Azure Storage: Container '${containerName}' created successfully.`);
        } else {
            console.log(`Azure Storage: Container '${containerName}' already exists.`);
        }
    } catch (error) {
        console.error(`Azure Storage: Fatal error during container setup: ${error.message}`);
        // In a real production app, you might want to exit if storage isn't available.
        process.exit(1);
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
