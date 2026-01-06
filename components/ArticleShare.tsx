"use client";

import {
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaLink,
} from "react-icons/fa";

type Props = {
  url: string;
};

export default function ArticleShare({ url }: Props) {
  return (
    <div className="article-share">
      <span className="share-label">Share</span>

      <div className="share-icons">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(url)}`}
          target="_blank"
          aria-label="WhatsApp"
          className="share-btn whatsapp"
        >
          <FaWhatsapp />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          target="_blank"
          aria-label="Twitter"
          className="share-btn twitter"
        >
          <FaTwitter />
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          aria-label="Facebook"
          className="share-btn facebook"
        >
          <FaFacebookF />
        </a>

        <button
          className="share-btn link"
          aria-label="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(url);
            alert("Link copied!");
          }}
        >
          <FaLink />
        </button>
      </div>
    </div>
  );
}
