"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Comment, CommentReply } from "@/lib/types";
import { createClient } from "@/lib/supabase-browser";

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

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff&size=80`;
}

function ReplyItem({ reply }: { reply: CommentReply }) {
  return (
    <div className="flex gap-3 mt-3 pl-4 border-l-2 border-gray-100">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0">
        <Image src={reply.authorAvatar} alt={reply.authorName} width={28} height={28} className="object-cover" unoptimized />
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

function CommentItem({
  comment,
  currentUserName,
  currentUserAvatar,
}: {
  comment: Comment;
  currentUserName: string;
  currentUserAvatar: string;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<CommentReply[]>(comment.replies);
  const [submitting, setSubmitting] = useState(false);

  const submitReply = async () => {
    const text = replyText.trim();
    if (!text || submitting) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("comment_replies")
      .insert({
        comment_id: comment.id,
        author_name: currentUserName,
        author_avatar: currentUserAvatar,
        text,
      })
      .select()
      .single();

    setSubmitting(false);
    if (error || !data) return;

    setReplies((prev) => [
      ...prev,
      {
        id: data.id,
        authorName: data.author_name,
        authorAvatar: data.author_avatar,
        text: data.text,
        createdAt: data.created_at,
      },
    ]);
    setReplyText("");
    setReplyOpen(false);
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <Image src={comment.authorAvatar} alt={comment.authorName} width={36} height={36} className="object-cover" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-900">{comment.authorName}</span>
            <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{comment.text}</p>
          {currentUserName && (
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              {replyOpen ? "Cancel" : "Reply"}
            </button>
          )}

          {replies.map((r) => <ReplyItem key={r.id} reply={r} />)}

          {replyOpen && (
            <div className="mt-3 flex gap-2 pl-4 border-l-2 border-blue-200">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitReply(); } }}
                placeholder="Write a reply…"
                maxLength={500}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim() || submitting}
                className="px-3 py-2 bg-blue-700 text-white text-xs font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "…" : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentsSection({ listingId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("sellers")
        .select("name, avatar")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setCurrentUserName(data.name);
            setCurrentUserAvatar(data.avatar || avatarUrl(data.name));
          }
        });
    });
  }, []);

  const submitComment = async () => {
    const text = newComment.trim();
    if (!text || submitting || !currentUserName) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({
        listing_id: listingId,
        author_name: currentUserName,
        author_avatar: currentUserAvatar,
        text,
      })
      .select()
      .single();

    setSubmitting(false);
    if (error || !data) return;

    setComments((prev) => [
      ...prev,
      {
        id: data.id,
        listingId: data.listing_id,
        authorName: data.author_name,
        authorAvatar: data.author_avatar,
        text: data.text,
        createdAt: data.created_at,
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

      {currentUserName ? (
        <div className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
            <Image src={currentUserAvatar} alt={currentUserName} width={36} height={36} className="object-cover" unoptimized />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask a question or leave a comment…"
              rows={2}
              maxLength={500}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{newComment.length}/500</span>
              <button
                onClick={submitComment}
                disabled={!newComment.trim() || submitting}
                className="px-4 py-1.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {submitting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <a href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">Log in</a> to leave a comment.
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserName={currentUserName}
              currentUserAvatar={currentUserAvatar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
