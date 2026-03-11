export const DISTRICTS = [
    { value: "Kyaukme", label: "ကျောက်မဲခရိုင် (Kyaukme)" },
    { value: "Muse", label: "မူဆယ်ခရိုင် (Muse)" },
    { value: "Lashio", label: "လားရှိုးခရိုင် (Lashio)" },
    { value: "Mongmit", label: "မိုးမိတ်ခရိုင် (Mongmit)" },
];

export const TOWNSHIPS: Record<string, { value: string; label: string }[]> = {
    Kyaukme: [
        { value: "Namhsan", label: "နမ့်ဆန်မြို့နယ် (Namhsan)" },
        { value: "Mantong", label: "မန်တုံမြို့နယ် (Mantong)" },
        { value: "Kyaukme", label: "ကျောက်မဲမြို့နယ် (Kyaukme)" },
        { value: "Hsipaw", label: "သီပေါမြို့နယ် (Hsipaw)" },
        { value: "Nawnghkio", label: "နောင်ချိုမြို့နယ် (Nawnghkio)" },
        { value: "Minngon", label: "မိုင်းငေါ့မြို့နယ် (Minngon)" },
        { value: "Minngon_Sub", label: "မိုင်းလုံမြို့နယ် (Minlong)" },
    ],
    Muse: [
        { value: "Muse", label: "မူဆယ်မြို့နယ် (Muse)" },
        { value: "Namkham", label: "နမ့်ခမ်းမြို့နယ် (Namkham)" },
        { value: "Kutkai", label: "ကွတ်ခိုင်မြို့နယ် (Kutkai)" },
        { value: "Monekoe", label: "မုံးကိုးမြို့နယ် (Monekoe)" },
        { value: "Pansay", label: "ပန်ဆိုင်းမြို့နယ် (Pansay)" },
    ],
    Lashio: [
        { value: "Lashio", label: "လားရှိုးမြို့နယ် (Lashio)" },
        { value: "Hsenwi", label: "သိန္နီမြို့နယ် (Hsenwi)" },
        { value: "Tangyan", label: "တန့်ယန်းမြို့နယ် (Tangyan)" },
        { value: "Mongyai", label: "မိုင်းရယ်မြို့နယ် (Mongyai)" },
    ],
    Mongmit: [
        { value: "Mongmit", label: "မိုးမိတ်မြို့နယ် (Mongmit)" },
        { value: "Mabein", label: "မဘိမ်းမြို့နယ် (Mabein)" },
    ],
};

// Flattened list for convenience
export const ALL_TOWNSHIPS = Object.values(TOWNSHIPS).flat();
