"use client";

import { useState } from "react";
import {
  FaWhatsapp,
  FaXTwitter ,
  FaFacebookF,
  FaLink,
  FaShare,
  FaEnvelope,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaTelegram
} from "react-icons/fa6";

type Props = {
  url: string;
};

export default function ArticleShare({ url }: Props) {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div className="article-share">
      <button
        className="share-toggle"
        onClick={() => setShowIcons(!showIcons)}
        aria-label="Share"
      >
        <FaShare />
        <span>Share</span>
      </button>

      {showIcons && (
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
            href={`https://x.com/intent/tweet?url=${url}`}
            target="_blank"
            aria-label="X"
            className="share-btn twitter"
          >
            <FaXTwitter />
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            aria-label="Facebook"
            className="share-btn facebook"
          >
            <FaFacebookF />
          </a>

          <a
            href={`mailto:?subject=Check this out&body=${encodeURIComponent(url)}`}
            target="_blank"
            aria-label="Email"
            className="share-btn email"
          >
            <FaEnvelope />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
            target="_blank"
            aria-label="LinkedIn"
            className="share-btn linkedin"
          >
            <FaLinkedinIn />
          </a>

          <a
            href={`https://pinterest.com/pin/create/button/?url=${url}`}
            target="_blank"
            aria-label="Pinterest"
            className="share-btn pinterest"
          >
            <FaPinterestP />
          </a>

          <a
            href={`https://reddit.com/submit?url=${url}`}
            target="_blank"
            aria-label="Reddit"
            className="share-btn reddit"
          >
            <FaRedditAlien />
          </a>

          <a
            href={`https://t.me/share/url?url=${url}`}
            target="_blank"
            aria-label="Telegram"
            className="share-btn telegram"
          >
            <FaTelegram />
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
      )}
    </div>
  );
}
