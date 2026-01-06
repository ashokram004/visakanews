"use client";

type Comment = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Props = {
  comments: Comment[];
};

export default function ArticleComments({ comments }: Props) {
  return (
    <section className="article-comments">
        <h3 className="comments-title">
            Comments ({comments.length})
        </h3>

        {comments.length === 0 && (
            <p className="no-comments">Be the first to comment</p>
        )}

        <ul className="comments-list">
            {comments.map((c) => (
            <li key={c.id} className="comment-card">
                <div className="comment-header">
                <strong className="comment-author">{c.name}</strong>
                <span className="comment-date">
                    {new Date(c.createdAt).toLocaleString()}
                </span>
                </div>

                <p className="comment-message">{c.message}</p>
            </li>
            ))}
        </ul>
    </section>

  );
}
