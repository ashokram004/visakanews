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
  
  export function toMapEmbedUrl(url: string): string {
    if (!url) return "";
  
    // If it's not a Google Maps URL, treat it as a place name
    if (!url.includes("google.com/maps")) {
      // It's likely a plain address/place name - use output=embed format
      return `https://www.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
    }
  
    // Already an embed URL
    if (url.includes("google.com/maps/embed")) {
      // If it's the newer pb= format that may require API key, try to extract location
      if (url.includes("pb=")) {
        try {
          const pbMatch = url.match(/!2s([^!]+)/);
          if (pbMatch) {
            const placeName = decodeURIComponent(pbMatch[1].replace(/,/g, ' ').replace(/\+/g, ' '));
            return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
          }
        } catch (e) {
          // extraction failed
        }
      }
      // Return original embed URL if we can't convert
      return url;
    }
  
    // Regular Google Maps URL - convert to embed format using output=embed
    if (url.includes("google.com/maps")) {
      // Extract place name from /place/ or /search/ URL
      const placeMatch = url.match(/\/place\/([^@\/]+)/);
      const searchMatch = url.match(/\/search\/([^@\/]+)/);
      
      let query = "";
      if (placeMatch) {
        query = placeMatch[1].replace(/\+/g, ' ');
      } else if (searchMatch) {
        query = searchMatch[1].replace(/\+/g, ' ');
      } else {
        // Try to get from query parameter
        try {
          const urlObj = new URL(url);
          query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || "";
        } catch (e) {
          query = "";
        }
      }
      
      if (query) {
        return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
      }
    }
  
    // If we couldn't convert, return a generic search embed
    return `https://www.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
  }
  