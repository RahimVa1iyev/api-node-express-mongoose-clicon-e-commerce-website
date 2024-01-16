const cloudinary = require('cloudinary').v2

const upload = async (image) =>{
    const maxSize = 2 * 1024 * 1024

    if (!image.mimetype.startsWith('image')) {
        throw new BadRequestError('Only image upload');
    }

    if (image.size > maxSize) {
        throw new BadRequestError('Please upload images smaller than 2MB');
    }

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: 'clicon',
    });

    return result
}

module.exports = upload