const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const crypto = require('crypto');

// cloudinary.config({
// 	cloud_name: 'elselly',
// 	api_key: '549562546544323',
// 	api_secret: 'blNBwf7gQVPvt8LdgSN02BbSYnc',
// 	secure: true
// });

cloudinary.config({
	cloud_name: 'dsa0uaq9r',
	api_key: '845686327439385',
	api_secret: 'EwMsQ66hH3P3jbV-2g63fyl9coo',
	secure: true
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'IRCBloq-devices',
		allowedFormates: ['jpeg', 'jpg', 'png'],
		public_id: function(req, file){
			let buf = crypto.randomBytes(16);
			buf = buf.toString('hex');
			let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
			uniqFileName += buf;
		}
	},
});


module.exports = {
	cloudinary,
	storage
}