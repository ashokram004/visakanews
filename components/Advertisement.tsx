import Link from "next/link";
import Image from "next/image";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type Ad = {
  id: number;
  title: string;
  image: {
    url: string;
    alternativeText?: string;
  };
  link?: string;
};

type Props = {
  ads: Ad[];
  className?: string;
};

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http") ? url : STRAPI_URL + url;
}

export default function Advertisement({ ads, className = "" }: Props) {
  if (!ads || ads.length === 0) {
    const placeholderText = className.includes("header-ad") ? "Header Advertisement" : "Advertisement";
    return <div className={className}>{placeholderText}</div>;
  }

  return (
    <div className={`advertisement ${className}`}>
      {ads.map((ad) => (
        <div key={ad.id} className="ad-item">
          {ad.link ? (
            <Link href={ad.link} target="_blank" rel="noopener noreferrer">
              <div className="ad-media">
                <Image
                  src={getImageUrl(ad.image.url) || ""}
                  alt={ad.image.alternativeText || ad.title}
                  fill
                  className="ad-image fill"
                />
              </div>
            </Link>
          ) : (
            <div className="ad-media">
              <Image
                src={getImageUrl(ad.image.url) || ""}
                alt={ad.image.alternativeText || ad.title}
                fill
                className="ad-image cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
