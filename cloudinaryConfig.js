const cloudinary = require('cloudinary').v2;

// ตั้งค่าการเชื่อมต่อกับบัญชี Cloudinary 
cloudinary.config({
    cloud_name: 'dyw5iyaii',
    api_key: '996258689628256',
    api_secret: '5KWUc9KVn4FRt7oAwLDiEvT3bng'
});

module.exports = cloudinary;