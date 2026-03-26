import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetCommentsByNewsIdQuery, useAddCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation, type Comment } from "../store/commentsApiSlice";
import type { RootState } from "../store";
import { useTranslation } from "react-i18next";
import { Loader2, MessageCircle, Trash2, Pencil, Send, Reply } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

import ConfirmDeleteModal from "./ui/ConfirmDeleteModal";
import { useModal } from "../context/ModalContext";

export default function Comments({ newsId }: { newsId: string }) {
    const { t } = useTranslation();
    const { showError } = useModal();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { data: comments, isLoading } = useGetCommentsByNewsIdQuery(newsId);
    const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [updateComment] = useUpdateCommentMutation();

    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await addComment({ newsId, content }).unwrap();
            setContent("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            showError("မအောင်မြင်ပါ", t("comments.error"));
        }
    };

    const handleDelete = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const onConfirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            await deleteComment({ commentId: commentToDelete, newsId }).unwrap();
            setIsDeleteModalOpen(false);
            setCommentToDelete(null);
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const handleUpdate = async (commentId: string) => {
        if (!editContent.trim()) return;
        try {
            await updateComment({ commentId, content: editContent, newsId }).unwrap();
            setEditingId(null);
            setEditContent("");
        } catch (err) {
            console.error("Failed to update comment:", err);
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingId(comment._id);
        setEditContent(comment.content);
    };

    const handleReply = (authorName: string) => {
        if (!isAuthenticated) {
            showError("လိုအပ်ချက်", "ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပေးပါ။");
            return;
        }
        setContent(`@${authorName} `);
        // Scroll to form
        const form = document.getElementById('comment-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Focus textarea
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 500);
    };

    return (
        <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-10">
                <div className="p-2 sm:p-2.5 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a]">
                    <MessageCircle size={22} strokeWidth={2.5} className="sm:hidden" />
                    <MessageCircle size={26} strokeWidth={2.5} className="hidden sm:block" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 padauk-bold">
                    {t("comments.title")} {comments && !isLoading && `(${comments.length})`}
                </h3>
            </div>

            {isAuthenticated ? (
                <div className="mb-8 sm:mb-14 flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-base sm:text-lg font-bold shrink-0 shadow-md">
                        {user?.avatar ? (
                            <img loading="lazy" src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
                        )}
                    </div>
                    <form id="comment-form" onSubmit={handleSubmit} className="flex-1 space-y-4">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all padauk-regular min-h-[100px] sm:min-h-[140px] resize-y shadow-sm text-slate-600 leading-relaxed text-sm sm:text-base"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="px-8 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-[#1e3a8a]/90 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                <span className="padauk-bold">{t("comments.submit")}</span>
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-10 bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
                    <p className="text-slate-600 mb-6 font-bold text-lg padauk-bold">{t("comments.loginRequiredTitle")}</p>
                    <Link to="/login" className="inline-flex items-center justify-center px-10 py-3 bg-slate-900 text-white font-bold rounded-xl transition-all padauk-bold shadow-lg active:scale-95">
                        {t("comments.login")}
                    </Link>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                            <div className="flex-1 space-y-4">
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments && comments.length > 0 ? (
                <div className="space-y-8">
                    {comments.map((comment: Comment) => (
                        <div key={comment._id} className="flex gap-3 sm:gap-4 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-base sm:text-lg font-bold shrink-0 shadow-md">
                                {comment.author?.avatar ? (
                                    <img loading="lazy" src={comment.author.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span>{comment.author?.name?.[0]?.toUpperCase() || "A"}</span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="bg-[#f0f4f9] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm border border-slate-100/50">
                                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                                        <span className="font-bold text-slate-800 text-[13px] sm:text-[15px] truncate">{comment.author?.name}</span>
                                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 ml-2 shrink-0">
                                            {new Date(comment.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })} • {new Date(comment.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>

                                    {editingId === comment._id ? (
                                        <div className="space-y-3">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-white border border-primary/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm min-h-[100px]"
                                            />
                                            <div className="flex justify-end items-center gap-6 mt-4">
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-slate-500 hover:text-slate-800 text-[13px] font-bold transition-colors"
                                                >
                                                    {t("common.cancel")}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate(comment._id)}
                                                    className="px-8 py-2.5 bg-[#1e3a8a] text-white rounded-xl text-[13px] font-bold hover:bg-primary transition-all shadow-md active:scale-95"
                                                >
                                                    {t("common.save")}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-600 text-[13px] sm:text-[14px] leading-relaxed padauk-regular whitespace-pre-wrap">
                                            {comment.content}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-3 flex items-center gap-6 px-2">
                                    <button
                                        onClick={() => handleReply(comment.author?.name || "User")}
                                        className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-primary transition-colors"
                                    >
                                        <Reply size={14} className="rotate-180" />
                                        <span className="padauk-bold">{t("comments.reply")}</span>
                                    </button>

                                    {isAuthenticated && (user?._id === comment.author?._id || user?.role === 3) && (
                                        <>
                                            {user?._id === comment.author?._id && (
                                                <button
                                                    onClick={() => startEditing(comment)}
                                                    className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                    <span className="padauk-bold">{t("comments.edit")}</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                                <span className="padauk-bold">{t("comments.delete")}</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100/50">
                    <MessageCircle size={56} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-slate-400 font-medium padauk-regular">{t("comments.noComments")}</p>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={onConfirmDelete}
                isDeleting={isDeleting}
                title={t("comments.confirmDelete") || "Are you sure you want to delete this comment?"}
            />
        </div>
    );
}

