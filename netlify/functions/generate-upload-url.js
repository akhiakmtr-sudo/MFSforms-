// IMPORTANT: This file uses CommonJS `require` because Netlify Functions often default to a Node.js environment
// that supports this syntax out-of-the-box without extra build configuration.
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require('crypto');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const {
        CLOUDFLARE_ACCOUNT_ID,
        R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME,
    } = process.env;

    if (!CLOUDFLARE_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
        return { statusCode: 500, body: 'Cloudflare R2 environment variables not configured correctly on Netlify.' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { filename, contentType } = body;

        if (!filename || !contentType) {
            return { statusCode: 400, body: 'Missing filename or contentType in request body.' };
        }

        const R2 = new S3Client({
            region: "auto",
            endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        });

        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const key = `uploads/${randomUUID()}-${sanitizedFilename}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        // The URL will be valid for 5 minutes (300 seconds)
        const url = await getSignedUrl(R2, command, { expiresIn: 300 });

        return {
            statusCode: 200,
            body: JSON.stringify({ url, key }),
        };
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        return { statusCode: 500, body: 'Internal Server Error generating upload URL.' };
    }
};
