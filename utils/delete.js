const extractPublicId = (imageUrl) => {
    // Örnek URL: "https://res.cloudinary.com/your-cloud-name/image/upload/publicId.jpg"
    const parts = imageUrl.split('/');
    const publicIdWithExtension = parts[parts.length - 1]; // "publicId.jpg"
    const publicId = publicIdWithExtension.split('.')[0]; // "publicId"
    return publicId;
};

const deleteImage = async (imageUrl) => {
    try {
        const publicId = extractPublicId(imageUrl);

        // Cloudinary'den resmi sil
        await cloudinary.uploader.destroy(publicId);

        console.log(`Resim başarıyla silindi. Public ID: ${publicId}`);
    } catch (error) {
        console.error('Resim silme hatası:', error);
        throw new Error('Resim silme hatası');
    }
};
module.exports = deleteImage