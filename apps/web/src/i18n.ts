import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        landlords: 'Landlords',
        depositCheck: 'Deposit Check',
        rights: 'Know Your Rights',
        localities: 'Localities',
        aiChat: 'AI Chat',
        writeReview: 'Write a Review',
      },
      home: {
        tagline: 'Know before you sign.',
        subtitle: "Bangalore's tenant-first rental transparency platform. Search landlords, check deposits, know your rights.",
        searchPlaceholder: 'Search landlords by name or locality...',
        searchBtn: 'Search',
        features: {
          landlords: { title: 'Search Landlords', desc: 'Read honest reviews from previous tenants' },
          deposit: { title: 'Check Your Deposit', desc: 'Is your deposit amount fair and market-standard?' },
          rights: { title: 'Know Your Rights', desc: '12+ articles on Karnataka rental law' },
          ai: { title: 'Ask the AI', desc: 'Get plain-language answers to your rental questions' },
        },
        howItWorks: 'How It Works',
        step1: 'Search for your landlord or locality',
        step2: 'Read verified tenant reviews',
        step3: 'Check your deposit and rights',
        step4: 'Make an informed decision',
        disclaimer: '⚠️ Reviews are opinions of users. This is not legal advice. All demo data is clearly marked.',
      },
      footer: {
        disclaimer: 'DoorSpeaks is an independent platform. Reviews are opinions of individual users, not facts. Landlords may request takedowns via the report flow. This is not legal advice. Always consult a qualified advocate. Deposit norms are market observations, not statutory caps.',
        rights: '© 2025 DoorSpeaks. MIT License.',
      },
    },
  },
  kn: {
    translation: {
      nav: {
        home: 'ಮುಖಪುಟ',
        landlords: 'ಮನೆ ಮಾಲೀಕರು',
        depositCheck: 'ಠೇವಣಿ ತಪಾಸಣೆ',
        rights: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳು',
        localities: 'ಪ್ರದೇಶಗಳು',
        aiChat: 'AI ಚಾಟ್',
        writeReview: 'ವಿಮರ್ಶೆ ಬರೆಯಿರಿ',
      },
      home: {
        tagline: 'ಸಹಿ ಮಾಡುವ ಮೊದಲು ತಿಳಿಯಿರಿ.',
        subtitle: 'ಬೆಂಗಳೂರಿನ ಬಾಡಿಗೆದಾರ-ಮೊದಲ ಬಾಡಿಗೆ ಪಾರದರ್ಶಕತೆ ವೇದಿಕೆ.',
        searchPlaceholder: 'ಮನೆ ಮಾಲೀಕರ ಹೆಸರು ಅಥವಾ ಪ್ರದೇಶ ಹುಡುಕಿ...',
        searchBtn: 'ಹುಡುಕಿ',
        features: {
          landlords: { title: 'ಮಾಲೀಕರ ಹುಡುಕಿ', desc: 'ಹಿಂದಿನ ಬಾಡಿಗೆದಾರರ ಪ್ರಾಮಾಣಿಕ ವಿಮರ್ಶೆಗಳನ್ನು ಓದಿ' },
          deposit: { title: 'ಠೇವಣಿ ತಪಾಸಣೆ', desc: 'ನಿಮ್ಮ ಠೇವಣಿ ಮೊತ್ತ ನ್ಯಾಯಯುತವೇ?' },
          rights: { title: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳು', desc: 'ಕರ್ನಾಟಕ ಬಾಡಿಗೆ ಕಾನೂನಿನ ಮೇಲೆ ಲೇಖನಗಳು' },
          ai: { title: 'AI ಅನ್ನು ಕೇಳಿ', desc: 'ನಿಮ್ಮ ಬಾಡಿಗೆ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸರಳ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ' },
        },
        disclaimer: '⚠️ ವಿಮರ್ಶೆಗಳು ಬಳಕೆದಾರರ ಅಭಿಪ್ರಾಯಗಳು. ಇದು ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ.',
      },
      footer: {
        disclaimer: 'DoorSpeaks ಒಂದು ಸ್ವತಂತ್ರ ವೇದಿಕೆ. ಕಾನೂನು ಸಲಹೆಗಾಗಿ ಅರ್ಹ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        rights: '© 2025 DoorSpeaks',
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        landlords: 'मकान मालिक',
        depositCheck: 'जमा राशि जाँच',
        rights: 'आपके अधिकार',
        localities: 'इलाके',
        aiChat: 'AI चैट',
        writeReview: 'समीक्षा लिखें',
      },
      home: {
        tagline: 'साइन करने से पहले जानें।',
        subtitle: 'बैंगलोर का किरायेदार-पहले किराया पारदर्शिता प्लेटफ़ॉर्म।',
        searchPlaceholder: 'मकान मालिक का नाम या इलाका खोजें...',
        searchBtn: 'खोजें',
        features: {
          landlords: { title: 'मकान मालिक खोजें', desc: 'पिछले किरायेदारों की ईमानदार समीक्षाएँ पढ़ें' },
          deposit: { title: 'जमा राशि जाँचें', desc: 'क्या आपकी जमा राशि उचित है?' },
          rights: { title: 'आपके अधिकार', desc: 'कर्नाटक किराया कानून पर लेख' },
          ai: { title: 'AI से पूछें', desc: 'अपने किराया प्रश्नों के सरल उत्तर पाएं' },
        },
        disclaimer: '⚠️ समीक्षाएँ उपयोगकर्ताओं की राय हैं। यह कानूनी सलाह नहीं है।',
      },
      footer: {
        disclaimer: 'DoorSpeaks एक स्वतंत्र प्लेटफ़ॉर्म है। कानूनी सलाह के लिए योग्य वकील से संपर्क करें।',
        rights: '© 2025 DoorSpeaks',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
