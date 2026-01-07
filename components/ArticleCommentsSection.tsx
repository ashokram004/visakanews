"use client";

import { useState } from "react";
import ArticleComments from "./ArticleComments";
import ArticleCommentForm from "./ArticleCommentForm";

type Comment = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Props = {
  initialComments: Comment[];
  articleId: number;
};

export default function ArticleCommentsSection({ initialComments, articleId }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentAdded = (newComment: Comment) => {
    setComments([newComment, ...comments]);
  };

  return (
    <>
      <ArticleCommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
      <ArticleComments comments={comments} />
    </>
  );
}
