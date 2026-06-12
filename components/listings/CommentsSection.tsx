"use client";

import { useState } from "react";
import Image from "next/image";
import { Comment, CommentReply } from "@/lib/types";

interface CommentsSectionProps {
  listingId: string;
  initialComments: Comment[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ReplyItem({ reply }: { reply: CommentReply }) {
  return (
    <div className="flex gap-3 mt-3 pl-4 border-l-2 border-gray-100">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
        <Image src={reply.authorAvatar} alt={reply.authorName} width={28} height={28} className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gray-900">{reply.authorName}</span>
          <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{reply.text}</p>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<CommentReply[]>(comment.replies);

  const submitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    setReplies((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        authorName: "You",
        authorAvatar: "https://i.pravatar.cc/80?img=11",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setReplyText("");
    setReplyOpen(false);
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src={comment.authorAvatar} alt={comment.authorName} width={36} height={36} className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-900">{comment.authorName}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{comment.text}</p>
          <button
            onClick={() => setReplyOpen(!replyOpen)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            {replyOpen ? "Cancel" : "Reply"}
          </button>

          {/* Replies */}
          {replies.map((r) => <ReplyItem key={r.id} reply={r} />)}

          {/* Reply input */}
          {replyOpen && (
            <div className="mt-3 flex gap-2 pl-4 border-l-2 border-blue-200">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitReply(); } }}
                placeholder="Write a reply…"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="px-3 py-2 bg-blue-700 text-white text-xs font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentsSection({ listingId: _listingId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const submitComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        listingId: _listingId,
        authorName: "You",
        authorAvatar: "https://i.pravatar.cc/80?img=11",
        text,
        createdAt: new Date().toISOString(),
        replies: [],
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-display font-semibold text-base text-gray-900 mb-1">
        Comments
        <span className="ml-2 text-sm font-normal text-gray-400">({comments.length})</span>
      </h2>
      <p className="text-xs text-gray-400 mb-5">Ask questions or leave feedback — visible to everyone.</p>

      {/* New comment input */}
      <div className="flex gap-3 mb-6">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src="https://i.pravatar.cc/80?img=11" alt="You" width={36} height={36} className="object-cover" />
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question or leave a comment…"
            rows={2}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submitComment}
              disabled={!newComment.trim()}
              className="px-4 py-1.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((c) => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}
    </div>
  );
}
