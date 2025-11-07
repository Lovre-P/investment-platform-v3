import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Supported languages
export const SUPPORTED_LANGS = ['en', 'hr', 'de', 'fr', 'it'];
// Basic resources inline (can be split into JSON later)
const resources = {
    en: {
        translation: {
            nav: {
                home: 'Home', investments: 'Investments', submitInvestment: 'Submit Investment',
                about: 'About Us', contact: 'Contact', adminLogin: 'Admin Login', openMenu: 'Open main menu'
            },
            common: {
                viewDetails: 'View Details', loading: 'Loading...', error: 'Error', back: 'Back',
                cancel: 'Cancel', save: 'Save', submit: 'Submit', investNow: 'Invest Now',
                fullyFunded: 'This investment is fully funded!', closed: 'This investment is now closed.',
                closeModal: 'Close modal', submitting: 'Submitting...', sendMessage: 'Send Message',
                messageSent: 'Your message has been sent successfully! We will get back to you soon.',
                messageFailed: 'Failed to send message. Please try again later.',
                phoneOptional: 'Phone Number (Optional)', phonePlaceholder: '(123) 456-7890',
                message: 'Message', messagePlaceholder: 'Your inquiry or message...',
                additionalMessage: 'Additional Message (Optional)', additionalMessagePlaceholder: 'Any additional questions or comments...',
                private: 'Private Investment', business: 'Business Investment',
                openInNewWindow: 'Open scheduling in new window →',
                scheduleConsult: 'Schedule a Consultation',
                scheduleConsultDesc: 'Prefer to speak directly? Schedule a 30-minute consultation with our investment team.',
                contactSoon: "We'll contact you within 24 hours to discuss next steps"
            },
            footer: {
                aboutText: 'Your trusted partner in discovering and managing high-potential investment opportunities. We connect visionaries with capital.',
                quickLinks: 'Quick Links', browseInvestments: 'Browse Investments', submitOpportunity: 'Submit an Opportunity',
                aboutUs: 'About Us', contactSupport: 'Contact Support', faq: 'FAQ', getInTouch: 'Get in Touch',
                address: 'Put Gvozdenova 283, 22000 Šibenik, Croatia', email: 'Email', phone: 'Phone',
                terms: 'Terms of Service', privacy: 'Privacy Policy', rights: 'All rights reserved.'
            },
            home: {
                heroTitle1: 'Invest in the', heroTitle2: 'Future.', heroKicker: 'Empower Innovation.', heroSubtitle: 'Discover curated investment opportunities in groundbreaking projects and growing businesses. Join MegaInvest to shape tomorrow, today.',
                exploreOpportunities: 'Explore Opportunities', submitProject: 'Submit Your Project',
                howItWorks: 'How {{brand}} Works', discoverOpportunities: 'Discover Opportunities',
                investWithConfidence: 'Invest with Confidence', growYourPortfolio: 'Grow Your Portfolio',
                discoverDesc: 'Browse a diverse range of vetted investment projects across various sectors.',
                investDesc: 'Access detailed information, due diligence reports, and transparent terms for each project.',
                growDesc: 'Track your investments, receive updates, and potentially reap significant returns.',
                featured: 'Featured Investments', viewAll: 'View All', noFeatured: 'No featured investments available at the moment. Check back soon!',
                ctaTitle: 'Have a Groundbreaking Project?', ctaParagraph: 'MegaInvest is always looking for innovative projects and promising businesses seeking funding. If you have a vision, we want to hear about it.',
                ctaButton: 'Submit Your Investment Idea'
            },
            submitPage: {
                pageTitle: 'Submit Your Investment Idea',
                pageSubtitle: 'Have a groundbreaking project or a promising business venture? Share your idea with us. We provide a platform to connect visionaries like you with potential investors.',
                processTitle: 'Purchase Process',
                step1: 'Initial Discussion and Needs Analysis',
                step2: 'Search and Presentation of Potential Companies',
                step3: 'Business Assessment and Analysis',
                step4: 'Negotiations and Contract Preparation',
                step5: 'Finalization and Legal Support',
                businessProcessAlt: 'Business Process'
            },
            investList: {
                headerTitle: 'Investment Opportunities',
                headerSubtitle: 'Explore a diverse range of vetted investment projects. Find your next opportunity and grow your portfolio with MegaInvest.',
                searchPlaceholder: 'Search by title, keyword...',
                statusAll: 'All Statuses',
                categoryAll: 'All Categories',
                sortNewest: 'Sort by: Newest',
                sortOldest: 'Sort by: Oldest',
                sortGoalHighLow: 'Sort by: Goal (High-Low)',
                sortGoalLowHigh: 'Sort by: Goal (Low-High)',
                sortRaisedHighLow: 'Sort by: Raised (High-Low)',
                sortRaisedLowHigh: 'Sort by: Raised (Low-High)',
                resetFilters: 'Reset Filters',
                errorTitle: 'Error',
                errorBody: 'Could not load investments. Please try again later.',
                emptyTitle: 'No Investments Found',
                emptyBody: 'Your search or filter criteria did not match any investments. Try adjusting your filters or check back later.',
                clearAllFilters: 'Clear All Filters',
                invalidDataFormat: 'Invalid data format received from server.'
            },
            about: {
                pageTitle: 'About MegaInvest',
                headerIntro: 'MegaInvest is a premier platform dedicated to connecting innovative projects and businesses with discerning investors. We believe in the power of capital to fuel growth, drive innovation, and create lasting impact.',
                ourMission: 'Our Mission',
                missionBody: 'Our mission is to democratize access to high-quality investment opportunities and provide a transparent, secure, and efficient platform for both project owners and investors. We strive to foster a community built on trust, innovation, and mutual success.',
                missionBullets: {
                    b1: 'To identify and showcase high-potential ventures.',
                    b2: 'To provide robust due diligence and clear information.',
                    b3: 'To simplify the investment process.',
                    b4: 'To support entrepreneurs in achieving their vision.',
                    b5: 'To help investors build diverse and impactful portfolios.'
                },
                coreValues: 'Our Core Values',
                valueInnovation: 'Innovation',
                valueInnovationBody: 'We champion forward-thinking ideas and embrace technological advancements to continuously improve our platform and services.',
                valueIntegrity: 'Integrity & Transparency',
                valueIntegrityBody: 'We operate with the utmost honesty and provide clear, comprehensive information to ensure trust and informed decision-making.',
                valueCommunity: 'Collaboration & Community',
                valueCommunityBody: 'We believe in the power of partnership and aim to build a strong, supportive community of entrepreneurs and investors.',
                ctaHeader: 'Ready to Be Part of Something Mega?',
                ctaBody: "Whether you're an investor looking for your next big opportunity or an entrepreneur with a game-changing idea, MegaInvest is your platform for growth.",
                exploreInvestments: 'Explore Investments',
                submitProject: 'Submit Your Project',
                ourLocation: 'Our Location',
                locationBody: "Visit us at our headquarters in Šibenik, Croatia. We're always happy to meet with potential partners and investors.",
                missionImageAlt: 'Our Mission'
            },
            contact: {
                getInTouch: 'Get In Touch',
                intro: "We're here to help! Whether you have a question about an investment, need support, or want to learn more about our platform, feel free to reach out.",
                contactInfo: 'Contact Information',
                ourOffice: 'Our Office',
                address: 'Put Gvozdenova 283, 22000 Šibenik',
                getDirections: 'Get Directions',
                emailUs: 'Email Us',
                callUs: 'Call Us',
                officeHours: 'Office Hours',
                officeHoursWeek: 'Monday - Friday: 8:00 AM - 3:00 PM',
                officeHoursWeekend: 'Saturday - Sunday: Closed',
                companyInfo: 'Company Information',
                generalInquiries: 'General Inquiries', phoneHours: 'Mon - Fri, 8:00 AM - 3:00 PM (CET)',
                faqTitle: 'Frequently Asked Questions',
                faqIntro: 'Find answers to common questions about using MegaInvest, data protection, and investment processes.',
                faq: {
                    q1: { question: 'Is my investment data visible to other users?', answer: 'No, your personal financial information and investment details remain private. We only share basic profile information when you actively engage with opportunities. Sensitive data is never shared without consent.' },
                    q2: { question: 'How does MegaInvest protect my personal and financial information?', answer: 'We implement SSL/TLS encryption, encrypted storage, access controls, regular audits, multi-factor authentication, and limited employee access.' },
                    q3: { question: 'What risks are involved in using this platform?', answer: 'All investments carry risks and may result in loss of capital. MegaInvest does not provide investment advice or guarantees. Conduct due diligence.' },
                    q4: { question: 'Does MegaInvest handle payments or hold investor funds?', answer: 'No. Transactions are managed directly between investors and project owners via their chosen methods and agreements.' },
                    q5: { question: 'Can I request to delete my account and data?', answer: 'Yes. You can request deletion under GDPR, subject to legal retention requirements. Data portability is available before deletion.' },
                    q6: { question: 'Will my personal information be shared with third parties?', answer: 'We share only with consent, service providers, legal requirements, or business transfers. We never sell personal data for marketing.' },
                    q7: { question: 'How long is my data stored on the platform?', answer: 'Retention varies: account info until deletion + 7 years, transaction records 10 years, communications 3 years, marketing until consent withdrawn.' },
                    q8: { question: 'Is MegaInvest legally responsible for failed investments?', answer: 'No. We connect investors and project owners but do not guarantee outcomes or provide advice. Decisions remain with the investor.' },
                    q9: { question: 'Do you transfer my data outside the EU?', answer: 'Some transfers may occur with appropriate safeguards (SCCs, adequacy decisions). You can object to certain transfers.' },
                    q10: { question: 'How do I control cookies and tracking settings?', answer: 'Control cookies via your browser. Essential cookies are required; analytics can be controlled via preferences. Disabling may affect functionality.' }
                },
                faqCtaTitle: 'Still have questions?',
                faqCtaBody: "Can't find the answer you're looking for? Our support team is here to help.",
                contactEmail: 'info@mega-invest.hr'
            },
            notFound: {
                title: 'Page not found - 404',
                heading: 'Page not found',
                message: 'The page you are looking for does not exist or has been moved.',
                home: 'Home',
                viewInvestments: 'View Investments',
                needHelp: 'Need help?',
                contactUs: 'Contact us'
            },
            seo: {
                home_title: 'MegaInvest - Premium Investment Opportunities Platform',
                home_desc: "Discover exclusive investment opportunities in real estate, technology, and renewable energy. Join Croatia's leading investment platform for verified, high-return projects with transparent terms and professional due diligence.",
                list_title: 'Investment Opportunities - Browse Verified Projects | MegaInvest',
                list_desc: "Explore verified investment opportunities in real estate, technology, renewable energy, and startups. Find high-return projects with transparent terms and professional due diligence on Croatia's leading investment platform.",
                about_title: "About MegaInvest - Croatia's Leading Investment Platform",
                about_desc: "Learn about MegaInvest's mission to democratize investment opportunities in Croatia. Discover our values of innovation, integrity, and community-driven growth in real estate, technology, and renewable energy sectors.",
                privacy_title: 'Privacy Policy - MegaInvest | Data Protection & Privacy Rights',
                privacy_desc: 'Learn how MegaInvest protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, rights, and GDPR compliance.',
                terms_title: 'Terms of Service - MegaInvest | Investment Platform Legal Terms',
                terms_desc: "Read MegaInvest's Terms of Service covering platform usage, user responsibilities, investment risks, and legal compliance for our investment platform.",
                contact_title: 'Contact MegaInvest - Get Support & Investment Information',
                contact_desc: 'Contact MegaInvest for investment support, platform questions, or business inquiries. Located in Šibenik, Croatia. Email: info@mega-invest.hr, Phone: +385 91 310 1512. Find answers to common questions about our investment platform.',
                invest_detail_title: '{{title}} - Investment Opportunity | MegaInvest',
                invest_detail_desc: '{{description}} Minimum investment: {{currency}} {{minInvestment}}. Expected returns: {{apyRange}}. Category: {{category}}.',
                submit_title: 'Submit Your Investment Opportunity - Get Funding | MegaInvest',
                submit_desc: 'Submit your investment opportunity to MegaInvest and connect with potential investors. Our platform helps entrepreneurs and businesses secure funding for real estate, technology, and renewable energy projects in Croatia.'
            },
            investCard: {
                apyRange: 'APY Range', term: 'Term', category: 'Category',
                raised: 'Raised', goal: 'Goal', funded: '% Funded', viewDetails: 'View Details'
            },
            invDetail: {
                status: 'Status', keyInfo: 'Key Information', raised: 'Raised', goal: 'Goal', funded: '% Funded',
                estApy: 'Est. APY', minInvestment: 'Min. Investment', term: 'Term', category: 'Category',
                investNow: 'Invest Now', fullyFunded: 'This investment is fully funded!', closed: 'This investment is now closed.',
                about: 'About this Investment', submittedBy: 'Submitted By', submissionDate: 'Submission Date', tags: 'Tags',
                important: 'Important Considerations', risk: 'Investing involves risks, including the loss of principal. Please conduct your own due diligence before making any investment decisions. The information provided here is for informational purposes only and does not constitute financial advice.',
                contactLink: 'Have questions? Contact us →', backToInvestments: '← Back to Investments',
                loading: 'Loading investment details...', errorTitle: 'Error Loading Investment', notFound: 'Investment not found.'
            },
            form: {
                proposeTitle: 'Propose a New Investment', proposeSubtitle: 'Share your innovative project with potential investors',
                personalInfo: 'Personal Information', yourFullName: 'Your Full Name *', yourEmail: 'Your Email Address *',
                namePlaceholder: 'E.g., Jane Doe', emailPlaceholder: 'E.g., jane.doe@example.com',
                investDetails: 'Investment Details', investTitle: 'Investment Title *', category: 'Category *',
                loadingCategories: 'Loading categories...', selectCategory: 'Select Category',
                projectDesc: 'Project Description', shortDesc: 'Short Description (Max 150 chars) *', longDesc: 'Detailed Description *',
                shortPlaceholder: 'Brief overview of the investment opportunity...', longPlaceholder: 'Provide comprehensive details including business plan, team background, market analysis, financial projections, and growth strategy...',
                financialDetails: 'Financial Details', fundingGoal: 'Funding Goal ({{currency}}) *', currency: 'Currency *',
                apyRange: 'Expected APY Range', minInvestment: 'Minimum Investment ({{currency}})', term: 'Investment Term',
                additionalInfo: 'Additional Information', tags: 'Tags (comma-separated)', tagsHelp: 'Add relevant keywords to help investors find your project',
                uploadImages: 'Upload Images (Optional)',
                termsAgree: 'I agree to the <1>Terms of Service</1> and <3>Privacy Policy</3>, and confirm that all information provided is accurate and complete.',
                submitBtn: 'Submit Investment Proposal', submitting: 'Submitting...', reviewTime: 'Your proposal will be reviewed by our team within 2-3 business days',
                success: 'Investment submitted successfully! It will be reviewed by our team.', failure: 'Failed to submit investment. Please try again.',
                fundingGoalPlaceholder: '50000', apyPlaceholder: '5-8%', minInvestmentPlaceholder: '1000', termPlaceholder: 'E.g., 3 Years, 12 Months',
                currency_USD: 'USD - US Dollar', currency_EUR: 'EUR - Euro', currency_GBP: 'GBP - British Pound',
                v_name_required: 'Submitter name is required.', v_email_required: 'Submitter email is required.', v_email_invalid: 'Email address is invalid.',
                v_title_required: 'Investment title is required.', v_category_required: 'Category is required.', v_amount_positive: 'Funding goal must be a positive number.',
                v_short_required: 'Short description is required.', v_long_required: 'Detailed description is required.', v_terms_required: 'You must agree to the terms of service.',
                fixFormErrors: 'Please correct the errors in the form.'
            },
            cookie: {
                title: 'We value your privacy',
                description: 'We use cookies to enhance your experience and analyze site traffic. You can manage your preferences or learn more in our',
                privacyPolicy: 'Privacy Policy',
                acceptAll: 'Accept All',
                rejectAll: 'Reject All',
                managePreferences: 'Manage Preferences',
                processing: 'Processing...',
                preferencesTitle: 'Cookie Preferences',
                preferencesDescription: 'Choose which cookies you want to accept. You can change these settings at any time.',
                required: 'Required',
                alwaysActive: 'Always Active',
                cancel: 'Cancel',
                savePreferences: 'Save Preferences',
                saving: 'Saving...'
            }
        }
    },
    hr: {
        translation: {
            nav: {
                home: 'Početna', investments: 'Investicije', submitInvestment: 'Pošalji investiciju',
                about: 'O nama', contact: 'Kontakt', adminLogin: 'Prijava admina', openMenu: 'Otvori glavni izbornik'
            },
            common: {
                viewDetails: 'Pogledaj detalje', loading: 'Učitavanje...', error: 'Greška', back: 'Natrag',
                cancel: 'Odustani', save: 'Spremi', submit: 'Pošalji', investNow: 'Uloži sada',
                fullyFunded: 'Ova investicija je u potpunosti financirana!', closed: 'Ova investicija je zatvorena.',
                closeModal: 'Zatvori prozor', submitting: 'Slanje...', sendMessage: 'Pošalji poruku',
                messageSent: 'Vaša poruka je uspješno poslana! Javit ćemo vam se uskoro.',
                messageFailed: 'Slanje poruke nije uspjelo. Pokušajte kasnije.',
                phoneOptional: 'Broj telefona (opcionalno)', phonePlaceholder: '(099) 123-4567',
                message: 'Poruka', messagePlaceholder: 'Vaš upit ili poruka...',
                additionalMessage: 'Dodatna poruka (opcionalno)', additionalMessagePlaceholder: 'Dodatna pitanja ili napomene...',
                private: 'Privatno ulaganje', business: 'Poslovno ulaganje',
                openInNewWindow: 'Otvori zakazivanje u novom prozoru →',
                scheduleConsult: 'Zakažite konzultacije',
                scheduleConsultDesc: 'Želite razgovor? Zakažite 30-minutne konzultacije s našim timom.',
                contactSoon: 'Kontaktirat ćemo vas u roku 24 sata o idućim koracima'
            },
            footer: {
                aboutText: 'Vaš pouzdan partner u otkrivanju i upravljanju investicijama visokog potencijala. Povezujemo vizionare s kapitalom.',
                quickLinks: 'Brzi linkovi', browseInvestments: 'Pregledaj investicije', submitOpportunity: 'Pošalji priliku',
                aboutUs: 'O nama', contactSupport: 'Kontaktiraj podršku', faq: 'Pitanja i odgovori', getInTouch: 'Kontakt',
                address: 'Put Gvozdenova 283, 22000 Šibenik, Hrvatska', email: 'E-mail', phone: 'Telefon',
                terms: 'Uvjeti korištenja', privacy: 'Politika privatnosti', rights: 'Sva prava pridržana.'
            },
            home: {
                heroTitle1: 'Uložite u', heroTitle2: 'Budućnost.', heroKicker: 'Osnažite inovacije.', heroSubtitle: 'Otkrijte pažljivo odabrane investicijske prilike u inovativnim projektima i rastućim tvrtkama. Pridružite se MegaInvestu i oblikujte sutra već danas.',
                exploreOpportunities: 'Istraži prilike', submitProject: 'Pošalji projekt',
                howItWorks: 'Kako {{brand}} funkcionira', discoverOpportunities: 'Otkrij prilike',
                investWithConfidence: 'Uloži s povjerenjem', growYourPortfolio: 'Rasti portfelj',
                discoverDesc: 'Pregledaj raznolike, provjerene projekte iz više sektora.',
                investDesc: 'Pristupi detaljnim informacijama, izvješćima dubinske analize i transparentnim uvjetima.',
                growDesc: 'Prati ulaganja, primaj ažuriranja i potencijalno ostvari značajne prinose.',
                featured: 'Izdvojene investicije', viewAll: 'Pogledaj sve', noFeatured: 'Trenutno nema izdvojenih investicija. Provjerite uskoro!',
                ctaTitle: 'Imate revolucionaran projekt?', ctaParagraph: 'MegaInvest uvijek traži inovativne projekte i perspektivna poduzeća koja traže financiranje. Ako imate viziju, želimo čuti za nju.',
                ctaButton: 'Pošaljite svoju investicijsku ideju'
            },
            submitPage: {
                pageTitle: 'Pošaljite svoju investicijsku ideju',
                pageSubtitle: 'Imate revolucionarni projekt ili obećavajuće poslovno pothvat? Podijelite svoju ideju s nama. Pružamo platformu za povezivanje vizionara poput vas s potencijalnim investitorima.',
                processTitle: 'Proces kupnje',
                step1: 'Početni razgovor i analiza potreba',
                step2: 'Pretraživanje i prezentacija potencijalnih tvrtki',
                step3: 'Procjena i analiza poslovanja',
                step4: 'Pregovori i priprema ugovora',
                step5: 'Finalizacija i pravna podrška',
                businessProcessAlt: 'Poslovni proces'
            },
            investList: {
                headerTitle: 'Investicijske prilike',
                headerSubtitle: 'Istražite raznolike provjerene investicijske projekte. Pronađite svoju sljedeću priliku i povećajte svoj portfelj s MegaInvestom.',
                searchPlaceholder: 'Pretraži po naslovu, ključnoj riječi...',
                statusAll: 'Svi statusi',
                categoryAll: 'Sve kategorije',
                sortNewest: 'Sortiraj po: Najnovije',
                sortOldest: 'Sortiraj po: Najstarije',
                sortGoalHighLow: 'Sortiraj po: Cilj (Visoko-Nisko)',
                sortGoalLowHigh: 'Sortiraj po: Cilj (Nisko-Visoko)',
                sortRaisedHighLow: 'Sortiraj po: Prikupljeno (Visoko-Nisko)',
                sortRaisedLowHigh: 'Sortiraj po: Prikupljeno (Nisko-Visoko)',
                resetFilters: 'Resetiraj filtere',
                errorTitle: 'Greška',
                errorBody: 'Nije moguće učitati investicije. Pokušajte kasnije.',
                emptyTitle: 'Nema pronađenih investicija',
                emptyBody: 'Vaši kriteriji pretrage ili filtriranja ne odgovaraju nijednoj investiciji. Pokušajte prilagoditi filtere ili provjerite kasnije.',
                clearAllFilters: 'Obriši sve filtere',
                invalidDataFormat: 'Neispravan format podataka primljen s poslužitelja.'
            },
            investCard: {
                apyRange: 'Raspon APY', term: 'Rok', category: 'Kategorija',
                raised: 'Prikupljeno', goal: 'Cilj', funded: '% financirano', viewDetails: 'Pogledaj detalje'
            },
            invDetail: {
                status: 'Status', keyInfo: 'Ključne informacije', raised: 'Prikupljeno', goal: 'Cilj', funded: '% financirano',
                estApy: 'Očekivani APY', minInvestment: 'Min. ulaganje', term: 'Rok', category: 'Kategorija',
                investNow: 'Uloži sada', fullyFunded: 'Ova investicija je u potpunosti financirana!', closed: 'Ova investicija je zatvorena.',
                about: 'O ovoj investiciji', submittedBy: 'Podnositelj', submissionDate: 'Datum podnošenja', tags: 'Oznake',
                important: 'Važne napomene', risk: 'Ulaganje nosi rizike, uključujući gubitak glavnice. Provedite vlastitu analizu prije donošenja odluka. Ove informacije nisu financijski savjet.',
                contactLink: 'Imate pitanja? Kontaktirajte nas →', backToInvestments: '← Natrag na investicije',
                loading: 'Učitavanje detalja investicije...', errorTitle: 'Greška pri učitavanju investicije', notFound: 'Investicija nije pronađena.'
            },
            about: {
                pageTitle: 'O MegaInvestu',
                headerIntro: 'MegaInvest je vodeća platforma posvećena povezivanju inovativnih projekata i poduzeća s pronicljivim investitorima. Vjerujemo u snagu kapitala za poticanje rasta, pokretanje inovacija i stvaranje trajnog utjecaja.',
                ourMission: 'Naša misija',
                missionBody: 'Naša misija je demokratizirati pristup visokokvalitetnim investicijskim prilikama i pružiti transparentnu, sigurnu i učinkovitu platformu za vlasnike projekata i investitore. Nastojimo potaknuti zajednicu izgrađenu na povjerenju, inovaciji i uzajamnom uspjehu.',
                missionBullets: {
                    b1: 'Identificirati i prikazati pothvate visokog potencijala.',
                    b2: 'Pružiti robusnu dubinsku analizu i jasne informacije.',
                    b3: 'Pojednostaviti investicijski proces.',
                    b4: 'Podržati poduzetnike u ostvarivanju njihove vizije.',
                    b5: 'Pomoći investitorima izgraditi raznolike i utjecajne portfelje.'
                },
                coreValues: 'Naše temeljne vrijednosti',
                valueInnovation: 'Inovacija',
                valueInnovationBody: 'Zagovaramo napredne ideje i prihvaćamo tehnološke napretke za kontinuirano poboljšanje naše platforme i usluga.',
                valueIntegrity: 'Integritet i transparentnost',
                valueIntegrityBody: 'Djelujemo s najvećom poštenošću i pružamo jasne, sveobuhvatne informacije za osiguravanje povjerenja i informiranog donošenja odluka.',
                valueCommunity: 'Suradnja i zajednica',
                valueCommunityBody: 'Vjerujemo u snagu partnerstva i nastojimo izgraditi snažnu, podržavajuću zajednicu poduzetnika i investitora.',
                ctaHeader: 'Spremni biti dio nečeg mega?',
                ctaBody: 'Bilo da ste investitor koji traži svoju sljedeću veliku priliku ili poduzetnik s revolucionarnom idejom, MegaInvest je vaša platforma za rast.',
                exploreInvestments: 'Istražite investicije',
                submitProject: 'Pošaljite svoj projekt',
                ourLocation: 'Naša lokacija',
                locationBody: 'Posjetite nas u našem sjedištu u Šibeniku, Hrvatska. Uvijek smo sretni susresti se s potencijalnim partnerima i investitorima.',
                missionImageAlt: 'Naša misija'
            },
            form: {
                proposeTitle: 'Predložite novu investiciju', proposeSubtitle: 'Podijelite svoj inovativni projekt s potencijalnim investitorima',
                personalInfo: 'Osobni podaci', yourFullName: 'Vaše ime i prezime *', yourEmail: 'Vaša e-mail adresa *',
                namePlaceholder: 'npr. Ana Horvat', emailPlaceholder: 'npr. ana.horvat@example.com',
                investDetails: 'Detalji investicije', investTitle: 'Naslov investicije *', category: 'Kategorija *',
                loadingCategories: 'Učitavanje kategorija...', selectCategory: 'Odaberite kategoriju',
                projectDesc: 'Opis projekta', shortDesc: 'Kratki opis (max 150 znakova) *', longDesc: 'Detaljan opis *',
                shortPlaceholder: 'Kratki pregled investicijske prilike...', longPlaceholder: 'Navedite detalje: poslovni plan, tim, tržište, financije, strategija rasta...',
                financialDetails: 'Financijski detalji', fundingGoal: 'Cilj financiranja ({{currency}}) *', currency: 'Valuta *',
                apyRange: 'Očekivani raspon APY', minInvestment: 'Minimalno ulaganje ({{currency}})', term: 'Rok ulaganja',
                additionalInfo: 'Dodatne informacije', tags: 'Oznake (odvojene zarezom)', tagsHelp: 'Dodajte ključne riječi kako bi investitori lakše pronašli projekt',
                uploadImages: 'Učitajte slike (opcionalno)',
                termsAgree: 'Slažem se s <1>Uvjetima korištenja</1> i <3>Politikom privatnosti</3> te potvrđujem da su dani podaci točni i potpuni.',
                fundingGoalPlaceholder: '50000', apyPlaceholder: '5-8%', minInvestmentPlaceholder: '1000', termPlaceholder: 'npr. 3 godine, 12 mjeseci',
                currency_USD: 'USD - Američki dolar', currency_EUR: 'EUR - Euro', currency_GBP: 'GBP - Britanska funta',
                submitBtn: 'Pošalji prijedlog investicije', submitting: 'Slanje...', reviewTime: 'Vaš prijedlog bit će pregledan u roku 2-3 radna dana',
                success: 'Investicija je uspješno poslana! Naš tim će ju pregledati.', failure: 'Slanje nije uspjelo. Pokušajte ponovno.',
                v_name_required: 'Ime je obavezno.', v_email_required: 'E-mail je obavezan.', v_email_invalid: 'E-mail adresa nije valjana.',
                v_title_required: 'Naslov je obavezan.', v_category_required: 'Kategorija je obavezna.', v_amount_positive: 'Cilj financiranja mora biti pozitivan broj.',
                v_short_required: 'Kratki opis je obavezan.', v_long_required: 'Detaljan opis je obavezan.', v_terms_required: 'Morate prihvatiti uvjete korištenja.',
                fixFormErrors: 'Ispravite pogreške u obrascu.'
            },
            seo: {
                home_title: 'MegaInvest - Premium investicijska platforma',
                home_desc: 'Otkrijte ekskluzivne investicijske prilike u nekretninama, tehnologiji i obnovljivim izvorima energije. Pridružite se vodećoj hrvatskoj platformi za provjerene projekte s visokim povratom.',
                list_title: 'Investicijske prilike - Provjereni projekti | MegaInvest',
                list_desc: 'Istražite provjerene investicije: nekretnine, tehnologija, obnovljivi izvori, startupi. Transparentni uvjeti i profesionalna provjera.',
                about_title: 'O MegaInvestu - Vodeća investicijska platforma u Hrvatskoj',
                about_desc: 'Saznajte više o misiji MegaInvesta: demokratizirati ulaganja u Hrvatskoj. Naše vrijednosti: inovacija, integritet i rast zajednice.',
                privacy_title: 'Politika privatnosti - MegaInvest | Zaštita podataka i prava',
                privacy_desc: 'Kako MegaInvest štiti vašu privatnost i osobne podatke. GDPR i prava korisnika.',
                terms_title: 'Uvjeti korištenja - MegaInvest | Pravila platforme',
                terms_desc: 'Uvjeti korištenja MegaInvest platforme: korištenje, odgovornosti, rizici ulaganja i usklađenost sa zakonima.',
                submit_title: 'Pošaljite svoju investicijsku priliku - Dobijte financiranje | MegaInvest',
                submit_desc: 'Pošaljite svoju investicijsku priliku MegaInvestu i povežite se s potencijalnim investitorima. Naša platforma pomaže poduzetnicima i tvrtkama osigurati financiranje za nekretnine, tehnologiju i projekte obnovljivih izvora energije u Hrvatskoj.'
            },
            contact: {
                getInTouch: 'Kontaktirajte nas',
                intro: 'Tu smo da pomognemo! Bilo da imate pitanje o investiciji, trebate podršku ili želite saznati više o našoj platformi, slobodno nas kontaktirajte.',
                contactInfo: 'Kontakt informacije',
                ourOffice: 'Naš ured',
                address: 'Put Gvozdenova 283, 22000 Šibenik',
                getDirections: 'Dobijte upute',
                emailUs: 'Pošaljite nam e-mail',
                callUs: 'Nazovite nas',
                officeHours: 'Radno vrijeme',
                officeHoursWeek: 'Ponedjeljak - Petak: 8:00 - 15:00',
                officeHoursWeekend: 'Subota - Nedjelja: Zatvoreno',
                companyInfo: 'Informacije o tvrtki',
                generalInquiries: 'Opći upiti', phoneHours: 'Pon - Pet, 8:00 - 15:00 (CET)',
                faqTitle: 'Često postavljana pitanja',
                faqIntro: 'Pronađite odgovore na česta pitanja o korištenju MegaInvesta, zaštiti podataka i investicijskim procesima.',
                faq: {
                    q1: { question: 'Jesu li moji investicijski podaci vidljivi drugim korisnicima?', answer: 'Ne, vaše osobne financijske informacije i detalji investicija ostaju privatni. Dijelimo samo osnovne informacije profila kada se aktivno uključujete u investicijske prilike. Osjetljivi podaci se nikad ne dijele bez pristanka.' },
                    q2: { question: 'Kako MegaInvest štiti moje osobne i financijske informacije?', answer: 'Implementiramo SSL/TLS enkripciju, enkriptirano pohranjivanje, kontrole pristupa, redovite revizije, višefaktorsku autentifikaciju i ograničen pristup zaposlenika.' },
                    q3: { question: 'Koji su rizici uključeni u korištenje ove platforme?', answer: 'Sva ulaganja nose rizike i mogu rezultirati gubitkom kapitala. MegaInvest ne pruža investicijske savjete niti jamči uspjeh. Provedite vlastitu analizu.' },
                    q4: { question: 'Rukuje li MegaInvest plaćanjima ili drži investitorska sredstva?', answer: 'Ne. Transakcije se upravljaju izravno između investitora i vlasnika projekata putem njihovih odabranih metoda i sporazuma.' },
                    q5: { question: 'Mogu li zatražiti brisanje svog računa i podataka?', answer: 'Da. Možete zatražiti brisanje prema GDPR-u, podložno zakonskim zahtjevima zadržavanja. Prenosivost podataka je dostupna prije brisanja.' },
                    q6: { question: 'Hoće li se moje osobne informacije dijeliti s trećim stranama?', answer: 'Dijelimo samo uz pristanak, s pružateljima usluga, zakonskim zahtjevima ili poslovnim prijenosima. Nikad ne prodajemo osobne podatke za marketing.' },
                    q7: { question: 'Koliko dugo se moji podaci čuvaju na platformi?', answer: 'Zadržavanje varira: informacije računa do brisanja + 7 godina, zapisi transakcija 10 godina, komunikacije 3 godine, marketing do povlačenja pristanka.' },
                    q8: { question: 'Je li MegaInvest pravno odgovoran za neuspjele investicije?', answer: 'Ne. Povezujemo investitore i vlasnike projekata, ali ne jamčimo ishode niti pružamo savjete. Odluke ostaju s investitorom.' },
                    q9: { question: 'Prenosite li moje podatke izvan EU?', answer: 'Neki prijenosi se mogu dogoditi uz odgovarajuće zaštitne mjere (SCC, odluke o adekvatnosti). Možete se usprotiviti određenim prijenosima.' },
                    q10: { question: 'Kako kontroliram postavke kolačića i praćenja?', answer: 'Kontrolirajte kolačiće putem preglednika. Osnovni kolačići su potrebni; analitički se mogu kontrolirati putem postavki. Onemogućavanje može utjecati na funkcionalnost.' }
                },
                faqCtaTitle: 'Još uvijek imate pitanja?',
                faqCtaBody: 'Ne možete pronaći odgovor koji tražite? Naš tim za podršku je tu da pomogne.',
                contactEmail: 'info@mega-invest.hr'
            },
            cookie: {
                title: 'Cijenimo vašu privatnost',
                description: 'Koristimo kolačiće za poboljšanje vašeg iskustva i analizu prometa na stranici. Možete upravljati svojim postavkama ili saznati više u našoj',
                privacyPolicy: 'Politici privatnosti',
                acceptAll: 'Prihvati sve',
                rejectAll: 'Odbaci sve',
                managePreferences: 'Upravljaj postavkama',
                processing: 'Obrađuje se...',
                preferencesTitle: 'Postavke kolačića',
                preferencesDescription: 'Odaberite koje kolačiće želite prihvatiti. Možete promijeniti ove postavke u bilo kojem trenutku.',
                required: 'Potrebno',
                alwaysActive: 'Uvijek aktivno',
                cancel: 'Odustani',
                savePreferences: 'Spremi postavke',
                saving: 'Sprema se...'
            }
        }
    },
    de: {
        translation: {
            nav: {
                home: 'Startseite', investments: 'Investitionen', submitInvestment: 'Investition einreichen',
                about: 'Über uns', contact: 'Kontakt', adminLogin: 'Admin-Anmeldung', openMenu: 'Hauptmenü öffnen'
            },
            common: {
                viewDetails: 'Details ansehen', loading: 'Wird geladen...', error: 'Fehler', back: 'Zurück',
                cancel: 'Abbrechen', save: 'Speichern', submit: 'Senden', investNow: 'Jetzt investieren',
                fullyFunded: 'Diese Investition ist vollständig finanziert!', closed: 'Diese Investition ist geschlossen.'
            },
            footer: {
                aboutText: 'Ihr vertrauenswürdiger Partner für hochpotenzielle Investitionen. Wir verbinden Visionäre mit Kapital.',
                quickLinks: 'Schnellzugriff', browseInvestments: 'Investitionen durchsuchen', submitOpportunity: 'Möglichkeit einreichen',
                aboutUs: 'Über uns', contactSupport: 'Support kontaktieren', faq: 'FAQ', getInTouch: 'Kontakt',
                address: 'Put Gvozdenova 283, 22000 Šibenik, Kroatien', email: 'E-Mail', phone: 'Telefon',
                terms: 'Nutzungsbedingungen', privacy: 'Datenschutz', rights: 'Alle Rechte vorbehalten.'
            },
            home: {
                heroTitle1: 'Investieren in die', heroTitle2: 'Zukunft.', heroSubtitle: 'Entdecken Sie kuratierte Investitionsmöglichkeiten in bahnbrechende Projekte und wachsende Unternehmen. Gestalten Sie die Zukunft mit MegaInvest.',
                exploreOpportunities: 'Möglichkeiten erkunden', submitProject: 'Projekt einreichen',
                howItWorks: 'So funktioniert {{brand}}', discoverOpportunities: 'Möglichkeiten entdecken',
                investWithConfidence: 'Mit Vertrauen investieren', growYourPortfolio: 'Portfolio ausbauen',
                discoverDesc: 'Durchsuchen Sie geprüfte Projekte aus verschiedenen Branchen.',
                investDesc: 'Greifen Sie auf Detailinfos, Due-Diligence-Reports und transparente Bedingungen zu.',
                growDesc: 'Verfolgen Sie Investitionen, erhalten Sie Updates und profitieren Sie von Renditen.',
                featured: 'Ausgewählte Investitionen', viewAll: 'Alle ansehen', noFeatured: 'Zurzeit keine ausgewählten Investitionen. Bald wieder vorbeischauen!',
                ctaTitle: 'Haben Sie ein bahnbrechendes Projekt?', ctaParagraph: 'MegaInvest sucht stets innovative Projekte und vielversprechende Unternehmen. Teilen Sie Ihre Vision mit uns.',
                ctaButton: 'Ihre Investment-Idee einreichen'
            },
            submitPage: {
                pageTitle: 'Reichen Sie Ihre Investment-Idee ein',
                pageSubtitle: 'Haben Sie ein bahnbrechendes Projekt oder ein vielversprechendes Geschäftsvorhaben? Teilen Sie Ihre Idee mit uns. Wir bieten eine Plattform, um Visionäre wie Sie mit potenziellen Investoren zu verbinden.',
                processTitle: 'Kaufprozess',
                step1: 'Erstgespräch und Bedarfsanalyse',
                step2: 'Suche und Präsentation potenzieller Unternehmen',
                step3: 'Geschäftsbewertung und -analyse',
                step4: 'Verhandlungen und Vertragsvorbereitung',
                step5: 'Finalisierung und rechtliche Unterstützung',
                businessProcessAlt: 'Geschäftsprozess'
            },
            investList: {
                headerTitle: 'Investitionsmöglichkeiten',
                headerSubtitle: 'Entdecken Sie eine vielfältige Auswahl geprüfter Investitionsprojekte. Finden Sie Ihre nächste Gelegenheit und erweitern Sie Ihr Portfolio mit MegaInvest.',
                searchPlaceholder: 'Nach Titel, Stichwort suchen...',
                statusAll: 'Alle Status',
                categoryAll: 'Alle Kategorien',
                sortNewest: 'Sortieren nach: Neueste',
                sortOldest: 'Sortieren nach: Älteste',
                sortGoalHighLow: 'Sortieren nach: Ziel (Hoch-Niedrig)',
                sortGoalLowHigh: 'Sortieren nach: Ziel (Niedrig-Hoch)',
                sortRaisedHighLow: 'Sortieren nach: Eingesammelt (Hoch-Niedrig)',
                sortRaisedLowHigh: 'Sortieren nach: Eingesammelt (Niedrig-Hoch)',
                resetFilters: 'Filter zurücksetzen',
                errorTitle: 'Fehler',
                errorBody: 'Investitionen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.',
                emptyTitle: 'Keine Investitionen gefunden',
                emptyBody: 'Ihre Such- oder Filterkriterien entsprechen keinen Investitionen. Versuchen Sie, Ihre Filter anzupassen oder schauen Sie später wieder vorbei.',
                clearAllFilters: 'Alle Filter löschen',
                invalidDataFormat: 'Ungültiges Datenformat vom Server erhalten.'
            },
            investCard: {
                apyRange: 'APY-Bereich', term: 'Laufzeit', category: 'Kategorie',
                raised: 'Eingesammelt', goal: 'Ziel', funded: '% finanziert', viewDetails: 'Details ansehen'
            },
            invDetail: {
                status: 'Status', keyInfo: 'Wichtige Informationen', raised: 'Eingesammelt', goal: 'Ziel', funded: '% finanziert',
                estApy: 'Erw. APY', minInvestment: 'Mindestanlage', term: 'Laufzeit', category: 'Kategorie',
                investNow: 'Jetzt investieren', fullyFunded: 'Diese Investition ist vollständig finanziert!', closed: 'Diese Investition ist geschlossen.',
                about: 'Über diese Investition', submittedBy: 'Eingereicht von', submissionDate: 'Einreichungsdatum', tags: 'Tags',
                important: 'Wichtige Hinweise', risk: 'Investieren ist mit Risiken verbunden, einschließlich Kapitalverlust. Führen Sie eigene Recherchen durch. Keine Finanzberatung.',
                contactLink: 'Fragen? Kontaktieren Sie uns →', backToInvestments: '← Zurück zu Investitionen',
                loading: 'Lade Investitionsdetails...', errorTitle: 'Fehler beim Laden', notFound: 'Investition nicht gefunden.'
            },
            about: {
                pageTitle: 'Über MegaInvest',
                headerIntro: 'MegaInvest ist eine führende Plattform, die sich der Verbindung innovativer Projekte und Unternehmen mit anspruchsvollen Investoren widmet. Wir glauben an die Kraft des Kapitals, Wachstum zu fördern, Innovation voranzutreiben und nachhaltigen Einfluss zu schaffen.',
                ourMission: 'Unsere Mission',
                missionBody: 'Unsere Mission ist es, den Zugang zu hochwertigen Investitionsmöglichkeiten zu demokratisieren und eine transparente, sichere und effiziente Plattform für Projektinhaber und Investoren zu bieten. Wir streben danach, eine Gemeinschaft zu fördern, die auf Vertrauen, Innovation und gegenseitigem Erfolg basiert.',
                missionBullets: {
                    b1: 'Hochpotenzielle Unternehmen zu identifizieren und zu präsentieren.',
                    b2: 'Robuste Due Diligence und klare Informationen zu bieten.',
                    b3: 'Den Investitionsprozess zu vereinfachen.',
                    b4: 'Unternehmer bei der Verwirklichung ihrer Vision zu unterstützen.',
                    b5: 'Investoren beim Aufbau diverser und wirkungsvoller Portfolios zu helfen.'
                },
                coreValues: 'Unsere Grundwerte',
                valueInnovation: 'Innovation',
                valueInnovationBody: 'Wir fördern zukunftsorientierte Ideen und nutzen technologische Fortschritte, um unsere Plattform und Dienstleistungen kontinuierlich zu verbessern.',
                valueIntegrity: 'Integrität & Transparenz',
                valueIntegrityBody: 'Wir handeln mit größter Ehrlichkeit und bieten klare, umfassende Informationen, um Vertrauen und informierte Entscheidungsfindung zu gewährleisten.',
                valueCommunity: 'Zusammenarbeit & Gemeinschaft',
                valueCommunityBody: 'Wir glauben an die Kraft der Partnerschaft und streben danach, eine starke, unterstützende Gemeinschaft von Unternehmern und Investoren aufzubauen.',
                ctaHeader: 'Bereit, Teil von etwas Großartigem zu sein?',
                ctaBody: 'Ob Sie ein Investor sind, der nach seiner nächsten großen Gelegenheit sucht, oder ein Unternehmer mit einer bahnbrechenden Idee - MegaInvest ist Ihre Plattform für Wachstum.',
                exploreInvestments: 'Investitionen erkunden',
                submitProject: 'Ihr Projekt einreichen',
                ourLocation: 'Unser Standort',
                locationBody: 'Besuchen Sie uns in unserem Hauptsitz in Šibenik, Kroatien. Wir freuen uns immer, potenzielle Partner und Investoren zu treffen.',
                missionImageAlt: 'Unsere Mission'
            },
            form: {
                proposeTitle: 'Neue Investition vorschlagen', proposeSubtitle: 'Teilen Sie Ihr innovatives Projekt mit potenziellen Investoren',
                personalInfo: 'Persönliche Daten', yourFullName: 'Ihr vollständiger Name *', yourEmail: 'Ihre E-Mail-Adresse *',
                namePlaceholder: 'z. B. Max Mustermann', emailPlaceholder: 'z. B. max.mustermann@example.com',
                investDetails: 'Investitionsdetails', investTitle: 'Titel der Investition *', category: 'Kategorie *',
                loadingCategories: 'Kategorien werden geladen...', selectCategory: 'Kategorie auswählen',
                projectDesc: 'Projektbeschreibung', shortDesc: 'Kurze Beschreibung (max. 150 Zeichen) *', longDesc: 'Ausführliche Beschreibung *',
                shortPlaceholder: 'Kurzer Überblick über die Investitionsmöglichkeit...', longPlaceholder: 'Ausführliche Details: Geschäftsplan, Team, Markt, Finanzen, Strategie...',
                financialDetails: 'Finanzdetails', fundingGoal: 'Finanzierungsziel ({{currency}}) *', currency: 'Währung *',
                apyRange: 'Erwarteter APY-Bereich', minInvestment: 'Mindestanlage ({{currency}})', term: 'Anlagedauer',
                fundingGoalPlaceholder: '50000', apyPlaceholder: '5-8%', minInvestmentPlaceholder: '1000', termPlaceholder: 'z. B. 3 Jahre, 12 Monate',
                currency_USD: 'USD - US‑Dollar', currency_EUR: 'EUR - Euro', currency_GBP: 'GBP - Britisches Pfund',
                additionalInfo: 'Zusätzliche Informationen', tags: 'Tags (durch Komma getrennt)', tagsHelp: 'Fügen Sie Schlüsselwörter hinzu, um Ihr Projekt auffindbar zu machen',
                uploadImages: 'Bilder hochladen (optional)',
                termsAgree: 'Ich stimme den <1>Nutzungsbedingungen</1> und der <3>Datenschutzrichtlinie</3> zu und bestätige die Richtigkeit der Angaben.',
                submitBtn: 'Investitionsvorschlag einreichen', submitting: 'Wird gesendet...', reviewTime: 'Ihr Vorschlag wird innerhalb von 2–3 Werktagen geprüft',
                success: 'Investition erfolgreich eingereicht! Unser Team prüft sie.', failure: 'Einreichung fehlgeschlagen. Bitte erneut versuchen.',
                v_name_required: 'Name ist erforderlich.', v_email_required: 'E-Mail ist erforderlich.', v_email_invalid: 'E-Mail-Adresse ist ungültig.',
                v_title_required: 'Titel ist erforderlich.', v_category_required: 'Kategorie ist erforderlich.', v_amount_positive: 'Finanzierungsziel muss positiv sein.',
                v_short_required: 'Kurze Beschreibung ist erforderlich.', v_long_required: 'Ausführliche Beschreibung ist erforderlich.', v_terms_required: 'Sie müssen den Bedingungen zustimmen.',
                fixFormErrors: 'Bitte korrigieren Sie die Fehler im Formular.'
            },
            seo: {
                home_title: 'MegaInvest - Premium-Investitionsplattform',
                home_desc: 'Entdecken Sie exklusive Investitionsmöglichkeiten in Immobilien, Technologie und erneuerbaren Energien. Kroatiens führende Plattform für geprüfte Projekte mit hoher Rendite.',
                list_title: 'Investitionsmöglichkeiten - Geprüfte Projekte | MegaInvest',
                list_desc: 'Entdecken Sie geprüfte Investitionen: Immobilien, Technologie, erneuerbare Energien, Startups. Transparente Bedingungen, professionelle Prüfung.',
                about_title: 'Über MegaInvest - Kroatiens führende Investitionsplattform',
                about_desc: 'Erfahren Sie mehr über die Mission von MegaInvest: Investitionen demokratisieren. Werte: Innovation, Integrität, Gemeinschaft.',
                privacy_title: 'Datenschutz - MegaInvest | Datenschutz & Rechte',
                privacy_desc: 'Wie MegaInvest Ihre Privatsphäre und Daten schützt. DSGVO-konform.',
                terms_title: 'Nutzungsbedingungen - MegaInvest | Rechtliche Bedingungen',
                terms_desc: 'Nutzungsbedingungen der MegaInvest-Plattform: Nutzung, Pflichten, Risiken, Compliance.',
                submit_title: 'Reichen Sie Ihre Investitionsmöglichkeit ein - Finanzierung erhalten | MegaInvest',
                submit_desc: 'Reichen Sie Ihre Investitionsmöglichkeit bei MegaInvest ein und verbinden Sie sich mit potenziellen Investoren. Unsere Plattform hilft Unternehmern und Unternehmen, Finanzierung für Immobilien-, Technologie- und erneuerbare Energieprojekte in Kroatien zu sichern.'
            },
            contact: {
                getInTouch: 'Kontakt aufnehmen',
                intro: 'Wir sind hier, um zu helfen! Ob Sie eine Frage zu einer Investition haben, Unterstützung benötigen oder mehr über unsere Plattform erfahren möchten, zögern Sie nicht, uns zu kontaktieren.',
                contactInfo: 'Kontaktinformationen',
                ourOffice: 'Unser Büro',
                address: 'Put Gvozdenova 283, 22000 Šibenik',
                getDirections: 'Wegbeschreibung',
                emailUs: 'E-Mail senden',
                callUs: 'Anrufen',
                officeHours: 'Bürozeiten',
                officeHoursWeek: 'Montag - Freitag: 8:00 - 15:00',
                officeHoursWeekend: 'Samstag - Sonntag: Geschlossen',
                companyInfo: 'Unternehmensinformationen',
                generalInquiries: 'Allgemeine Anfragen', phoneHours: 'Mo - Fr, 8:00 - 15:00 (CET)',
                faqTitle: 'Häufig gestellte Fragen',
                faqIntro: 'Finden Sie Antworten auf häufige Fragen zur Nutzung von MegaInvest, Datenschutz und Investitionsprozessen.',
                faq: {
                    q1: { question: 'Sind meine Investitionsdaten für andere Nutzer sichtbar?', answer: 'Nein, Ihre persönlichen Finanzinformationen und Investitionsdetails bleiben privat. Wir teilen nur grundlegende Profilinformationen, wenn Sie sich aktiv an Investitionsmöglichkeiten beteiligen. Sensible Daten werden niemals ohne Zustimmung geteilt.' },
                    q2: { question: 'Wie schützt MegaInvest meine persönlichen und finanziellen Informationen?', answer: 'Wir implementieren SSL/TLS-Verschlüsselung, verschlüsselte Speicherung, Zugriffskontrollen, regelmäßige Audits, Multi-Faktor-Authentifizierung und begrenzten Mitarbeiterzugang.' },
                    q3: { question: 'Welche Risiken sind mit der Nutzung dieser Plattform verbunden?', answer: 'Alle Investitionen bergen Risiken und können zu Kapitalverlusten führen. MegaInvest bietet keine Anlageberatung und garantiert keinen Erfolg. Führen Sie eigene Due Diligence durch.' },
                    q4: { question: 'Verarbeitet MegaInvest Zahlungen oder hält Investorengelder?', answer: 'Nein. Transaktionen werden direkt zwischen Investoren und Projektinhabern über ihre gewählten Methoden und Vereinbarungen abgewickelt.' },
                    q5: { question: 'Kann ich die Löschung meines Kontos und meiner Daten beantragen?', answer: 'Ja. Sie können eine Löschung gemäß DSGVO beantragen, vorbehaltlich gesetzlicher Aufbewahrungsanforderungen. Datenportabilität ist vor der Löschung verfügbar.' },
                    q6: { question: 'Werden meine persönlichen Informationen an Dritte weitergegeben?', answer: 'Wir teilen nur mit Zustimmung, mit Dienstleistern, gesetzlichen Anforderungen oder Geschäftsübertragungen. Wir verkaufen niemals persönliche Daten für Marketing.' },
                    q7: { question: 'Wie lange werden meine Daten auf der Plattform gespeichert?', answer: 'Aufbewahrung variiert: Kontoinformationen bis Löschung + 7 Jahre, Transaktionsaufzeichnungen 10 Jahre, Kommunikation 3 Jahre, Marketing bis Widerruf der Zustimmung.' },
                    q8: { question: 'Ist MegaInvest rechtlich verantwortlich für gescheiterte Investitionen?', answer: 'Nein. Wir verbinden Investoren und Projektinhaber, garantieren aber keine Ergebnisse und bieten keine Beratung. Entscheidungen bleiben beim Investor.' },
                    q9: { question: 'Übertragen Sie meine Daten außerhalb der EU?', answer: 'Einige Übertragungen können mit angemessenen Schutzmaßnahmen (SCCs, Angemessenheitsbeschlüsse) erfolgen. Sie können bestimmten Übertragungen widersprechen.' },
                    q10: { question: 'Wie kontrolliere ich Cookie- und Tracking-Einstellungen?', answer: 'Kontrollieren Sie Cookies über Ihren Browser. Wesentliche Cookies sind erforderlich; Analyse-Cookies können über Einstellungen kontrolliert werden. Deaktivierung kann die Funktionalität beeinträchtigen.' }
                },
                faqCtaTitle: 'Haben Sie noch Fragen?',
                faqCtaBody: 'Können Sie die gesuchte Antwort nicht finden? Unser Support-Team ist da, um zu helfen.',
                contactEmail: 'info@mega-invest.hr'
            },
            cookie: {
                title: 'Wir schätzen Ihre Privatsphäre',
                description: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und den Website-Traffic zu analysieren. Sie können Ihre Einstellungen verwalten oder mehr erfahren in unserer',
                privacyPolicy: 'Datenschutzrichtlinie',
                acceptAll: 'Alle akzeptieren',
                rejectAll: 'Alle ablehnen',
                managePreferences: 'Einstellungen verwalten',
                processing: 'Wird verarbeitet...',
                preferencesTitle: 'Cookie-Einstellungen',
                preferencesDescription: 'Wählen Sie, welche Cookies Sie akzeptieren möchten. Sie können diese Einstellungen jederzeit ändern.',
                required: 'Erforderlich',
                alwaysActive: 'Immer aktiv',
                cancel: 'Abbrechen',
                savePreferences: 'Einstellungen speichern',
                saving: 'Wird gespeichert...'
            }
        }
    },
    fr: {
        translation: {
            nav: {
                home: 'Accueil', investments: 'Investissements', submitInvestment: "Soumettre l'investissement",
                about: 'À propos', contact: 'Contact', adminLogin: 'Connexion admin', openMenu: 'Ouvrir le menu principal'
            },
            common: {
                viewDetails: 'Voir les détails', loading: 'Chargement...', error: 'Erreur', back: 'Retour',
                cancel: 'Annuler', save: 'Enregistrer', submit: 'Envoyer', investNow: 'Investir maintenant',
                fullyFunded: 'Cet investissement est entièrement financé !', closed: 'Cet investissement est clôturé.'
            },
            footer: {
                aboutText: 'Votre partenaire de confiance pour découvrir et gérer des investissements à fort potentiel. Nous relions les visionnaires au capital.',
                quickLinks: 'Liens utiles', browseInvestments: 'Parcourir les investissements', submitOpportunity: 'Soumettre une opportunité',
                aboutUs: 'À propos', contactSupport: 'Contacter le support', faq: 'FAQ', getInTouch: 'Contact',
                address: 'Put Gvozdenova 283, 22000 Šibenik, Croatie', email: 'E-mail', phone: 'Téléphone',
                terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité', rights: 'Tous droits réservés.'
            },
            home: {
                heroTitle1: 'Investir dans le', heroTitle2: 'Futur.', heroSubtitle: 'Découvrez des opportunités d’investissement sélectionnées dans des projets innovants et des entreprises en croissance. Façonnez demain avec MegaInvest.',
                exploreOpportunities: 'Explorer les opportunités', submitProject: 'Soumettre votre projet',
                howItWorks: 'Comment fonctionne {{brand}}', discoverOpportunities: 'Découvrir les opportunités',
                investWithConfidence: 'Investir en toute confiance', growYourPortfolio: 'Développer votre portefeuille',
                discoverDesc: 'Parcourez des projets vérifiés dans divers secteurs.',
                investDesc: 'Accédez aux informations détaillées, rapports de diligence et conditions transparentes.',
                growDesc: 'Suivez vos investissements, recevez des mises à jour et obtenez des rendements.',
                featured: 'Investissements à la une', viewAll: 'Tout voir', noFeatured: 'Aucun investissement à la une pour le moment. Revenez bientôt !',
                ctaTitle: 'Un projet révolutionnaire ?', ctaParagraph: 'MegaInvest recherche des projets innovants et des entreprises prometteuses. Partagez votre vision.',
                ctaButton: "Soumettre votre idée d'investissement"
            },
            submitPage: {
                pageTitle: "Soumettez votre idée d'investissement",
                pageSubtitle: 'Avez-vous un projet révolutionnaire ou une entreprise prometteuse ? Partagez votre idée avec nous. Nous offrons une plateforme pour connecter des visionnaires comme vous avec des investisseurs potentiels.',
                processTitle: "Processus d'achat",
                step1: 'Discussion initiale et analyse des besoins',
                step2: 'Recherche et présentation d\'entreprises potentielles',
                step3: 'Évaluation et analyse commerciale',
                step4: 'Négociations et préparation de contrat',
                step5: 'Finalisation et support juridique',
                businessProcessAlt: 'Processus commercial'
            },
            investList: {
                headerTitle: "Opportunités d'investissement",
                headerSubtitle: 'Explorez une gamme diversifiée de projets d\'investissement vérifiés. Trouvez votre prochaine opportunité et développez votre portefeuille avec MegaInvest.',
                searchPlaceholder: 'Rechercher par titre, mot-clé...',
                statusAll: 'Tous les statuts',
                categoryAll: 'Toutes les catégories',
                sortNewest: 'Trier par : Plus récent',
                sortOldest: 'Trier par : Plus ancien',
                sortGoalHighLow: 'Trier par : Objectif (Élevé-Bas)',
                sortGoalLowHigh: 'Trier par : Objectif (Bas-Élevé)',
                sortRaisedHighLow: 'Trier par : Collecté (Élevé-Bas)',
                sortRaisedLowHigh: 'Trier par : Collecté (Bas-Élevé)',
                resetFilters: 'Réinitialiser les filtres',
                errorTitle: 'Erreur',
                errorBody: 'Impossible de charger les investissements. Veuillez réessayer plus tard.',
                emptyTitle: 'Aucun investissement trouvé',
                emptyBody: 'Vos critères de recherche ou de filtre ne correspondent à aucun investissement. Essayez d\'ajuster vos filtres ou revenez plus tard.',
                clearAllFilters: 'Effacer tous les filtres',
                invalidDataFormat: 'Format de données invalide reçu du serveur.'
            },
            investCard: {
                apyRange: 'Plage APY', term: 'Durée', category: 'Catégorie',
                raised: 'Collecté', goal: 'Objectif', funded: '% financé', viewDetails: 'Voir les détails'
            },
            invDetail: {
                status: 'Statut', keyInfo: 'Informations clés', raised: 'Collecté', goal: 'Objectif', funded: '% financé',
                estApy: 'APY estimé', minInvestment: "Investissement min.", term: 'Durée', category: 'Catégorie',
                investNow: 'Investir maintenant', fullyFunded: 'Cet investissement est entièrement financé !', closed: 'Cet investissement est clôturé.',
                about: 'À propos de cet investissement', submittedBy: 'Soumis par', submissionDate: 'Date de soumission', tags: 'Tags',
                important: 'Considérations importantes', risk: 'L’investissement comporte des risques, y compris la perte du capital. Faites vos propres recherches. Ceci ne constitue pas un conseil financier.',
                contactLink: 'Des questions ? Contactez-nous →', backToInvestments: '← Retour aux investissements',
                loading: "Chargement des détails de l'investissement...", errorTitle: "Erreur lors du chargement", notFound: "Investissement introuvable."
            },
            about: {
                pageTitle: 'À propos de MegaInvest',
                headerIntro: 'MegaInvest est une plateforme de premier plan dédiée à la connexion de projets innovants et d\'entreprises avec des investisseurs avisés. Nous croyons au pouvoir du capital pour alimenter la croissance, stimuler l\'innovation et créer un impact durable.',
                ourMission: 'Notre mission',
                missionBody: 'Notre mission est de démocratiser l\'accès aux opportunités d\'investissement de haute qualité et de fournir une plateforme transparente, sécurisée et efficace pour les propriétaires de projets et les investisseurs. Nous nous efforçons de favoriser une communauté basée sur la confiance, l\'innovation et le succès mutuel.',
                missionBullets: {
                    b1: 'Identifier et présenter des entreprises à fort potentiel.',
                    b2: 'Fournir une due diligence robuste et des informations claires.',
                    b3: 'Simplifier le processus d\'investissement.',
                    b4: 'Soutenir les entrepreneurs dans la réalisation de leur vision.',
                    b5: 'Aider les investisseurs à construire des portefeuilles diversifiés et impactants.'
                },
                coreValues: 'Nos valeurs fondamentales',
                valueInnovation: 'Innovation',
                valueInnovationBody: 'Nous défendons les idées avant-gardistes et adoptons les avancées technologiques pour améliorer continuellement notre plateforme et nos services.',
                valueIntegrity: 'Intégrité et transparence',
                valueIntegrityBody: 'Nous opérons avec la plus grande honnêteté et fournissons des informations claires et complètes pour assurer la confiance et la prise de décision éclairée.',
                valueCommunity: 'Collaboration et communauté',
                valueCommunityBody: 'Nous croyons au pouvoir du partenariat et visons à construire une communauté forte et solidaire d\'entrepreneurs et d\'investisseurs.',
                ctaHeader: 'Prêt à faire partie de quelque chose de méga ?',
                ctaBody: 'Que vous soyez un investisseur à la recherche de votre prochaine grande opportunité ou un entrepreneur avec une idée révolutionnaire, MegaInvest est votre plateforme de croissance.',
                exploreInvestments: 'Explorer les investissements',
                submitProject: 'Soumettre votre projet',
                ourLocation: 'Notre emplacement',
                locationBody: 'Visitez-nous à notre siège social à Šibenik, en Croatie. Nous sommes toujours heureux de rencontrer des partenaires et investisseurs potentiels.',
                missionImageAlt: 'Notre mission'
            },
            form: {
                proposeTitle: 'Proposer un nouvel investissement', proposeSubtitle: 'Partagez votre projet innovant avec des investisseurs',
                personalInfo: 'Informations personnelles', yourFullName: 'Votre nom complet *', yourEmail: 'Votre adresse e-mail *',
                namePlaceholder: 'Ex. Jeanne Dupont', emailPlaceholder: 'Ex. jeanne.dupont@example.com',
                investDetails: "Détails de l'investissement", investTitle: "Titre de l'investissement *", category: 'Catégorie *',
                loadingCategories: 'Chargement des catégories...', selectCategory: 'Sélectionner une catégorie',
                projectDesc: 'Description du projet', shortDesc: 'Description courte (150 caractères max) *', longDesc: 'Description détaillée *',
                shortPlaceholder: "Bref aperçu de l'opportunité d'investissement...", longPlaceholder: 'Détails : plan d’affaires, équipe, marché, finances, stratégie de croissance...',
                financialDetails: 'Détails financiers', fundingGoal: 'Objectif de financement ({{currency}}) *', currency: 'Devise *',
                apyRange: 'Plage APY prévue', minInvestment: "Investissement minimum ({{currency}})", term: 'Durée de l’investissement',
                additionalInfo: 'Informations complémentaires', tags: 'Tags (séparés par des virgules)', tagsHelp: 'Ajoutez des mots-clés pour améliorer la découverte du projet',
                uploadImages: 'Téléverser des images (optionnel)',
                termsAgree: "J'accepte les <1>Conditions d'utilisation</1> et la <3>Politique de confidentialité</3> et confirme l'exactitude des informations fournies.",
                submitBtn: "Soumettre la proposition d'investissement", submitting: 'Envoi...', reviewTime: 'Votre proposition sera examinée sous 2 à 3 jours ouvrés',
                success: "Investissement soumis avec succès ! Notre équipe l'examinera.", failure: "Échec de l'envoi. Veuillez réessayer.",
                v_name_required: 'Le nom est requis.', v_email_required: "L'e-mail est requis.", v_email_invalid: "L'adresse e-mail est invalide.",
                v_title_required: 'Le titre est requis.', v_category_required: 'La catégorie est requise.', v_amount_positive: 'Le montant doit être positif.',
                v_short_required: 'La description courte est requise.', v_long_required: 'La description détaillée est requise.', v_terms_required: 'Vous devez accepter les conditions.',
                fixFormErrors: 'Veuillez corriger les erreurs du formulaire.'
            },
            seo: {
                home_title: 'MegaInvest - Plateforme d’investissement premium',
                home_desc: 'Découvrez des opportunités exclusives dans l’immobilier, la technologie et les énergies renouvelables. Plateforme croate leader pour des projets vérifiés.',
                list_title: 'Opportunités d’investissement - Projets vérifiés | MegaInvest',
                list_desc: 'Explorez des investissements vérifiés : immobilier, technologie, énergies renouvelables, startups.',
                about_title: 'À propos de MegaInvest - Plateforme leader en Croatie',
                about_desc: 'Notre mission : démocratiser l’investissement en Croatie. Valeurs : innovation, intégrité, communauté.',
                privacy_title: 'Politique de confidentialité - MegaInvest | Données & droits',
                privacy_desc: 'Comment nous protégeons vos données personnelles. Conforme RGPD.',
                terms_title: "Conditions d'utilisation - MegaInvest | Mentions légales",
                terms_desc: 'Conditions de la plateforme MegaInvest : usage, responsabilités, risques, conformité.',
                submit_title: "Soumettez votre opportunité d'investissement - Obtenez un financement | MegaInvest",
                submit_desc: "Soumettez votre opportunité d'investissement à MegaInvest et connectez-vous avec des investisseurs potentiels. Notre plateforme aide les entrepreneurs et les entreprises à sécuriser le financement pour des projets immobiliers, technologiques et d'énergies renouvelables en Croatie."
            },
            contact: {
                getInTouch: 'Contactez-nous',
                intro: 'Nous sommes là pour vous aider ! Que vous ayez une question sur un investissement, besoin de support, ou souhaitiez en savoir plus sur notre plateforme, n\'hésitez pas à nous contacter.',
                contactInfo: 'Informations de contact',
                ourOffice: 'Notre bureau',
                address: 'Put Gvozdenova 283, 22000 Šibenik',
                getDirections: 'Obtenir les directions',
                emailUs: 'Nous envoyer un e-mail',
                callUs: 'Nous appeler',
                officeHours: 'Heures de bureau',
                officeHoursWeek: 'Lundi - Vendredi : 8h00 - 15h00',
                officeHoursWeekend: 'Samedi - Dimanche : Fermé',
                companyInfo: 'Informations sur l\'entreprise',
                generalInquiries: 'Demandes générales', phoneHours: 'Lun - Ven, 8h00 - 15h00 (CET)',
                faqTitle: 'Questions fréquemment posées',
                faqIntro: 'Trouvez des réponses aux questions courantes sur l\'utilisation de MegaInvest, la protection des données et les processus d\'investissement.',
                faq: {
                    q1: { question: 'Mes données d\'investissement sont-elles visibles par d\'autres utilisateurs ?', answer: 'Non, vos informations financières personnelles et détails d\'investissement restent privés. Nous ne partageons que les informations de profil de base lorsque vous vous engagez activement dans des opportunités d\'investissement. Les données sensibles ne sont jamais partagées sans consentement.' },
                    q2: { question: 'Comment MegaInvest protège-t-il mes informations personnelles et financières ?', answer: 'Nous implémentons le chiffrement SSL/TLS, le stockage chiffré, les contrôles d\'accès, les audits réguliers, l\'authentification multi-facteurs et l\'accès limité des employés.' },
                    q3: { question: 'Quels sont les risques liés à l\'utilisation de cette plateforme ?', answer: 'Tous les investissements comportent des risques et peuvent entraîner une perte de capital. MegaInvest ne fournit pas de conseils d\'investissement ni ne garantit le succès. Effectuez votre propre diligence raisonnable.' },
                    q4: { question: 'MegaInvest gère-t-il les paiements ou détient-il les fonds des investisseurs ?', answer: 'Non. Les transactions sont gérées directement entre investisseurs et propriétaires de projets via leurs méthodes et accords choisis.' },
                    q5: { question: 'Puis-je demander la suppression de mon compte et de mes données ?', answer: 'Oui. Vous pouvez demander la suppression selon le RGPD, sous réserve des exigences légales de conservation. La portabilité des données est disponible avant suppression.' },
                    q6: { question: 'Mes informations personnelles seront-elles partagées avec des tiers ?', answer: 'Nous ne partageons qu\'avec consentement, avec les fournisseurs de services, les exigences légales ou les transferts d\'entreprise. Nous ne vendons jamais de données personnelles pour le marketing.' },
                    q7: { question: 'Combien de temps mes données sont-elles stockées sur la plateforme ?', answer: 'La conservation varie : informations de compte jusqu\'à suppression + 7 ans, enregistrements de transaction 10 ans, communications 3 ans, marketing jusqu\'au retrait du consentement.' },
                    q8: { question: 'MegaInvest est-il légalement responsable des investissements échoués ?', answer: 'Non. Nous connectons investisseurs et propriétaires de projets mais ne garantissons pas les résultats ni ne fournissons de conseils. Les décisions restent avec l\'investisseur.' },
                    q9: { question: 'Transférez-vous mes données en dehors de l\'UE ?', answer: 'Certains transferts peuvent se produire avec des garanties appropriées (CCC, décisions d\'adéquation). Vous pouvez vous opposer à certains transferts.' },
                    q10: { question: 'Comment contrôler les paramètres de cookies et de suivi ?', answer: 'Contrôlez les cookies via votre navigateur. Les cookies essentiels sont requis ; les cookies analytiques peuvent être contrôlés via les préférences. La désactivation peut affecter la fonctionnalité.' }
                },
                faqCtaTitle: 'Vous avez encore des questions ?',
                faqCtaBody: 'Vous ne trouvez pas la réponse que vous cherchez ? Notre équipe de support est là pour vous aider.',
                contactEmail: 'info@mega-invest.hr'
            },
            cookie: {
                title: 'Nous respectons votre vie privée',
                description: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site. Vous pouvez gérer vos préférences ou en savoir plus dans notre',
                privacyPolicy: 'Politique de confidentialité',
                acceptAll: 'Tout accepter',
                rejectAll: 'Tout rejeter',
                managePreferences: 'Gérer les préférences',
                processing: 'Traitement en cours...',
                preferencesTitle: 'Préférences des cookies',
                preferencesDescription: 'Choisissez quels cookies vous souhaitez accepter. Vous pouvez modifier ces paramètres à tout moment.',
                required: 'Requis',
                alwaysActive: 'Toujours actif',
                cancel: 'Annuler',
                savePreferences: 'Enregistrer les préférences',
                saving: 'Enregistrement...'
            }
        }
    },
    it: {
        translation: {
            nav: {
                home: 'Home', investments: 'Investimenti', submitInvestment: 'Invia investimento',
                about: 'Chi siamo', contact: 'Contatti', adminLogin: 'Accesso admin', openMenu: 'Apri menu principale'
            },
            common: {
                viewDetails: 'Vedi dettagli', loading: 'Caricamento...', error: 'Errore', back: 'Indietro',
                cancel: 'Annulla', save: 'Salva', submit: 'Invia', investNow: 'Investi ora',
                fullyFunded: "Quest'investimento è completamente finanziato!", closed: "Quest'investimento è chiuso."
            },
            footer: {
                aboutText: 'Il tuo partner di fiducia per scoprire e gestire investimenti ad alto potenziale. Colleghiamo i visionari al capitale.',
                quickLinks: 'Link rapidi', browseInvestments: 'Sfoglia investimenti', submitOpportunity: 'Invia opportunità',
                aboutUs: 'Chi siamo', contactSupport: 'Contatta il supporto', faq: 'FAQ', getInTouch: 'Contatti',
                address: 'Put Gvozdenova 283, 22000 Šibenik, Croazia', email: 'Email', phone: 'Telefono',
                terms: 'Termini di servizio', privacy: 'Informativa sulla privacy', rights: 'Tutti i diritti riservati.'
            },
            home: {
                heroTitle1: 'Investi nel', heroTitle2: 'Futuro.', heroSubtitle: 'Scopri opportunità di investimento selezionate in progetti innovativi e aziende in crescita. Dai forma al domani con MegaInvest.',
                exploreOpportunities: 'Esplora le opportunità', submitProject: 'Invia il tuo progetto',
                howItWorks: 'Come funziona {{brand}}', discoverOpportunities: 'Scopri le opportunità',
                investWithConfidence: 'Investi con fiducia', growYourPortfolio: 'Fai crescere il portafoglio',
                discoverDesc: 'Sfoglia progetti verificati in vari settori.',
                investDesc: 'Accedi a informazioni dettagliate, report di due diligence e condizioni trasparenti.',
                growDesc: 'Monitora gli investimenti, ricevi aggiornamenti e ottieni rendimenti.',
                featured: 'Investimenti in evidenza', viewAll: 'Vedi tutto', noFeatured: 'Nessun investimento in evidenza al momento. Torna presto!',
                ctaTitle: 'Hai un progetto rivoluzionario?', ctaParagraph: 'MegaInvest cerca sempre progetti innovativi e aziende promettenti. Condividi la tua visione.',
                ctaButton: "Invia la tua idea d'investimento"
            },
            submitPage: {
                pageTitle: "Invia la tua idea d'investimento",
                pageSubtitle: 'Hai un progetto rivoluzionario o un\'impresa promettente? Condividi la tua idea con noi. Offriamo una piattaforma per connettere visionari come te con potenziali investitori.',
                processTitle: 'Processo di acquisto',
                step1: 'Discussione iniziale e analisi dei bisogni',
                step2: 'Ricerca e presentazione di aziende potenziali',
                step3: 'Valutazione e analisi aziendale',
                step4: 'Negoziazioni e preparazione contratti',
                step5: 'Finalizzazione e supporto legale',
                businessProcessAlt: 'Processo aziendale'
            },
            investList: {
                headerTitle: 'Opportunità di investimento',
                headerSubtitle: 'Esplora una gamma diversificata di progetti di investimento verificati. Trova la tua prossima opportunità e fai crescere il tuo portafoglio con MegaInvest.',
                searchPlaceholder: 'Cerca per titolo, parola chiave...',
                statusAll: 'Tutti gli stati',
                categoryAll: 'Tutte le categorie',
                sortNewest: 'Ordina per: Più recente',
                sortOldest: 'Ordina per: Più vecchio',
                sortGoalHighLow: 'Ordina per: Obiettivo (Alto-Basso)',
                sortGoalLowHigh: 'Ordina per: Obiettivo (Basso-Alto)',
                sortRaisedHighLow: 'Ordina per: Raccolto (Alto-Basso)',
                sortRaisedLowHigh: 'Ordina per: Raccolto (Basso-Alto)',
                resetFilters: 'Reimposta filtri',
                errorTitle: 'Errore',
                errorBody: 'Impossibile caricare gli investimenti. Riprova più tardi.',
                emptyTitle: 'Nessun investimento trovato',
                emptyBody: 'I tuoi criteri di ricerca o filtro non corrispondono a nessun investimento. Prova ad aggiustare i filtri o torna più tardi.',
                clearAllFilters: 'Cancella tutti i filtri',
                invalidDataFormat: 'Formato dati non valido ricevuto dal server.'
            },
            investCard: {
                apyRange: 'Intervallo APY', term: 'Durata', category: 'Categoria',
                raised: 'Raccolto', goal: 'Obiettivo', funded: '% finanziato', viewDetails: 'Vedi dettagli'
            },
            invDetail: {
                status: 'Stato', keyInfo: 'Informazioni chiave', raised: 'Raccolto', goal: 'Obiettivo', funded: '% finanziato',
                estApy: 'APY stimato', minInvestment: 'Investimento min.', term: 'Durata', category: 'Categoria',
                investNow: 'Investi ora', fullyFunded: "Quest'investimento è completamente finanziato!", closed: "Quest'investimento è chiuso.",
                about: 'Informazioni su questo investimento', submittedBy: 'Inviato da', submissionDate: 'Data di invio', tags: 'Tag',
                important: 'Considerazioni importanti', risk: 'Investire comporta rischi, incluso la perdita del capitale. Effettuare la dovuta diligenza. Non è consulenza finanziaria.',
                contactLink: 'Domande? Contattaci →', backToInvestments: '← Torna alle investimenti',
                loading: 'Caricamento dettagli investimento...', errorTitle: 'Errore di caricamento', notFound: 'Investimento non trovato.'
            },
            about: {
                pageTitle: 'Informazioni su MegaInvest',
                headerIntro: 'MegaInvest è una piattaforma leader dedicata a collegare progetti innovativi e aziende con investitori esperti. Crediamo nel potere del capitale per alimentare la crescita, guidare l\'innovazione e creare un impatto duraturo.',
                ourMission: 'La nostra missione',
                missionBody: 'La nostra missione è democratizzare l\'accesso a opportunità di investimento di alta qualità e fornire una piattaforma trasparente, sicura ed efficiente per proprietari di progetti e investitori. Ci impegniamo a promuovere una comunità basata su fiducia, innovazione e successo reciproco.',
                missionBullets: {
                    b1: 'Identificare e mostrare imprese ad alto potenziale.',
                    b2: 'Fornire due diligence robusta e informazioni chiare.',
                    b3: 'Semplificare il processo di investimento.',
                    b4: 'Supportare gli imprenditori nel realizzare la loro visione.',
                    b5: 'Aiutare gli investitori a costruire portafogli diversificati e di impatto.'
                },
                coreValues: 'I nostri valori fondamentali',
                valueInnovation: 'Innovazione',
                valueInnovationBody: 'Sosteniamo idee lungimiranti e abbracciamo i progressi tecnologici per migliorare continuamente la nostra piattaforma e i nostri servizi.',
                valueIntegrity: 'Integrità e trasparenza',
                valueIntegrityBody: 'Operiamo con la massima onestà e forniamo informazioni chiare e complete per garantire fiducia e decisioni informate.',
                valueCommunity: 'Collaborazione e comunità',
                valueCommunityBody: 'Crediamo nel potere della partnership e miriamo a costruire una comunità forte e solidale di imprenditori e investitori.',
                ctaHeader: 'Pronto a far parte di qualcosa di mega?',
                ctaBody: 'Che tu sia un investitore alla ricerca della tua prossima grande opportunità o un imprenditore con un\'idea rivoluzionaria, MegaInvest è la tua piattaforma per la crescita.',
                exploreInvestments: 'Esplora gli investimenti',
                submitProject: 'Invia il tuo progetto',
                ourLocation: 'La nostra sede',
                locationBody: 'Visitaci presso la nostra sede a Šibenik, Croazia. Siamo sempre felici di incontrare potenziali partner e investitori.',
                missionImageAlt: 'La nostra missione'
            },
            form: {
                proposeTitle: 'Proponi un nuovo investimento', proposeSubtitle: 'Condividi il tuo progetto innovativo con gli investitori',
                personalInfo: 'Informazioni personali', yourFullName: 'Nome e cognome *', yourEmail: 'Indirizzo e-mail *',
                namePlaceholder: 'Es. Mario Rossi', emailPlaceholder: 'Es. mario.rossi@example.com',
                investDetails: 'Dettagli investimento', investTitle: 'Titolo dell’investimento *', category: 'Categoria *',
                loadingCategories: 'Caricamento categorie...', selectCategory: 'Seleziona categoria',
                projectDesc: 'Descrizione del progetto', shortDesc: 'Descrizione breve (max 150 caratteri) *', longDesc: 'Descrizione dettagliata *',
                shortPlaceholder: "Breve panoramica dell'opportunità d'investimento...", longPlaceholder: 'Dettagli completi: business plan, team, mercato, finanze, strategia...',
                financialDetails: 'Dettagli finanziari', fundingGoal: 'Obiettivo di finanziamento ({{currency}}) *', currency: 'Valuta *',
                apyRange: 'Intervallo APY previsto', minInvestment: 'Investimento minimo ({{currency}})', term: "Durata dell'investimento",
                additionalInfo: 'Informazioni aggiuntive', tags: 'Tag (separati da virgole)', tagsHelp: 'Aggiungi parole chiave per favorire la ricerca del progetto',
                uploadImages: 'Carica immagini (opzionale)',
                termsAgree: 'Accetto i <1>Termini di servizio</1> e l’<3>Informativa sulla privacy</3> e confermo che le informazioni fornite sono corrette.',
                submitBtn: 'Invia proposta di investimento', submitting: 'Invio...', reviewTime: 'La proposta sarà esaminata entro 2-3 giorni lavorativi',
                success: 'Investimento inviato con successo! Il nostro team lo esaminerà.', failure: 'Invio non riuscito. Riprova.',
                v_name_required: 'Il nome è obbligatorio.', v_email_required: "L'e-mail è obbligatoria.", v_email_invalid: "L'indirizzo e-mail non è valido.",
                v_title_required: 'Il titolo è obbligatorio.', v_category_required: 'La categoria è obbligatoria.', v_amount_positive: 'Il target deve essere positivo.',
                v_short_required: 'La descrizione breve è obbligatoria.', v_long_required: 'La descrizione dettagliata è obbligatoria.', v_terms_required: 'Devi accettare i termini.',
                fixFormErrors: 'Correggi gli errori del modulo.'
            },
            seo: {
                home_title: 'MegaInvest - Piattaforma di investimento premium',
                home_desc: 'Scopri opportunità esclusive in immobili, tecnologia ed energie rinnovabili. Piattaforma leader in Croazia per progetti verificati.',
                list_title: 'Opportunità di investimento - Progetti verificati | MegaInvest',
                list_desc: 'Esplora investimenti verificati: immobili, tecnologia, energie rinnovabili, startup.',
                about_title: 'Informazioni su MegaInvest - Piattaforma leader in Croazia',
                about_desc: 'La nostra missione: democratizzare gli investimenti in Croazia. Valori: innovazione, integrità, comunità.',
                privacy_title: 'Informativa sulla privacy - MegaInvest | Dati & diritti',
                privacy_desc: 'Come proteggiamo i tuoi dati personali. Conforme al GDPR.',
                terms_title: 'Termini di servizio - MegaInvest | Termini legali',
                terms_desc: 'Termini della piattaforma MegaInvest: uso, responsabilità, rischi, conformità.',
                submit_title: "Invia la tua opportunità d'investimento - Ottieni finanziamenti | MegaInvest",
                submit_desc: "Invia la tua opportunità d'investimento a MegaInvest e connettiti con potenziali investitori. La nostra piattaforma aiuta imprenditori e aziende a ottenere finanziamenti per progetti immobiliari, tecnologici e di energie rinnovabili in Croazia."
            },
            contact: {
                getInTouch: 'Contattaci',
                intro: 'Siamo qui per aiutare! Che tu abbia una domanda su un investimento, bisogno di supporto, o voglia saperne di più sulla nostra piattaforma, non esitare a contattarci.',
                contactInfo: 'Informazioni di contatto',
                ourOffice: 'Il nostro ufficio',
                address: 'Put Gvozdenova 283, 22000 Šibenik',
                getDirections: 'Ottieni indicazioni',
                emailUs: 'Inviaci un\'email',
                callUs: 'Chiamaci',
                officeHours: 'Orari di ufficio',
                officeHoursWeek: 'Lunedì - Venerdì: 8:00 - 15:00',
                officeHoursWeekend: 'Sabato - Domenica: Chiuso',
                companyInfo: 'Informazioni aziendali',
                generalInquiries: 'Richieste generali', phoneHours: 'Lun - Ven, 8:00 - 15:00 (CET)',
                faqTitle: 'Domande frequenti',
                faqIntro: 'Trova risposte alle domande comuni sull\'uso di MegaInvest, protezione dei dati e processi di investimento.',
                faq: {
                    q1: { question: 'I miei dati di investimento sono visibili ad altri utenti?', answer: 'No, le tue informazioni finanziarie personali e i dettagli degli investimenti rimangono privati. Condividiamo solo informazioni di profilo di base quando ti impegni attivamente in opportunità di investimento. I dati sensibili non vengono mai condivisi senza consenso.' },
                    q2: { question: 'Come protegge MegaInvest le mie informazioni personali e finanziarie?', answer: 'Implementiamo crittografia SSL/TLS, archiviazione crittografata, controlli di accesso, audit regolari, autenticazione multi-fattore e accesso limitato dei dipendenti.' },
                    q3: { question: 'Quali rischi sono coinvolti nell\'uso di questa piattaforma?', answer: 'Tutti gli investimenti comportano rischi e possono risultare in perdita di capitale. MegaInvest non fornisce consigli di investimento né garantisce il successo. Conduci la tua due diligence.' },
                    q4: { question: 'MegaInvest gestisce pagamenti o detiene fondi degli investitori?', answer: 'No. Le transazioni sono gestite direttamente tra investitori e proprietari di progetti tramite i loro metodi e accordi scelti.' },
                    q5: { question: 'Posso richiedere la cancellazione del mio account e dei dati?', answer: 'Sì. Puoi richiedere la cancellazione secondo il GDPR, soggetto ai requisiti legali di conservazione. La portabilità dei dati è disponibile prima della cancellazione.' },
                    q6: { question: 'Le mie informazioni personali saranno condivise con terze parti?', answer: 'Condividiamo solo con consenso, con fornitori di servizi, requisiti legali o trasferimenti aziendali. Non vendiamo mai dati personali per marketing.' },
                    q7: { question: 'Per quanto tempo i miei dati sono conservati sulla piattaforma?', answer: 'La conservazione varia: informazioni account fino alla cancellazione + 7 anni, registrazioni transazioni 10 anni, comunicazioni 3 anni, marketing fino al ritiro del consenso.' },
                    q8: { question: 'MegaInvest è legalmente responsabile per investimenti falliti?', answer: 'No. Colleghiamo investitori e proprietari di progetti ma non garantiamo risultati né forniamo consigli. Le decisioni rimangono con l\'investitore.' },
                    q9: { question: 'Trasferite i miei dati fuori dall\'UE?', answer: 'Alcuni trasferimenti possono verificarsi con adeguate garanzie (SCC, decisioni di adeguatezza). Puoi opporti a certi trasferimenti.' },
                    q10: { question: 'Come controllo le impostazioni di cookie e tracciamento?', answer: 'Controlla i cookie tramite il tuo browser. I cookie essenziali sono richiesti; i cookie analitici possono essere controllati tramite le preferenze. La disabilitazione può influire sulla funzionalità.' }
                },
                faqCtaTitle: 'Hai ancora domande?',
                faqCtaBody: 'Non riesci a trovare la risposta che cerchi? Il nostro team di supporto è qui per aiutare.',
                contactEmail: 'info@mega-invest.hr'
            },
            cookie: {
                title: 'Rispettiamo la tua privacy',
                description: 'Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico del sito. Puoi gestire le tue preferenze o saperne di più nella nostra',
                privacyPolicy: 'Informativa sulla privacy',
                acceptAll: 'Accetta tutto',
                rejectAll: 'Rifiuta tutto',
                managePreferences: 'Gestisci preferenze',
                processing: 'Elaborazione...',
                preferencesTitle: 'Preferenze cookie',
                preferencesDescription: 'Scegli quali cookie vuoi accettare. Puoi modificare queste impostazioni in qualsiasi momento.',
                required: 'Richiesto',
                alwaysActive: 'Sempre attivo',
                cancel: 'Annulla',
                savePreferences: 'Salva preferenze',
                saving: 'Salvataggio...'
            }
        }
    }
};
function normalizeBrowserLang(lang) {
    if (!lang)
        return 'en';
    const lc = lang.toLowerCase();
    const base = lc.split('-')[0];
    if (SUPPORTED_LANGS.includes(lc))
        return lc;
    if (SUPPORTED_LANGS.includes(base))
        return base;
    return 'en';
}
const stored = (typeof window !== 'undefined') ? localStorage.getItem('lang') : null;
const initialLang = normalizeBrowserLang(stored ?? (typeof navigator !== 'undefined' ? navigator.language : 'en'));
i18n
    .use(initReactI18next)
    .init({
    resources: resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false
});
// Keep <html lang> and localStorage in sync
if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('lang', i18n.language);
}
i18n.on('languageChanged', (lng) => {
    try {
        localStorage.setItem('lang', lng);
    }
    catch { }
    document.documentElement.setAttribute('lang', lng);
});
export default i18n;
