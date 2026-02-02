'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromStrapi } from "@/lib/strapi";

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
        {/* Contact */}
        <div className="footer-contact">
          <p>Editor: Sanapala Jeevan Kumar</p>
          <p>visakanews@gmail.com</p>
          <p>8247829025</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} VisakaNews. All rights reserved.
      </div>
    </footer>
  );
}
