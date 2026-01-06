"use client";

import { useState } from "react";

type Props = {
  articleId: number;
};

export default function ArticleCommentForm({ articleId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:1337/api/comments", {
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
  
    alert("Comment submitted!");
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
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

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
