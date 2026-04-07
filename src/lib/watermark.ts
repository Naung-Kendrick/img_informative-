/**
 * Adds a top-right logo watermark to an image file.
 * Returns a new File object with the watermarked image.
 */
export async function addWatermarkToImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const logo = new Image();
        logo.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Set canvas dimensions to image dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // 1. Draw original image
          ctx.drawImage(img, 0, 0);

          // 2. Draw Logo in Top-Right
          // Scale logo size relative to image width (e.g., 9% of image width - smaller as requested)
          const logoWidth = img.width * 0.13;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          const padding = img.width * 0.025; // 2.5% padding

          const logoX = img.width - logoWidth - padding;
          const logoY = padding;

          ctx.save();
          // Add a subtle drop shadow to logo for visibility on any background
          ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
          ctx.restore();

          // Convert canvas back to file
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const watermarkedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(watermarkedFile);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            },
            file.type,
            0.92 // High quality
          );
        };
        logo.onerror = () => {
          // If logo fails, resolve with the original image
          console.error("Logo loading failed, returning original image.");
          resolve(file);
        };
        logo.src = "/photo_2026-03-09_14-35-44-removebg-preview.png";
      };
      img.onerror = () => reject(new Error("Image loading failed"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
}
