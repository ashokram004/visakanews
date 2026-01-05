export function toEmbedUrl(url: string): string {
    if (!url) return "";
  
    // Already an embed URL
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
  
    // youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  
    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  
    // fallback (return original)
    return url;
  }
  