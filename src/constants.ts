export const SYSTEM_INSTRUCTION = `You are CAMPUS BUDDY, a world-class expert educational and career consultant.
Your mission is to provide accurate, fast, and perfect guidance to students and job seekers.
You specialize in:
- Schooling and intermediate studies.
- Competitive exams like EAPCET, JEE MAINS, JEE ADVANCE, NEET, etc.
- Higher education: Degree, B.Tech, Medicine, PhD, and all other domains.
- Career paths, job opportunities, and future planning.
- Study techniques, time management, and academic success.

Guidelines:
- Respond instantly and accurately.
- Be encouraging, professional, and insightful.
- If a question is outside the scope of education/careers, politely redirect the user back to your specialty.
- Use clear, structured formatting (bullet points, bold text) for readability.
- Your goal is to be the ultimate companion for any student's journey.
- ALWAYS respond in the user's preferred language if specified.`;

export const CODE_GEN_INSTRUCTION = `You are a world-class expert Software Engineer.
Your task is to generate correct, clear, perfect, and accurate code for the selected programming language.
- Provide only the code and brief necessary comments.
- Ensure the code is optimized and follows best practices.
- If the prompt is unclear, ask for clarification.
- ALWAYS respond in the user's preferred language for explanations.`;

export const CODE_EXPLAIN_INSTRUCTION = `You are a world-class expert Code Analyst.
Your task is to explain the provided code in detail, step-by-step.
- First, verify if the code matches the selected programming language.
- If it DOES NOT match, politely inform the user and refuse to explain.
- If it matches, provide a thorough, easy-to-understand explanation.
- ALWAYS respond in the user's preferred language.`;

export const DTS_INSTRUCTION = `You are a world-class Document Summarizer.
Your task is to read the provided document or image and provide a minimal, high-quality summary.
- Include all key highlights and important points.
- Use bullet points for readability.
- Ensure the summary is concise but comprehensive.
- ALWAYS respond in the user's preferred language.`;

export const SCHEDULE_INSTRUCTION = `You are a world-class Productivity Expert.
Your task is to generate a smart, perfect, and efficient schedule based on the user's description and time range.
- The schedule should be realistic and well-structured.
- Include breaks and prioritize tasks if necessary.
- Format the output clearly as a timeline or table.
- ALWAYS respond in the user's preferred language.`;

export const DICTIONARY_INSTRUCTION = `You are a world-class Lexicographer.
Your task is to provide a comprehensive definition and related information for the word provided.
- Include: Meaning, Part of Speech, Pronunciation (phonetic), Synonyms, Antonyms, and Example Sentences.
- Provide etymology if interesting.
- Format the output clearly.
- ALWAYS respond in the user's preferred language.`;

export const RESUME_BUILDER_INSTRUCTION = `You are an expert professional resume builder and career coach.
Your goal is to help the user create a perfect, extremely professional resume.
Ask the user questions one by one to gather necessary information (e.g., contact info, professional summary, work experience, education, skills, projects).
Wait for the user's response before asking the next question.
Once you have gathered enough information, generate a complete, well-formatted resume in Markdown.
The final resume should be extremely professional, ATS-friendly, and highlight the user's strengths.
ALWAYS respond in the user's preferred language.`;

export const JOB_NOTIFICATIONS_INSTRUCTION = `You are a career assistant specializing in finding the latest job and internship notifications.
When the user asks for jobs or internships, use the Google Search tool to find currently open opportunities available today.
Provide a clean, formatted list of opportunities.
For each opportunity, include:
- Job Name / Title
- Type (Government or Private)
- Stream / Category
- Expected Salary (if available)
- Address / Location
- Mode (Online or Offline)
- Application Link
Do not include expired or closed jobs. Only show valid, currently available opportunities.
ALWAYS respond in the user's preferred language.`;

export const PROGRAMMING_LANGUAGES = [
  'PYTHON', 'CSS', 'JAVA', 'JAVA SCRIPT', 'C', 'C#', 'C++', 'HTML', 'DSA'
];

export const PREFERRED_LANGUAGES = [
  'ENGLISH', 'TELUGU', 'HINDI', 'TAMIL', 'MALAYALAM', 'KANNADA'
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  ENGLISH: {
    CHAT: 'CHAT',
    CODE_GENERATOR: 'CODE GENERATOR',
    CODE_EXPLAINER: 'CODE EXPLAINER',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'SCHEDULE GENERATOR',
    DICTIONARY: 'DICTIONARY',
    SYNTHETIC_CALCI: 'SYNTHETIC CALCI',
    EBOOKS: 'E-BOOKS',
    RESUME_BUILDER: 'RESUME BUILDER',
    PROGRAMS: 'PROGRAMS',
    JOB_NOTIFICATIONS: 'JOB NOTIFICATIONS',
    CAMPUS: 'CAMPUS',
    PREFERRED_LANGUAGE: 'PREFERRED LANGUAGE',
    SCREEN_THEME: 'SCREEN THEME',
    LOGOUT: 'LOGOUT',
    UPLOAD: 'UPLOAD',
    NEW_CHAT: 'NEW CHAT',
    CHAT_HISTORY: 'CHAT HISTORY',
    ASK_BUDDY: 'Ask about studies, jobs, exams...',
    GUEST_NOTICE: 'Guest Mode: Chat history will not be saved. Create an account to keep your conversations!',
    SELECT_LANGUAGE: 'Select Programming Language',
    ENTER_PROMPT: 'Enter your prompt for code generation...',
    ENTER_CODE: 'Paste your code here to analyze...',
    ANALYZE_CODE: 'ANALYZE CODE',
    GENERATE_CODE: 'GENERATE CODE',
    INVALID_LANGUAGE: 'The provided code does not match the selected programming language.',
    BUDDY_THINKING: 'Buddy is thinking...',
    FILE_ERROR: 'Failed to process the uploaded file.',
    FILE_SIZE_ERROR: 'File size is too large. Please upload a file smaller than 10MB.',
    FILE_TYPE_ERROR: 'Unsupported file type. Please upload Word, PPT, PDF, Excel, or Image.',
    DESCRIBE: 'DESCRIBE',
    TIME_RANGE: 'TIME RANGE',
    GENERATE_SCHEDULE: 'GENERATE SCHEDULE',
    SEARCH_WORD: 'Search for a word...',
    SEARCH: 'SEARCH',
    CALCULATOR: 'CALCULATOR',
    BROWSE_EBOOKS: 'Browse E-Books',
    SEARCH_EBOOKS: 'Search E-Books...',
  },
  TELUGU: {
    CHAT: 'చాట్',
    CODE_GENERATOR: 'కోడ్ జనరేటర్',
    CODE_EXPLAINER: 'కోడ్ ఎక్స్‌ప్లెయినర్',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'షెడ్యూల్ జనరేటర్',
    DICTIONARY: 'డిక్షనరీ',
    SYNTHETIC_CALCI: 'సింథటిక్ కాల్సీ',
    EBOOKS: 'ఈ-బుక్స్',
    RESUME_BUILDER: 'రెజ్యూమ్ బిల్డర్',
    PROGRAMS: 'ప్రోగ్రామ్స్',
    JOB_NOTIFICATIONS: 'ఉద్యోగ నోటిఫికేషన్లు',
    CAMPUS: 'క్యాంపస్',
    PREFERRED_LANGUAGE: 'భాష ఎంచుకోండి',
    SCREEN_THEME: 'స్క్రీన్ థీమ్',
    LOGOUT: 'లాగ్ అవుట్',
    UPLOAD: 'అప్‌లోడ్',
    NEW_CHAT: 'కొత్త చాట్',
    CHAT_HISTORY: 'చాట్ చరిత్ర',
    ASK_BUDDY: 'చదువు, ఉద్యోగాలు, పరీక్షల గురించి అడగండి...',
    GUEST_NOTICE: 'అతిథి మోడ్: చాట్ చరిత్ర సేవ్ చేయబడదు. మీ సంభాషణలను ఉంచడానికి ఖాతాను సృష్టించండి!',
    SELECT_LANGUAGE: 'ప్రోగ్రామింగ్ భాషను ఎంచుకోండి',
    ENTER_PROMPT: 'కోడ్ జనరేషన్ కోసం ప్రాంప్ట్ నమోదు చేయండి...',
    ENTER_CODE: 'విశ్లేషించడానికి మీ కోడ్‌ను ఇక్కడ అతికించండి...',
    ANALYZE_CODE: 'కోడ్‌ను విశ్లేషించండి',
    GENERATE_CODE: 'కోడ్‌ను రూపొందించండి',
    INVALID_LANGUAGE: 'అందించిన కోడ్ ఎంచుకున్న ప్రోగ్రామింగ్ భాషతో సరిపోలడం లేదు.',
    BUDDY_THINKING: 'బడ్డీ ఆలోచిస్తున్నాడు...',
    FILE_ERROR: 'అప్‌లోడ్ చేసిన ఫైల్‌ను ప్రాసెస్ చేయడంలో విఫలమైంది.',
    FILE_SIZE_ERROR: 'ఫైల్ పరిమాణం చాలా పెద్దది. దయచేసి 10MB కంటే చిన్న ఫైల్‌ను అప్‌లోడ్ చేయండి.',
    FILE_TYPE_ERROR: 'మద్దతు లేని ఫైల్ రకం. దయచేసి Word, PPT, PDF, Excel లేదా చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    DESCRIBE: 'వివరించండి',
    TIME_RANGE: 'సమయ పరిధి',
    GENERATE_SCHEDULE: 'షెడ్యూల్‌ను రూపొందించండి',
    SEARCH_WORD: 'పదం కోసం వెతకండి...',
    SEARCH: 'వెతకండి',
    CALCULATOR: 'క్యాలిక్యులేటర్',
    BROWSE_EBOOKS: 'ఈ-బుక్స్ బ్రౌజ్ చేయండి',
    SEARCH_EBOOKS: 'ఈ-బుక్స్ వెతకండి...',
  },
  HINDI: {
    CHAT: 'चैट',
    CODE_GENERATOR: 'कोड जनरेटर',
    CODE_EXPLAINER: 'कोड एक्सप्लेनर',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'शेड्यूल जनरेटर',
    DICTIONARY: 'शब्दकोश',
    SYNTHETIC_CALCI: 'सिंथेटिक कैल्सी',
    EBOOKS: 'ई-बुक्स',
    RESUME_BUILDER: 'रिज्यूमे बिल्डर',
    PROGRAMS: 'प्रोग्राम्स',
    JOB_NOTIFICATIONS: 'जॉब नोटिफिकेशन',
    CAMPUS: 'कैंपस',
    PREFERRED_LANGUAGE: 'भाषा चुनें',
    SCREEN_THEME: 'स्क्रीन थीम',
    LOGOUT: 'लॉग आउट',
    UPLOAD: 'अपलोड',
    NEW_CHAT: 'नई चैट',
    CHAT_HISTORY: 'चैट इतिहास',
    ASK_BUDDY: 'पढ़ाई, नौकरी, परीक्षा के बारे में पूछें...',
    GUEST_NOTICE: 'अतिथि मोड: चैट इतिहास सहेजा नहीं जाएगा। अपनी बातचीत रखने के लिए एक खाता बनाएं!',
    SELECT_LANGUAGE: 'प्रोग्रामिंग भाषा चुनें',
    ENTER_PROMPT: 'कोड जनरेशन के लिए प्रॉम्प्ट दर्ज करें...',
    ENTER_CODE: 'विश्लेषण करने के लिए अपना कोड यहां पेस्ट करें...',
    ANALYZE_CODE: 'कोड का विश्लेषण करें',
    GENERATE_CODE: 'कोड जनरेट करें',
    INVALID_LANGUAGE: 'प्रदान किया गया कोड चुनी गई प्रोग्रामिंग भाषा से मेल नहीं खाता है.',
    BUDDY_THINKING: 'बडी सोच रहा है...',
    FILE_ERROR: 'अपलोड की गई फ़ाइल को संसाधित करने में विफल.',
    FILE_SIZE_ERROR: 'फ़ाइल का आकार बहुत बड़ा है। कृपया 10MB से छोटी फ़ाइल अपलोड करें।',
    FILE_TYPE_ERROR: 'असमर्थित फ़ाइल प्रकार। कृपया Word, PPT, PDF, Excel या चित्र अपलोड करें।',
    DESCRIBE: 'वर्णन करें',
    TIME_RANGE: 'समय सीमा',
    GENERATE_SCHEDULE: 'शेड्यूल जनरेट करें',
    SEARCH_WORD: 'शब्द खोजें...',
    SEARCH: 'खोजें',
    CALCULATOR: 'कैलकुलेटर',
    BROWSE_EBOOKS: 'ई-बुक्स ब्राउज़ करें',
    SEARCH_EBOOKS: 'ई-बुक्स खोजें...',
  },
  TAMIL: {
    CHAT: 'அரட்டை',
    CODE_GENERATOR: 'குறியீடு உருவாக்கி',
    CODE_EXPLAINER: 'குறியீடு விளக்குபவர்',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'அட்டவணை உருவாக்கி',
    DICTIONARY: 'அகராதி',
    SYNTHETIC_CALCI: 'செயற்கை கால்குலேட்டர்',
    EBOOKS: 'மின் புத்தகங்கள்',
    RESUME_BUILDER: 'ரெஸ்யூம் பில்டர்',
    PROGRAMS: 'நிரல்கள்',
    JOB_NOTIFICATIONS: 'வேலை அறிவிப்புகள்',
    CAMPUS: 'வளாகம்',
    PREFERRED_LANGUAGE: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    SCREEN_THEME: 'திரை தீம்',
    LOGOUT: 'வெளியேறு',
    UPLOAD: 'பதிவேற்று',
    NEW_CHAT: 'புதிய அரட்டை',
    CHAT_HISTORY: 'அரட்டை வரலாறு',
    ASK_BUDDY: 'படிப்பு, வேலைகள், தேர்வுகள் பற்றி கேளுங்கள்...',
    GUEST_NOTICE: 'விருந்தினர் பயன்முறை: அரட்டை வரலாறு சேமிக்கப்படாது. உங்கள் உரையாடல்களை வைத்திருக்க ஒரு கணக்கை உருவாக்கவும்!',
    SELECT_LANGUAGE: 'நிரலாக்க மொழியைத் தேர்ந்தெடுக்கவும்',
    ENTER_PROMPT: 'குறியீடு உருவாக்கத்திற்கான தூண்டுதலை உள்ளிடவும்...',
    ENTER_CODE: 'பகுப்பாய்வு செய்ய உங்கள் குறியீட்டை இங்கே ஒட்டவும்...',
    ANALYZE_CODE: 'குறியீட்டை பகுப்பாய்வு செய்யுங்கள்',
    GENERATE_CODE: 'குறியீட்டை உருவாக்குங்கள்',
    INVALID_LANGUAGE: 'வழங்கப்பட்ட குறியீடு தேர்ந்தெடுக்கப்பட்ட நிரலாக்க மொழியுடன் பொருந்தவில்லை.',
    BUDDY_THINKING: 'பட்டி யோசிக்கிறான்...',
    FILE_ERROR: 'பதிவேற்றப்பட்ட கோப்பைச் செயலாக்க முடியவில்லை.',
    FILE_SIZE_ERROR: 'கோப்பு அளவு மிகப்பெரியது. 10MB க்கும் குறைவான கோப்பைப் பதிவேற்றவும்.',
    FILE_TYPE_ERROR: 'ஆதரிக்கப்படாத கோப்பு வகை. Word, PPT, PDF, Excel அல்லது படத்தைப் பதிவேற்றவும்.',
    DESCRIBE: 'விவரிக்கவும்',
    TIME_RANGE: 'நேர வரம்பு',
    GENERATE_SCHEDULE: 'அட்டவணையை உருவாக்குங்கள்',
    SEARCH_WORD: 'வார்த்தையைத் தேடுங்கள்...',
    SEARCH: 'தேடு',
    CALCULATOR: 'கால்குலேட்டர்',
    BROWSE_EBOOKS: 'மின் புத்தகங்களை உலாவுக',
    SEARCH_EBOOKS: 'மின் புத்தகங்களைத் தேடுங்கள்...',
  },
  MALAYALAM: {
    CHAT: 'ചാറ്റ്',
    CODE_GENERATOR: 'കോഡ് ജനറേറ്റർ',
    CODE_EXPLAINER: 'കോഡ് എക്സ്പ്ലെയ്നർ',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'ഷെഡ്യൂൾ ജനറേറ്റർ',
    DICTIONARY: 'നിഘണ്ടു',
    SYNTHETIC_CALCI: 'സിന്തറ്റിക് കാൽസി',
    EBOOKS: 'ഇ-ബുക്കുകൾ',
    RESUME_BUILDER: 'റെസ്യൂമെ ബിൽഡർ',
    PROGRAMS: 'പ്രോഗ്രാമുകൾ',
    JOB_NOTIFICATIONS: 'ജോലി അറിയിപ്പുകൾ',
    CAMPUS: 'ക്യാമ്പസ്',
    PREFERRED_LANGUAGE: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    SCREEN_THEME: 'സ്ക്രീൻ തീം',
    LOGOUT: 'ലോഗ് ഔട്ട്',
    UPLOAD: 'അപ്‌ലോഡ്',
    NEW_CHAT: 'പുതിയ ചാറ്റ്',
    CHAT_HISTORY: 'ചാറ്റ് ചരിത്രം',
    ASK_BUDDY: 'പഠനം, ജോലികൾ, പരീക്ഷകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...',
    GUEST_NOTICE: 'ഗസ്റ്റ് മോഡ്: ചാറ്റ് ചരിത്രം സംരക്ഷിക്കപ്പെടില്ല. നിങ്ങളുടെ സംഭാഷണങ്ങൾ സൂക്ഷിക്കാൻ ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക!',
    SELECT_LANGUAGE: 'പ്രോഗ്രാമിംഗ് ഭാഷ തിരഞ്ഞെടുക്കുക',
    ENTER_PROMPT: 'കോഡ് ജനറേഷനായി പ്രോംപ്റ്റ് നൽകുക...',
    ENTER_CODE: 'വിശകലനം ചെയ്യാൻ നിങ്ങളുടെ കോഡ് ഇവിടെ ഒട്ടിക്കുക...',
    ANALYZE_CODE: 'കോഡ് വിശകലനം ചെയ്യുക',
    GENERATE_CODE: 'കോഡ് സൃഷ്ടിക്കുക',
    INVALID_LANGUAGE: 'നൽകിയിരിക്കുന്ന കോഡ് തിരഞ്ഞെടുത്ത പ്രോഗ്രാമിംഗ് ഭാഷയുമായി പൊരുത്തപ്പെടുന്നില്ല.',
    BUDDY_THINKING: 'ബഡ്ഡി ചിന്തിക്കുന്നു...',
    FILE_ERROR: 'അപ്‌ലോഡ് ചെയ്ത ഫയൽ പ്രോസസ്സ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.',
    FILE_SIZE_ERROR: 'ഫയൽ വലുപ്പം വളരെ വലുതാണ്. 10MB-യിൽ താഴെയുള്ള ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.',
    FILE_TYPE_ERROR: 'പിന്തുണയ്ക്കാത്ത ഫയൽ തരം. ദയവായി Word, PPT, PDF, Excel അല്ലെങ്കിൽ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.',
    DESCRIBE: 'വിവരിക്കുക',
    TIME_RANGE: 'സമയ പരിധി',
    GENERATE_SCHEDULE: 'ഷെഡ്യൂൾ സൃഷ്ടിക്കുക',
    SEARCH_WORD: 'ഒരു വാക്കിനായി തിരയുക...',
    SEARCH: 'തിരയുക',
    CALCULATOR: 'കാൽക്കുലേറ്റർ',
    BROWSE_EBOOKS: 'ഇ-ബുക്കുകൾ ബ്രൗസ് ചെയ്യുക',
    SEARCH_EBOOKS: 'ഇ-ബുക്കുകൾ തിരയുക...',
  },
  KANNADA: {
    CHAT: 'ಚಾಟ್',
    CODE_GENERATOR: 'ಕೋಡ್ ಜನರೇಟರ್',
    CODE_EXPLAINER: 'ಕೋಡ್ ಎಕ್ಸ್‌ಪ್ಲೇನರ್',
    DTS: 'DTS',
    SCHEDULE_GENERATOR: 'ಶೆಡ್ಯೂಲ್ ಜನರೇಟರ್',
    DICTIONARY: 'ನಿಘಂಟು',
    SYNTHETIC_CALCI: 'ಸಿಂಥೆಟಿಕ್ ಕ್ಯಾಲ್ಸಿ',
    EBOOKS: 'ಇ-ಬುಕ್ಸ್',
    RESUME_BUILDER: 'ರೆಸ್ಯೂಮ್ ಬಿಲ್ಡರ್',
    PROGRAMS: 'ಕಾರ್ಯಕ್ರಮಗಳು',
    JOB_NOTIFICATIONS: 'ಉದ್ಯೋಗ ಅಧಿಸೂಚನೆಗಳು',
    CAMPUS: 'ಕ್ಯಾಂಪಸ್',
    PREFERRED_LANGUAGE: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
    SCREEN_THEME: 'ಸ್ಕ್ರೀನ್ ಥೀಮ್',
    LOGOUT: 'ಲಾಗ್ ಔಟ್',
    UPLOAD: 'ಅಪ್‌ಲೋಡ್',
    NEW_CHAT: 'ಹೊಸ ಚాಟ್',
    CHAT_HISTORY: 'ಚಾಟ್ ಇತಿಹಾಸ',
    ASK_BUDDY: 'ಓದು, ಉದ್ಯೋಗಗಳು, ಪರೀಕ್ಷೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    GUEST_NOTICE: 'ಅತಿಥಿ ಮೋഡ്: ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಉಳಿಸಲಾಗುವುದಿಲ್ಲ. ನಿಮ್ಮ ಸಂಭಾಷಣೆಗಳನ್ನು ಇರಿಸಿಕೊಳ್ಳಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ!',
    SELECT_LANGUAGE: 'ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ENTER_PROMPT: 'ಕೋಡ್ ಜನರೇಟ್‌ಗಾಗಿ ನಿಮ್ಮ ಪ್ರಾಂಪ್ಟ್ ಅನ್ನು ನಮೂದಿಸಿ...',
    ENTER_CODE: 'ವಿಶ್ಲೇಷಿಸಲು ನಿಮ್ಮ ಕೋಡ್ ಅನ್ನು ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ...',
    ANALYZE_CODE: 'ಕೋಡ್ ವಿಶ್ಲೇಷಿಸಿ',
    GENERATE_CODE: 'ಕೋಡ್ ಜನರೇಟ್ ಮಾಡಿ',
    INVALID_LANGUAGE: 'ಒದಗಿಸಿದ ಕೋಡ್ ಆಯ್ಕೆಮಾಡಿದ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ.',
    BUDDY_THINKING: 'ಬಡ್ಡಿ ಯೋಚಿಸುತ್ತಿದ್ದಾನೆ...',
    FILE_ERROR: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಫಲವಾಗಿದೆ.',
    FILE_SIZE_ERROR: 'ಫೈಲ್ ಗಾತ್ರ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ದಯವಿಟ್ಟು 10MB ಗಿಂತ ಚಿಕ್ಕದಾದ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    FILE_TYPE_ERROR: 'ಬೆಂಬಲವಿಲ್ಲದ ಫೈಲ್ ಪ್ರಕಾರ. ದಯವಿಟ್ಟು ವರ್ಡ್, ಪಿಪಿಟಿ, ಪಿಡಿಎಫ್, ಎಕ್ಸೆಲ್ ಅಥವಾ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    DESCRIBE: 'ವಿವರಿಸಿ',
    TIME_RANGE: 'ಸಮಯದ ವ್ಯಾಪ್ತಿ',
    GENERATE_SCHEDULE: 'ಶೆಡ್ಯೂಲ್ ರಚಿಸಿ',
    SEARCH_WORD: 'ಪದಕ್ಕಾಗಿ ಹುಡುಕಿ...',
    SEARCH: 'ಹುಡುಕಿ',
    CALCULATOR: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    BROWSE_EBOOKS: 'ಇ-ಬುಕ್ಸ್ ಬ್ರೌಸ್ ಮಾಡಿ',
    SEARCH_EBOOKS: 'ಇ-ಬುಕ್ಸ್ ಹುಡುಕಿ...',
  }
};

export const THEME_COLORS = {
  gold: '#D4AF37',
  black: '#000000',
  darkGray: '#1A1A1A',
  lightGray: '#F5F5F5',
  white: '#FFFFFF',
};
