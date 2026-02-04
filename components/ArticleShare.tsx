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
  documentId: string;
  currentShares: number;
};

export default function ArticleShare({ url, documentId, currentShares }: Props) {
  const [showIcons, setShowIcons] = useState(false); 

  const handleShare = () => { 
    fetch('/api/increment-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId,
        currentShares,
        type: 'article'
      })
    }).catch(error => console.error('Failed to increment shares:', error))
  }

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
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaWhatsapp />
          </a>

          <a
            href={`https://x.com/intent/tweet?url=${url}`}
            target="_blank"
            aria-label="X"
            className="share-btn twitter"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaXTwitter />
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            aria-label="Facebook"
            className="share-btn facebook"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaFacebookF />
          </a>

          <a
            href={`mailto:?subject=Check this out&body=${encodeURIComponent(url)}`}
            target="_blank"
            aria-label="Email"
            className="share-btn email"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaEnvelope />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
            target="_blank"
            aria-label="LinkedIn"
            className="share-btn linkedin"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaLinkedinIn />
          </a>

          <a
            href={`https://pinterest.com/pin/create/button/?url=${url}`}
            target="_blank"
            aria-label="Pinterest"
            className="share-btn pinterest"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaPinterestP />
          </a>

          <a
            href={`https://reddit.com/submit?url=${url}`}
            target="_blank"
            aria-label="Reddit"
            className="share-btn reddit"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaRedditAlien />
          </a>

          <a
            href={`https://t.me/share/url?url=${url}`}
            target="_blank"
            aria-label="Telegram"
            className="share-btn telegram"
            onClick={(e) => {
              handleShare();
              // Allow the link to open
            }}
          >
            <FaTelegram />
          </a>

          <button
            className="share-btn link"
            aria-label="Copy link"
            onClick={() => {
              navigator.clipboard.writeText(url);
              alert("Link copied!");
              handleShare();
            }}
          >
            <FaLink />
          </button>
        </div>
      )}
    </div>
  );
}
