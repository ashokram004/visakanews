import { fetchFromStrapi } from "../../../lib/strapi";
import { toMapEmbedUrl } from "../../../lib/video";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProfileContactPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  const { mobileNo, address, location, mailId } = profile;

  // If no contact info exists, show a message
  if (!mobileNo && !address && !location && !mailId) {
    return (
      <section className="profile-contact">
        <p>No contact information available.</p>
      </section>
    );
  }

  return (
    <section className="profile-contact" style={{ padding: '20px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Mobile Number */}
      {mobileNo && (
        <div className="contact-item">
          <span className="contact-icon">📱</span>
          <div className="contact-details">
            <strong>Mobile</strong>
            <a href={`tel:${mobileNo}`}>{mobileNo}</a>
          </div>
        </div>
      )}

      {/* Email */}
      {mailId && (
        <div className="contact-item">
          <span className="contact-icon">✉️</span>
          <div className="contact-details">
            <strong>Email</strong>
            <a href={`mailto:${mailId}`}>{mailId}</a>
          </div>
        </div>
      )}

      {/* Address */}
      {address && (
        <div className="contact-item">
          <span className="contact-icon">📍</span>
          <div className="contact-details">
            <strong>Address</strong>
            <p>{address}</p>
          </div>
        </div>
      )}

      {/* Location/Map */}
      {location && (
        <div className="contact-item">
          <span className="contact-icon">🗺️</span>
          <div className="contact-details">
            <strong>Location</strong>
            <div className="contact-map">
              <iframe
                src={toMapEmbedUrl(location)}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

