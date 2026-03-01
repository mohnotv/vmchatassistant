import { useState } from 'react';
import './GeneratedImage.css';

export default function GeneratedImage({ imageData }) {
  const [enlarged, setEnlarged] = useState(false);

  if (!imageData) return null;

  const handleDownload = () => {
    // If we have a base64 image, download it
    if (imageData.imageData) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${imageData.imageData}`;
      link.download = `generated_image_${Date.now()}.png`;
      link.click();
    } else if (imageData.imageUrl) {
      // If we have a URL, download from URL
      fetch(imageData.imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `generated_image_${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  };

  // For now, show placeholder since actual image generation needs API integration
  const imageSrc = imageData.imageData 
    ? `data:image/png;base64,${imageData.imageData}`
    : imageData.imageUrl || null;

  return (
    <>
      <div className="generated-image-container">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={imageData.prompt || 'Generated image'} 
            className="generated-image"
            onClick={() => setEnlarged(true)}
          />
        ) : (
          <div className="generated-image-placeholder">
            <p>Image generation in progress...</p>
            <p className="generated-image-prompt">{imageData.prompt}</p>
          </div>
        )}
        <div className="generated-image-actions">
          {imageSrc && (
            <>
              <button className="generated-image-btn" onClick={() => setEnlarged(true)}>
                🔍 Enlarge
              </button>
              <button className="generated-image-btn" onClick={handleDownload}>
                ⬇️ Download
              </button>
            </>
          )}
        </div>
      </div>

      {enlarged && imageSrc && (
        <div className="generated-image-overlay" onClick={() => setEnlarged(false)}>
          <div className="generated-image-enlarged" onClick={(e) => e.stopPropagation()}>
            <button className="generated-image-close" onClick={() => setEnlarged(false)}>×</button>
            <img src={imageSrc} alt={imageData.prompt} className="generated-image-full" />
            {imageData.prompt && (
              <p className="generated-image-prompt-text">{imageData.prompt}</p>
            )}
            <button className="generated-image-download-btn" onClick={handleDownload}>
              Download Image
            </button>
          </div>
        </div>
      )}
    </>
  );
}
