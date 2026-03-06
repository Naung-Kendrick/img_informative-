import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetCommentsByNewsIdQuery, useAddCommentMutation, type Comment } from "../store/commentsApiSlice";
import type { RootState } from "../store";
import { useTranslation } from "react-i18next";
import { Loader2, Send, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

export default function Comments({ newsId }: { newsId: string }) {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { data: comments, isLoading } = useGetCommentsByNewsIdQuery(newsId);
    const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await addComment({ newsId, content }).unwrap();
            setContent("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            alert(t("comments.error"));
        }
    };

    return (
        <div className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-slate-50 rounded-lg text-[#808080]">
                    <MessageSquare size={20} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 padauk-bold">
                    {t("comments.title")} {comments && !isLoading && `(${comments.length})`}
                </h3>
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
                    <div className="flex gap-4 flex-col sm:flex-row">
                        <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className="text-slate-400" />
                                )}
                            </div>
                            <span className="text-sm font-bold text-slate-700 sm:mt-2 padauk-bold text-center w-full truncate">{user?.name}</span>
                        </div>

                        <div className="flex-1 space-y-3">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={t("comments.placeholder")}
                                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular min-h-[120px] resize-y shadow-inner"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className="px-8 py-3 bg-[#808080] text-white font-bold rounded-xl hover:bg-[#555555] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg shadow-[#808080]/20 padauk-bold active:scale-95"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    {t("comments.submit")}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-10 bg-gradient-to-br from-slate-50 to-slate-50/20 p-8 rounded-3xl border border-dashed border-slate-200 text-center padauk-regular shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#808080] mb-4 shadow-sm">
                        <MessageSquare size={32} />
                    </div>
                    <p className="text-slate-600 mb-6 font-medium text-lg">{t("comments.loginRequiredTitle")}</p>
                    <Link to="/login" className="inline-flex items-center justify-center px-10 py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all padauk-bold shadow-lg hover:-translate-y-1 active:scale-95 duration-300">
                        {t("comments.login")}
                    </Link>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-3" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments && comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment: Comment) => (
                        <div key={comment._id} className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#808080]/10 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-3 sm:block shrink-0">
                                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm transition-transform hover:scale-105">
                                    {comment.author?.avatar ? (
                                        <img src={comment.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} className="text-slate-400" />
                                    )}
                                </div>
                                <div className="sm:hidden flex flex-col">
                                    <span className="font-bold text-slate-900 padauk-bold text-base">{comment.author?.name || t("comments.anonymous")}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(comment.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="hidden sm:flex items-center gap-3 mb-3">
                                    <span className="font-bold text-slate-900 padauk-bold text-xl">{comment.author?.name || t("comments.anonymous")}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(comment.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>

                                    {comment.author?.role >= 1 && (
                                        <span className={`ml-auto px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${comment.author.role === 3 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            comment.author.role === 2 ? 'bg-slate-50 text-slate-600 border-slate-100' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {comment.author.role === 3 ? t("comments.roleRootAdmin") : comment.author.role === 2 ? t("comments.roleAdmin") : t("comments.roleStaff")}
                                        </span>
                                    )}
                                </div>
                                <div className="text-slate-700 padauk-regular whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-100/50 group">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 text-slate-400 padauk-regular">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-lg">{t("comments.noComments")}</p>
                </div>
            )}
        </div>
    );
}

