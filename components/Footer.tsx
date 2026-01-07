'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromStrapi } from "@/lib/strapi";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./FooterIcons";

interface Author {
  name?: string;
  contact?: string;
  mail?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export default function Footer() {
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const authorRes = await fetchFromStrapi("/authors?pagination[pageSize]=1");
        setAuthor(authorRes?.data?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch author:", error);
      }
    };

    fetchAuthor();
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        {/* About */}
        <div className="footer-brand">
          <img
            src="/logoJPG.jpg"
            alt="Visaka News"
            className="footer-logo"
          />
          <p>
            Trusted source for latest news, politics, movies and regional updates.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <strong>Quick Links</strong>
          <ul>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/profiles">Profiles</Link></li>
            <li><Link href="/videos">Videos</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <strong>Contact</strong>

          {author?.name && <p>{author.name}</p>}
          {author?.contact && <p>📞 +91 {author.contact}</p>}
          {author?.mail && <p>✉️ {author.mail}</p>}

          {/* Social Icons */}
          <div className="footer-social">
            {author?.facebook && (
              <a href={author.facebook} target="_blank" aria-label="Facebook">
                <FacebookIcon />
              </a>
            )}

            {author?.twitter && (
              <a href={author.twitter} target="_blank" aria-label="Twitter">
                <TwitterIcon />
              </a>
            )}

            {author?.linkedin && (
              <a href={author.linkedin} target="_blank" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
            )}

            {author?.youtube && (
              <a href={author.youtube} target="_blank" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} VisakaNews. All rights reserved.
      </div>
    </footer>
  );
}
