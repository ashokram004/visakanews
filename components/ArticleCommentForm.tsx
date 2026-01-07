"use client";

import { useState } from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type Comment = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Props = {
  articleId: number;
  onCommentAdded?: (comment: Comment) => void;
};

export default function ArticleCommentForm({ articleId, onCommentAdded }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(STRAPI_URL + "/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name,
          email,
          message,
          article: articleId,
          isApproved: true,
        },
      }),
    });
  
    const json = await res.json();
    console.log("Comment API response:", json);
  
    if (!res.ok) {
      alert("Failed to post comment");
      setLoading(false);
      return;
    }
  
    // Create the new comment object using the submitted data
    const newComment = {
      id: Date.now(), // Temporary ID until page refresh
      name,
      message,
      createdAt: new Date().toISOString(),
    };

    if (onCommentAdded) {
      onCommentAdded(newComment);
    }

    // Revalidate the cache for this article page
    const slug = window.location.pathname.split('/').pop();
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: `/news/${slug}` }),
    });

    setShowSuccess(true);
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  }
  

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Leave a comment</h3>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />

      <textarea
        placeholder="Your comment"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <div className="comment-form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Comment"}
        </button>

        {showSuccess && (
          <div className="popup success-popup">
            <p>Comment posted successfully!</p>
          </div>
        )}

        {showFailure && (
          <div className="popup failure-popup">
            <p>{failureMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}
