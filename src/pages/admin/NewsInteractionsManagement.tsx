import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useGetNewsByIdQuery } from "../../store/newsApiSlice";
import { useGetCommentsByNewsIdQuery, useDeleteCommentMutation } from "../../store/commentsApiSlice";
import { ArrowLeft, Heart, MessageSquare, Loader2, AlertCircle, Clock, Trash2 } from "lucide-react";

export default function NewsInteractionsManagement() {
    const { id } = useParams<{ id: string }>();

    const {
        data: news,
        isLoading: newsLoading,
        isError: newsError
    } = useGetNewsByIdQuery(id as string, { skip: !id });

    const {
        data: comments,
        isLoading: commentsLoading,
        isError: commentsError
    } = useGetCommentsByNewsIdQuery(id as string, { skip: !id });

    const { user } = useSelector((state: RootState) => state.auth);
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

    const handleDeleteComment = async (commentId: string) => {
        if (!id || !window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteComment({ commentId, newsId: id }).unwrap();
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment");
        }
    };

    if (newsLoading || commentsLoading) {
        return <div className="flex justify-center p-20"><Loader2 size={40} className="animate-spin text-slate-400" /></div>;
    }

    if (newsError || commentsError || !news) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-red-500 gap-4">
                <AlertCircle size={40} />
                <h3 className="font-bold text-lg">အချက်အလက်များ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</h3>
                <Link to="/admin/reports" className="text-sm font-semibold hover:underline">⬅ ပြန်သွားရန်</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/reports"
                        className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 padauk-bold flex items-center gap-2">
                            သတင်းအသုံးပြုမှု အသေးစိတ် (Interactions)
                        </h1>
                        <p className="text-slate-500 mt-1 padauk-regular max-w-lg truncate">
                            {news.title}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm uppercase tracking-wider text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-2">
                        <Heart className="text-rose-500 fill-rose-500/20" size={16} />
                        <span className="text-slate-800 text-base">{news.likes?.length || 0}</span> လိုက်ခ်
                    </span>
                    <span className="w-1 h-8 bg-slate-100"></span>
                    <span className="flex items-center gap-2">
                        <MessageSquare className="text-blue-500 fill-blue-500/20" size={16} />
                        <span className="text-slate-800 text-base">{comments?.length || 0}</span> မှတ်ချက်
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LIKES TABLE */}
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-bold text-slate-900 padauk-bold flex items-center gap-2">
                            <Heart className="text-rose-500" size={20} /> နှစ်သက်သူများ စာရင်း
                        </h2>
                    </div>
                    <div className="overflow-x-auto flex-1 p-6">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">User</th>
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">User ID</th>
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">News ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                {news.likes?.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-slate-400">လိုက်ခ်ပြုလုပ်သူ မရှိသေးပါ။</td>
                                    </tr>
                                )}
                                {news.likes?.map((likeUser: any, idx: number) => (
                                    <tr key={likeUser._id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            {likeUser.avatar ? (
                                                <img src={likeUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-200">
                                                    {likeUser.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 padauk-bold text-xs">{likeUser.name}</span>
                                                <span className="text-[10px] text-slate-400">{likeUser.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{likeUser._id}</td>
                                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{news._id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* COMMENTS TABLE */}
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-bold text-slate-900 padauk-bold flex items-center gap-2">
                            <MessageSquare className="text-blue-500" size={20} /> မှတ်ချက်များ စာရင်း
                        </h2>
                    </div>
                    <div className="overflow-x-auto flex-1 p-6">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap min-w-[200px]">User & Content</th>
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">Comment ID</th>
                                    <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">User ID</th>
                                    {user?.role === 3 && <th className="font-bold py-3 px-4 uppercase tracking-wider text-[10px] whitespace-nowrap">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                {comments?.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-slate-400">မှတ်ချက်များ မရှိသေးပါ။</td>
                                    </tr>
                                )}
                                {comments?.map((comment: any) => (
                                    <tr key={comment._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-start gap-3">
                                                {comment.author?.avatar ? (
                                                    <img src={comment.author.avatar} alt="Avatar" className="shrink-0 w-8 h-8 rounded-full border border-slate-200 object-cover mt-1" />
                                                ) : (
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-200 mt-1">
                                                        {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="font-bold text-slate-800 padauk-bold">{comment.author?.name || 'Unknown User'}</span>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 padauk-regular break-words whitespace-pre-wrap">{comment.content}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-top font-mono text-[10px] text-slate-500 leading-tight">
                                            {comment._id} <br />
                                            <span className="text-[9px] text-slate-400 uppercase tracking-widest bg-slate-100 px-1 py-0.5 rounded">Comment</span>
                                        </td>
                                        <td className="py-4 px-4 align-top font-mono text-[10px] text-slate-500 leading-tight">
                                            {comment.author?._id || 'N/A'} <br />
                                            <span className="text-[9px] text-slate-400 uppercase tracking-widest bg-slate-100 px-1 py-0.5 rounded">User</span>
                                        </td>
                                        {user?.role === 3 && (
                                            <td className="py-4 px-4 align-top">
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    disabled={isDeleting}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    title="Delete Comment"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

