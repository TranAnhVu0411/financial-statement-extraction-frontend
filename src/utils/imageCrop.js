export const cropImageURL = (src, crop) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.src = src;
        image.crossOrigin="anonymous"
        image.onload = () => {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            const pixelRatio = window.devicePixelRatio;
            canvas.width = crop.width * pixelRatio;
            canvas.height = crop.height * pixelRatio;
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            );

            // Converting to base64
            canvas.toBlob((blob) => {
                // Tạo Blob URL từ Blob
                const croppedImageUrl = URL.createObjectURL(blob);

                // Sử dụng Blob URL của phần ảnh cắt tại đây (ví dụ: gán vào state, in ra console, ...)
                resolve(croppedImageUrl);
            });
        }
        image.onerror = (error) => {
            reject(error);
          };
        }
    );
};