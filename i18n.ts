import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Supported languages
export const SUPPORTED_LANGS = ['en', 'hr', 'de', 'fr', 'it'] as const;
export type LangCode = typeof SUPPORTED_LANGS[number];

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
        emptyTitle: 'No Investments Found',
        emptyBody: 'Your search or filter criteria did not match any investments. Try adjusting your filters or check back later.',
        clearAllFilters: 'Clear All Filters'
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
          q10:{ question: 'How do I control cookies and tracking settings?', answer: 'Control cookies via your browser. Essential cookies are required; analytics can be controlled via preferences. Disabling may affect functionality.' }
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
        invest_detail_desc: '{{description}} Minimum investment: {{currency}} {{minInvestment}}. Expected returns: {{apyRange}}. Category: {{category}}.'
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
        v_name_required: 'Submitter name is required.', v_email_required: 'Submitter email is required.', v_email_invalid: 'Email address is invalid.',
        v_title_required: 'Investment title is required.', v_category_required: 'Category is required.', v_amount_positive: 'Funding goal must be a positive number.',
        v_short_required: 'Short description is required.', v_long_required: 'Detailed description is required.', v_terms_required: 'You must agree to the terms of service.',
        fixFormErrors: 'Please correct the errors in the form.'
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
        terms_desc: 'Uvjeti korištenja MegaInvest platforme: korištenje, odgovornosti, rizici ulaganja i usklađenost sa zakonima.'
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
        terms_desc: 'Nutzungsbedingungen der MegaInvest-Plattform: Nutzung, Pflichten, Risiken, Compliance.'
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
        terms_desc: 'Conditions de la plateforme MegaInvest : usage, responsabilités, risques, conformité.'
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
        terms_desc: 'Termini della piattaforma MegaInvest: uso, responsabilità, rischi, conformità.'
      }
    }
  }
} as const;

function normalizeBrowserLang(lang: string | null | undefined): LangCode {
  if (!lang) return 'en';
  const lc = lang.toLowerCase();
  const base = lc.split('-')[0];
  if ((SUPPORTED_LANGS as readonly string[]).includes(lc)) return lc as LangCode;
  if ((SUPPORTED_LANGS as readonly string[]).includes(base)) return base as LangCode;
  return 'en';
}

const stored = (typeof window !== 'undefined') ? localStorage.getItem('lang') : null;
const initialLang = normalizeBrowserLang(stored ?? (typeof navigator !== 'undefined' ? navigator.language : 'en'));

i18n
  .use(initReactI18next)
  .init({
    resources: resources as any,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false
  });

// Keep <html lang> and localStorage in sync
if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('lang', i18n.language);
  i18n.on('languageChanged', (lng) => {
    try { localStorage.setItem('lang', lng); } catch {}
    document.documentElement.setAttribute('lang', lng);
  });
}

export default i18n;

