import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { useUploadImageToS3Mutation } from '../../store/newsApiSlice'

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const [uploadImageToS3] = useUploadImageToS3Mutation();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            })
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 text-slate-800 padauk-regular',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append("file", file);

                // RTK Query upload hitting backend S3 bucket
                const result = await uploadImageToS3(formData).unwrap();

                // Insert remote S3 URL directly into Editor's html tree!
                if (result.success && result.url) {
                    editor.chain().focus().setImage({ src: result.url }).run();
                }
            } catch (err) {
                console.error("Image upload failed:", err);
                alert("ဓာတ်ပုံတင်ရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။"); // Burmese: Image upload error
            }
        };
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL ဖြည့်စွက်ပါ:', previousUrl); // URL input

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const MenuBar = () => {
        return (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border-b border-slate-200">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button" title="အမည်း" // Bold
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button" title="စာလုံးစောင်း" // Italic
                >
                    <Italic size={18} />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-2 py-1 font-bold rounded-md transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 font-bold rounded-md transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button"
                >
                    H2
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button"
                >
                    <ListOrdered size={18} />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                <button
                    onClick={addLink}
                    className={`p-2 rounded-md transition-colors ${editor.isActive('link') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
                    type="button" title="လင့်ခ်"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    onClick={handleImageUpload}
                    className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                    type="button" title="ပုံတင်ရန်"
                >
                    <ImageIcon size={18} />
                </button>
            </div>
        );
    };

    return (
        <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <MenuBar />
            <EditorContent editor={editor} />
        </div>
    )
}
