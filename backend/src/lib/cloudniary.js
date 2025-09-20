import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

const isCloudConfigured = Boolean(
    process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_SECRET_KEY
);

if (isCloudConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_SECRET_KEY,
    });
} else {
    console.warn("Cloudinary not configured — falling back to storing data URLs. Set CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY in .env for uploads.");
}

// uploadMedia handles either real Cloudinary uploads or a dev fallback that returns the
// provided data URL (so the app can still function without API keys).
export async function uploadMedia(file, options = {}) {
    if (isCloudConfigured) {
        return cloudinary.uploader.upload(file, options);
    }

    // Fallback: the `file` is expected to be a data URL already (frontend sends base64). Return a
    // shape similar to Cloudinary's upload response so caller can use secure_url and resource_type.
    const resource_type = file.startsWith("data:video") ? "video" : file.startsWith("data:image") ? "image" : "raw";
    return {
        secure_url: file,
        resource_type,
    };
}

export default cloudinary;