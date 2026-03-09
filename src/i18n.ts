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
                announcements: "Announcement & Directives",
                about: "About Us",
                contact: "Contact",
                admin: "Dashboard",
                login: "Login",
                profileSettings: "Profile Settings",
                logout: "Logout",
                deptTitle: "Ta'ang Land Federal Unit Government Immigration Department",
                deptSubtitle: "တအာင်းပြည် ဖက်ဒရယ်ယူနစ် အစိုးရ လူဝင်မှုကြီးကြပ်‌ရေး ဌာန",
                searchPlaceholder: "Search documents...",
                noSearchRes: "No results."
            },
            hero: {
                title: "Stay Informed with Local Updates",
                subtitle: "Access the latest news, services, and district information in one place.",
                latestNews: "Latest News",
            },
            about: {
                title: "About Immigration Department",
                subtitle: "We are systematically recording population statistics related to the security and management of Ta'ang State.",
                badge: "OFFICIAL REPOSITORY",
                pslf: "Palaung State Liberation Front - PSLF / TNLA",
                description: "We are systematically working to obtain accurate population statistics and indicators that will support the drawing of projects for the security, management, health, education, economy and other matters of Ta'ang State.",
                policyTitle: "Department Policy",
                policyDesc: "To systematically control and maintain immigration, alien registration and household population activities in accordance with existing laws and procedures.",
                objectiveTitle: "Main Objectives",
                objectiveDesc: "To prevent illegal immigration, eliminate human trafficking and smuggling, and strictly implement the guidelines set by the government."
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
                portalBadge: "e-Government Portal",
                publicServices: "Public Services",
                publicServicesDesc: "You can easily apply for the following services online.",
                applyBtn: "Apply Now",
                smartcardTitle: "Apply for Smartcard",
                smartcardDesc: "You can apply for a new Smart Identity Card and renew it.",
                smartcardFeature1: "Full data security",
                smartcardFeature2: "Can be connected via Digital system",
                householdTitle: "Apply for Household Registration",
                householdDesc: "You can apply online for new household registration, adding/removing members, and making amendments.",
                householdFeature1: "Can issue new household registration",
                householdFeature2: "Can register move/birth/death"
            },
            districts: {
                title: "Districts",
                subtitle: "Offices and information across various districts.",
                noDistricts: "No District Information Yet",
                noDistrictsDesc: "District information will be added soon.",
                badge: "REGIONAL ADMINISTRATION",
                adminOffices: "District Administration Offices",
                adminOfficesDesc: "Public service information and administration office locations.",
                noMap: "No Map Information Yet",
                viewMap: "View Map",
                networkError: "Network Error",
                networkErrorDesc: "Unable to retrieve data. Please try again."
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
                address: "Ta'ang Region, Northern Shan State",
                phone: "Phone Number",
                email: "Email"
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
                announcements: "ထုတ်ပြန်ချက်နှင့် ညွှန်ကြားချက်များ",
                about: "ဌာနအကြောင်း",
                contact: "ဆက်သွယ်ရန်",
                admin: "စီမံခန့်ခွဲမှု",
                login: "ဝင်ရောက်ရန်",
                profileSettings: "ကိုယ်ရေးအချက်အလက်",
                logout: "ထွက်မည်",
                deptTitle: "တအာင်းပြည် ဖက်ဒရယ်ယူနစ် အစိုးရ လူဝင်မှုကြီးကြပ်‌ရေး ဌာန",
                deptSubtitle: "Immigration Department • Ta'ang Land Federal Unit Government",
                searchPlaceholder: "စာရွက်စာတမ်းများ ရှာဖွေပါ...",
                noSearchRes: "ရလဒ်မရှိပါ။"
            },
            hero: {
                title: "ဒေသတွင်းသတင်းများကို အချိန်နှင့်တပြေးညီ သိရှိပါ",
                subtitle: "သတင်းများ၊ ဝန်ဆောင်မှုများနှင့် ခရိုင်အချက်အလက်များကို တစ်နေရာတည်းတွင် ကြည့်ရှုပါ။",
                latestNews: "နောက်ဆုံးရသတင်းများ",
            },
            about: {
                title: "လူဝင်မှုကြီးကြပ်ရေးဌာန အကြောင်း",
                subtitle: "တအာင်းပြည်နယ်၏ လုံခြုံရေး၊ စီမံခန့်ခွဲရေးနှင့် သက်ဆိုင်သော လူဦးရေစာရင်းဇယားများကို စနစ်တကျ မှတ်တမ်းတင် ဆောင်ရွက်လျက်ရှိပါသည်။",
                badge: "OFFICIAL REPOSITORY",
                pslf: "ပလောင်ပြည်နယ်လွတ်မြောက်ရေးတပ်ဦး - PSLF / TNLA",
                description: "တအာင်းပြည်နယ်၏ လုံခြုံရေး၊ စီမံခန့်ခွဲရေး၊ ကျန်းမာရေး၊ ပညာရေး၊ စီးပွားရေးနှင့် အခြားကိစ္စရပ်များအတွက် စီမံကိန်းများရေးဆွဲရာတွင် အထောက်အကူပြုစေမည့် ခိုင်မာတိကျသော လူဦးရေစာရင်းဇယားများနှင့် အညွှန်းကိန်းများ ရရှိစေရန် စနစ်တကျ ဆောင်ရွက်လျက်ရှိပါသည်။",
                policyTitle: "ဌာန၏ မူဝါဒ",
                policyDesc: "လူဝင်မှုကြီးကြပ်ရေး၊ နိုင်ငံခြားသားထိန်းသိမ်းရေး၊ မှတ်ပုံတင်ရေးနှင့် အိမ်ထောင်စုလူဦးရေစာရင်း လုပ်ငန်းများကို တည်ဆဲဥပဒေ၊ လုပ်ထုံးလုပ်နည်းများနှင့်အညီ စနစ်တကျ ထိန်းသိမ်းကြပ်မတ် ဆောင်ရွက်ရန်။",
                objectiveTitle: "အဓိက ရည်မှန်းချက်များ",
                objectiveDesc: "တရားမဝင် ဝင်ရောက်နေထိုင်မှုများကို တားဆီးရန်၊ လူကုန်ကူးမှုနှင့် လူမှောင်ခိုပြုလုပ်မှုများ ပပျောက်စေရန်နှင့် အစိုးရမှ ချမှတ်ထားသော လမ်းညွှန်ချက်များအတိုင်း တိကျစွာ အကောင်အထည်ဖော် ဆောင်ရွက်ရန်။"
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
                portalBadge: "e-Government Portal",
                publicServices: "ပြည်သူ့ဝန်ဆောင်မှုများ",
                publicServicesDesc: "အောက်ပါဝန်ဆောင်မှုများကို အွန်လိုင်းမှတစ်ဆင့် လွယ်ကူလျင်မြန်စွာ လျှောက်ထားရယူနိုင်ပါသည်။",
                applyBtn: "လျှောက်ထားရန်",
                smartcardTitle: "Smartcard ပြုလုပ်ရန်",
                smartcardDesc: "နိုင်ငံသားစိစစ်ရေးကတ်ပြားအစား ခေတ်မီစမတ်ကတ် (Smart Identity Card) အသစ်လျှောက်ထားခြင်းနှင့် သက်တမ်းတိုးခြင်းများကို လုပ်ဆောင်နိုင်ပါသည်။",
                smartcardFeature1: "အချက်အလက် လုံခြုံမှု အပြည့်အဝရှိခြင်း",
                smartcardFeature2: "ဒီဂျစ်တယ်စနစ်ဖြင့် ချိတ်ဆက်အသုံးပြုနိုင်ခြင်း",
                householdTitle: "အိမ်ထောင်စုစာရင်း ပြုလုပ်ရန်",
                householdDesc: "အိမ်ထောင်စုလူဦးရေစာရင်း အသစ်ပြုလုပ်ခြင်း၊ မိသားစုဝင် တိုး/လျော့ စာရင်းသွင်းခြင်းနှင့် ပြင်ဆင်ခြင်းများကို အွန်လိုင်းမှ လျှောက်ထားနိုင်ပါသည်။",
                householdFeature1: "အိမ်ထောင်စုစာရင်း အသစ်ထုတ်ယူနိုင်ခြင်း",
                householdFeature2: "ပြောင်းရွှေ့/မွေးဖွား/သေဆုံး စာရင်းသွင်းနိုင်ခြင်း"
            },
            districts: {
                title: "ခရိုင်များ",
                subtitle: "ခရိုင်အသီးသီးရှိ ရုံးခွဲများနှင့် အချက်အလက်များ။",
                noDistricts: "ခရိုင်အချက်အလက်များ မရှိသေးပါ",
                noDistrictsDesc: "ခရိုင်ဆိုင်ရာ အချက်အလက်များ မကြာမီ ထည့်သွင်းပါမည်။",
                badge: "REGIONAL ADMINISTRATION",
                adminOffices: "ခရိုင်အုပ်ချုပ်ရေးရုံးများ",
                adminOfficesDesc: "ပြည်သူ့ဝန်ဆောင်မှု လုပ်ငန်းဆိုင်ရာ အချက်အလက်များနှင့် အုပ်ချုပ်ရေးရုံး တည်နေရာများ",
                noMap: "မြေပုံအချက်အလက် မရှိသေးပါ",
                viewMap: "တည်နေရာပြမြေပုံ",
                networkError: "ကွန်ရက်ချို့ယွင်းချက်",
                networkErrorDesc: "အချက်အလက်များကို ရယူနိုင်ခြင်း မရှိပါ။ ပြန်လည်ကြိုးစားကြည့်ပါ။"
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
                address: "တအာင်းဒေသ၊ ရှမ်းပြည်နယ်မြောက်ပိုင်း",
                phone: "ဖုန်းနံပါတ်",
                email: "အီးမေးလ်"
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
