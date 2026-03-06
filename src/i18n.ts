import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            nav: {
                home: "Home",
                news: "News",
                activities: "Activities",
                services: "Services",
                districts: "Districts",
                announcements: "Announcements",
                contact: "Contact",
                admin: "Dashboard",
                login: "Login",
            },
            hero: {
                title: "Stay Informed with Local Updates",
                subtitle: "Access the latest news, services, and district information in one place.",
                latestNews: "Latest News",
            },
            common: {
                readMore: "Read More",
                allNews: "All News",
                viewAll: "View All",
            },
            contact: {
                badge: "Contact",
                title: "Contact Us",
                subtitle: "If you need help, you can send complaints or suggestions.",
                location: "Headquarters Location",
                address: "Ta'ang Region, Northern Shan State",
                phone: "Phone Number",
                email: "Email",
                officeHours: "Office Hours",
                days: "Mon - Fri",
                weekend: "Sat - Sun",
                closed: "Closed",
                name: "Name",
                subject: "Subject",
                message: "Message",
                placeholderName: "Your Name",
                placeholderEmail: "example@email.com",
                placeholderPhone: "+95 9 xxx xxx xxx",
                placeholderSubject: "Enter subject",
                placeholderMessage: "Write your message here...",
                send: "Send Message",
                sending: "Sending...",
                success: "Your message has been sent successfully. We will contact you back.",
                error: "Failed to send. Please try again.",
                requiredFields: "Please fill in all required fields.",
            },
            login: {
                title: "Login",
                subtitle: "Sign in with your email and password",
                email: "Email",
                password: "Password",
                forgot: "Forgot password?",
                button: "Login",
                loggingIn: "Logging in...",
                noAccount: "Don't have an account?",
                contactUs: "Contact Us",
                failed: "Login failed. Please check your credentials.",
            },
            activities: {
                title: "Activities",
                subtitle: "Latest activity news and updates.",
                noActivities: "No Activities Yet",
                noActivitiesDesc: "There are no activities published recently.",
                badge: "Activity",
                admin: "Admin"
            },
            services: {
                title: "Services",
                subtitle: "Learn about the services provided by the Immigration Department.",
                noServices: "No Services Yet",
                noServicesDesc: "Service information is not available at the moment.",
            },
            districts: {
                title: "Districts",
                subtitle: "Offices and information across various districts.",
                noDistricts: "No District Information Yet",
                noDistrictsDesc: "District information will be added soon.",
            },
            announcements: {
                title: "Announcements",
                subtitle: "Official statements and announcements.",
                noAnnouncements: "No Announcements Yet",
                noAnnouncementsDesc: "There are no official announcements published recently.",
                badge: "Announcement",
                submittedBy: "Submitted by - ",
                admin: "Admin"
            },
            newsReader: {
                preparing: "Preparing to read news...",
                notFound: "News Not Found",
                notFoundDesc: "This news article may have been removed or there is a link error.",
                backHome: "Go back to home page",
                download: "Download",
                author: "Author",
                admin: "System Admin",
                loves: "Loves"
            },
            notFound: {
                title: "Page Not Found",
                desc: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
                home: "Home Page",
                back: "Go Back"
            },
            pageReader: {
                preparing: "Searching for information...",
                notFound: "Page Not Found",
                back: "Go Back",
                service: "Service",
                districtInfo: "District Information",
                download: "Download"
            },
            footer: {
                about: "You can read the latest reliable and valid news and events in real time.",
                quickLinks: "Quick Links",
                contact: "Contact",
                copyright: "© 2026 Lowith. All rights reserved.",
                privacy: "Privacy Policy",
                terms: "Terms of Service",
                location: "Headquarters Location",
                address: "Ta'ang Region, Northern Shan State"
            },
            searchModal: {
                placeholder: "Search news, category, author...",
                hint: "Enter text to search (min 2 characters)",
                noResults: "No Results",
                noResultsDesc: "No matching news found for",
                found: "results found",
                navigationHint: "↑↓ Navigate • Enter to view"
            },
            comments: {
                title: "Comments",
                error: "Comment failed",
                placeholder: "Write a comment about the news...",
                submit: "Submit",
                loginRequiredTitle: "You need to login to write a comment.",
                login: "Login",
                anonymous: "Anonymous",
                roleRootAdmin: "Root Admin",
                roleAdmin: "Admin",
                roleStaff: "Staff",
                noComments: "No comments yet. Be the first to comment."
            },
            breadcrumbs: {
                homeTitle: "Home Page",
                home: "Home"
            },
            shareButtons: {
                title: "Share News",
                shareFacebook: "Share on Facebook",
                shareTelegram: "Share on Telegram",
                copyLink: "Copy Link",
                linkCopied: "Link copied."
            }
        }
    },
    mm: {
        translation: {
            nav: {
                home: "ပင်မစာမျက်နှာ",
                news: "သတင်း",
                activities: "လှုပ်ရှားမှုများ",
                services: "ဝန်ဆောင်မှုများ",
                districts: "ခရိုင်များ",
                announcements: "ထုတ်ပြန်ချက်များ",
                contact: "ဆက်သွယ်ရန်",
                admin: "စီမံခန့်ခွဲမှု",
                login: "ဝင်ရောက်ရန်",
            },
            hero: {
                title: "ဒေသတွင်းသတင်းများကို အချိန်နှင့်တပြေးညီ သိရှိပါ",
                subtitle: "သတင်းများ၊ ဝန်ဆောင်မှုများနှင့် ခရိုင်အချက်အလက်များကို တစ်နေရာတည်းတွင် ကြည့်ရှုပါ။",
                latestNews: "နောက်ဆုံးရသတင်းများ",
            },
            common: {
                readMore: "ဆက်လက်ဖတ်ရှုရန်",
                allNews: "သတင်းများအားလုံး",
                viewAll: "အားလုံးကြည့်မည်",
            },
            contact: {
                badge: "ဆက်သွယ်ရန်",
                title: "ကျွန်ုပ်တို့ထံ ဆက်သွယ်ပါ",
                subtitle: "အကူအညီလိုအပ်ပါက၊ တိုင်ကြားချက် သို့မဟုတ် အကြံပြုချက်များ ပေးပို့နိုင်ပါသည်။",
                location: "ရုံးချုပ်တည်နေရာ",
                address: "တအာင်းဒေသ၊ ရှမ်းပြည်နယ်မြောက်ပိုင်း",
                phone: "ဖုန်းနံပါတ်",
                email: "အီးမေးလ်",
                officeHours: "ရုံးဖွင့်ချိန်",
                days: "တနင်္လာ - သောကြာ",
                weekend: "စနေ - တနင်္ဂနွေ",
                closed: "ပိတ်ရက်",
                name: "အမည်",
                subject: "ခေါင်းစဉ်",
                message: "မက်ဆေ့ချ်",
                placeholderName: "သင့်အမည်",
                placeholderEmail: "example@email.com",
                placeholderPhone: "+95 9 xxx xxx xxx",
                placeholderSubject: "ခေါင်းစဉ် ရိုက်ထည့်ပါ",
                placeholderMessage: "သင့်မက်ဆေ့ချ်ကို ဤနေရာတွင် ရေးသားပါ...",
                send: "မက်ဆေ့ချ် ပေးပို့မည်",
                sending: "ပေးပို့နေသည်...",
                success: "သင့်မက်ဆေ့ချ် အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။ ကျွန်ုပ်တို့ ပြန်လည်ဆက်သွယ်ပါမည်။",
                error: "ပေးပို့ခြင်း မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပါ။",
                requiredFields: "ကျေးဇူးပြု၍ လိုအပ်သည့် အချက်အလက်များအားလုံး ဖြည့်သွင်းပါ။",
            },
            login: {
                title: "အကောင့်ဝင်ရန်",
                subtitle: "သင်၏ အီးမေးလ်နှင့် စကားဝှက်ဖြင့် ဝင်ရောက်ပါ",
                email: "အီးမေးလ်",
                password: "စကားဝှက်",
                forgot: "စကားဝှက်မေ့နေပါသလား?",
                button: "ဝင်ရောက်မည်",
                loggingIn: "ဝင်ရောက်နေသည်...",
                noAccount: "အကောင့်မရှိသေးပါက?",
                contactUs: "ဆက်သွယ်ရန်",
                failed: "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။ သင်၏ အချက်အလက်များကို ပြန်လည်စစ်ဆေးပါ။",
            },
            activities: {
                title: "လှုပ်ရှားမှုများ",
                subtitle: "လတ်တလော လှုပ်ရှားမှုဆိုင်ရာ သတင်းများနှင့် အခြေအနေများ။",
                noActivities: "လှုပ်ရှားမှုများ မရှိသေးပါ",
                noActivitiesDesc: "လတ်တလော လွှင့်တင်ထားသော လှုပ်ရှားမှုများ မရှိသေးပါ။",
                badge: "လှုပ်ရှားမှု",
                admin: "Admin"
            },
            services: {
                title: "ဝန်ဆောင်မှုများ",
                subtitle: "လူဝင်မှုကြီးကြပ်ရေးဌာနမှ ဝန်ဆောင်မှုများအကြောင်း လေ့လာပါ။",
                noServices: "ဝန်ဆောင်မှုများ မရှိသေးပါ",
                noServicesDesc: "လတ်တလော ဝန်ဆောင်မှု အချက်အလက်များ မရှိသေးပါ။",
            },
            districts: {
                title: "ခရိုင်များ",
                subtitle: "ခရိုင်အသီးသီးရှိ ရုံးခွဲများနှင့် အချက်အလက်များ။",
                noDistricts: "ခရိုင်အချက်အလက်များ မရှိသေးပါ",
                noDistrictsDesc: "ခရိုင်ဆိုင်ရာ အချက်အလက်များ မကြာမီ ထည့်သွင်းပါမည်။",
            },
            announcements: {
                title: "ထုတ်ပြန်ချက်များ",
                subtitle: "တရားဝင်ထုတ်ပြန်ချက်များနှင့် ကြေညာချက်များ။",
                noAnnouncements: "ထုတ်ပြန်ချက်များ မရှိသေးပါ",
                noAnnouncementsDesc: "လတ်တလော ထုတ်ပြန်ထားသော ကြေညာချက်များ မရှိသေးပါ။",
                badge: "ထုတ်ပြန်ချက်",
                submittedBy: "တင်သွင်းသူ - ",
                admin: "Admin"
            },
            newsReader: {
                preparing: "သတင်းဖတ်ရှုရန် ပြင်ဆင်နေပါသည်...",
                notFound: "သတင်းရှာမတွေ့ပါ",
                notFoundDesc: "ယခုသတင်းသည် ဖယ်ရှားခံရခြင်း သို့မဟုတ် လင့်ခ်အမှားအယွင်း ရှိနိုင်ပါသည်။",
                backHome: "ပင်မစာမျက်နှာသို့ ပြန်သွားမည်",
                download: "ဒေါင်းလုဒ်ရယူရန်",
                author: "ရေးသားသူ",
                admin: "System Admin",
                loves: "နှစ်သက်သူ"
            },
            notFound: {
                title: "စာမျက်နှာ ရှာမတွေ့ပါ",
                desc: "သင်ရှာဖွေနေသော စာမျက်နှာသည် ဖယ်ရှားခံထားရခြင်း၊ အမည်ပြောင်းထားခြင်း၊\nသို့မဟုတ် ယာယီမရရှိနိုင်ခြင်း ဖြစ်နိုင်ပါသည်။",
                home: "ပင်မစာမျက်နှာ",
                back: "နောက်သို့ပြန်သွားမည်"
            },
            pageReader: {
                preparing: "အချက်အလက်များ ရှာဖွေနေပါသည်...",
                notFound: "စာမျက်နှာ ရှာမတွေ့ပါ",
                back: "ပြန်သွားမည်",
                service: "ဝန်ဆောင်မှု",
                districtInfo: "ခရိုင်အချက်အလက်",
                download: "ဒေါင်းလုဒ်ရယူရန်"
            },
            footer: {
                about: "ယုံကြည်ရသော၊ ခိုင်လုံသော နောက်ဆုံးရ သတင်းများနှင့် ဖြစ်စဉ်များကို အချိန်နှင့်တစ်ပြေးညီ ဖတ်ရှုနိုင်ပါသည်။",
                quickLinks: "အမြန်လင့်ခ်များ",
                contact: "ဆက်သွယ်ရန်",
                copyright: "© 2026 Lowith. မူပိုင်ခွင့်များအားလုံးသိမ်းဆည်းထားသည်။",
                privacy: "ကိုယ်ရေးအချက်အလက်မူဝါဒ",
                terms: "စည်းကမ်းချက်များ",
                location: "ရုံးချုပ်တည်နေရာ",
                address: "တအာင်းဒေသ၊ ရှမ်းပြည်နယ်မြောက်ပိုင်း"
            },
            searchModal: {
                placeholder: "သတင်း၊ ကဏ္ဍ၊ ရေးသားသူ ရှာဖွေပါ...",
                hint: "ရှာဖွေလိုသော စာသား ရိုက်ထည့်ပါ (အနည်းဆုံး ၂ လုံး)",
                noResults: "ရလဒ် မတွေ့ပါ",
                noResultsDesc: "နှင့် ကိုက်ညီသော သတင်း မရှိပါ။",
                found: "ခု တွေ့ရှိသည်",
                navigationHint: "↑↓ ရွေးချယ် • Enter ဝင်ကြည့်"
            },
            comments: {
                title: "မှတ်ချက်များ",
                error: "မှတ်ချက်ပေးခြင်း မအောင်မြင်ပါ။ (Comment failed)",
                placeholder: "သတင်းနှင့်ပတ်သက်၍ မှတ်ချက်များရေးသားပါ...",
                submit: "ပေးပို့မည်",
                loginRequiredTitle: "မှတ်ချက်ရေးသားရန် အကောင့်ဝင်ရောက်ရန် လိုအပ်ပါသည်။",
                login: "အကောင့်ဝင်မည်",
                anonymous: "အမည်မသိ",
                roleRootAdmin: "Root Admin",
                roleAdmin: "Admin",
                roleStaff: "Staff",
                noComments: "မှတ်ချက်များ မရှိသေးပါ။ ပထမဆုံးမှတ်ချက်ပေးသူ ဖြစ်ပါစေ။"
            },
            breadcrumbs: {
                homeTitle: "ပင်မစာမျက်နှာ",
                home: "ပင်မ"
            },
            shareButtons: {
                title: "သတင်းအား ဝေမျှရန်",
                shareFacebook: "Facebook တွင် ဝေမျှမည်",
                shareTelegram: "Telegram တွင် ဝေမျှမည်",
                copyLink: "လင့်ခ်ကို ကူးယူမည်",
                linkCopied: "လင့်ခ်ကို ကူးယူပြီးပါပြီ။"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
