// Every word the interface shows. The text is gender-neutral: it uses plural and infinitive forms.
// A {slot} is filled by fmt().
export const he = {
  appName: 'מלמדים אותי את הקובץ',

  common: {
    back: 'חזרה',
    retry: 'ניסיון חוזר',
    close: 'סגירה',
    save: 'שמירה',
    loading: 'טוענים...',
    startOver: 'התחלה מחדש',
    toSettings: 'להגדרות',
  },

  setup: {
    tagline: 'מעלים חומר לימוד, כותבים שורה אחת, ומורה סבלני מלמד אותו צעד אחר צעד.',
    fileStep: 'הקובץ',
    promptStep: 'איך ללמד? (לא חובה)',
    dropTitle: 'גררו לכאן קובץ או לחצו לבחירה',
    dropHint: 'PDF, Word, מצגת, גיליון או צילום של דף · עד {size} MB',
    dropOver: 'שחררו כדי להעלות',
    sleepy: 'גררו לכאן קובץ, וברק יתעורר.',
    fileReady: '{size} · הקובץ מוכן',
    removeFile: 'הסרת הקובץ',
    anotherFile: 'קובץ אחר',
    promptLabel: 'ההנחיה למורה ה-AI',
    promptPlaceholder: 'למשל: ללמד כיתה ז׳, בעברית, בשיטה סוקרטית, עד 15 דקות',
    promptExample: 'ללמד כיתה ז׳, בעברית, בשיטה סוקרטית, עד 15 דקות.',
    tryExample: 'נסו דוגמה',
    settings: 'הגדרות',
    next: 'המשך',
    reasonNoFile: 'בחרו קובץ כדי להמשיך',
    reasonNoKey: 'הוסיפו מפתח API',
    reasonNoModel: 'בחרו ספק ומודל',
    reasonBusy: 'קוראים את הקובץ...',
    reading: 'קוראים את הקובץ...',
    readingPages: 'קוראים עמוד {done} מתוך {total}',
    readingVision: 'קוראים עמודים סרוקים ({done} מתוך {total})',
    noKeyTitle: 'צריך מפתח API כדי להתחיל',
    noKeyBody: 'מקבלים אותו בחינם אצל הספק, ומדביקים בהגדרות.',
    openSettings: 'לפתיחת ההגדרות',
  },

  settings: {
    title: 'הגדרות',
    provider: 'ספק ה-AI',
    custom: 'ספק אחר',
    baseUrl: 'כתובת השרת',
    model: 'שם המודל',
    key: 'מפתח API',
    showKey: 'הצגת המפתח',
    hideKey: 'הסתרת המפתח',
    vision: 'המודל יודע לקרוא תמונות',
    visionHint: 'נדרש לצילומים ולדפים סרוקים',
    remember: 'זכרו את המפתח במכשיר הזה',
    getKey: 'יצירת מפתח API אצל {provider}',
    privacy: 'המפתח שלכם נשלח רק לספק ה-AI שבחרתם, ולא נשמר אצלנו.',
  },

  // Titles and texts for a file that cannot be read, by the code of the ParseError.
  fileErrors: {
    too_large: {
      title: 'הקובץ גדול מדי',
      body: 'אפשר להעלות קובץ עד {size} MB. נסו לצמצם אותו או להעלות רק את העמודים הרלוונטיים.',
    },
    empty: { title: 'לא מצאנו טקסט בקובץ', body: 'הקובץ ריק. נסו קובץ אחר.' },
    nothing_readable: {
      title: 'לא הצלחנו לקרוא את הקובץ',
      body: 'אף עמוד בקובץ לא נקרא. נסו קובץ חד יותר או קובץ אחר.',
      bodyVisionOff: 'הקובץ נראה סרוק או מצולם. הפעילו את "המודל יודע לקרוא תמונות" בהגדרות, או בחרו מודל שתומך בתמונות.',
    },
    corrupt: { title: 'הקובץ פגום או לא תקין', body: 'נסו לשמור אותו מחדש ולהעלות שוב.' },
    locked: { title: 'הקובץ מוגן בסיסמה', body: 'הסירו את הסיסמה ונסו שוב.' },
    unsupported: {
      legacy_office: {
        title: 'סוג הקובץ הישן לא נתמך',
        body: 'שמרו את הקובץ כ-PDF או כ-DOCX והעלו אותו שוב.',
      },
      media: { title: 'קבצי שמע ווידאו עדיין לא נתמכים', body: 'בקרוב! בינתיים אפשר להעלות תמלול כטקסט.' },
      archive: { title: 'קבצי ZIP עדיין לא נתמכים', body: 'פתחו את הארכיון והעלו כל קובץ בנפרד.' },
      unknown_type: {
        title: 'סוג הקובץ לא נתמך',
        body: 'אפשר להעלות PDF, Word, מצגת, גיליון, טקסט או תמונה.',
      },
    },
  },

  // Warnings of the reading step, by code.
  warnings: {
    rows_capped: 'הטבלה ארוכה, אז קראנו רק את {shown} השורות הראשונות מתוך {total}.',
    columns_capped: 'בטבלה יש הרבה עמודות. קראנו רק את {shown} הראשונות מתוך {total}.',
    pages_capped: 'הקובץ ארוך, אז קראנו רק {read} עמודים מתוך {total}.',
    vision_off: 'עמודים {pages} נראים סרוקים או מצולמים ודולגו. הפעילו קריאת תמונות בהגדרות כדי לכלול אותם.',
    vision_capped: 'קראנו בעזרת ראייה רק {limit} עמודים, ו-{skipped} עמודים דולגו.',
    no_vision_model: 'המודל שבחרתם לא יודע לקרוא תמונות, ולכן עמודים {pages} דולגו.',
    text_layer_replaced:
      'עמודים {pages} סרוקים, והטקסט שמוטמע בהם לא תאם את התמונה. השתמשנו בטקסט שהמודל קרא מהתמונה.',
    text_layer_unchecked:
      'עמודים {pages} סרוקים וכוללים טקסט מוטמע, אבל לא בדקנו אותו מול התמונה. הפעילו קריאת תמונות בהגדרות כדי לבדוק.',
    very_short: 'נמצא מעט מאוד טקסט ({chars} תווים). השיעור עשוי להיות קצר.',
  },

  report: {
    title: 'קראנו את הקובץ',
    pages: '{count} עמודים',
    chipText: 'נקרא כטקסט',
    chipVision: 'נקרא בעזרת ראייה',
    chipSkipped: 'דולג',
    chipFailed: 'לא ניתן לקרוא',
    page: 'עמוד {number}',
    previewTitle: 'תצוגה מקדימה של הטקסט',
    promptTitle: 'ההנחיה למורה ה-AI',
    noPrompt: 'לא כתבתם הנחיה, אז השיעור יהיה ברור וניטרלי.',
    back: 'חזרה',
    start: 'התחלת שיעור',
    planning: 'בונים לכם שיעור...',
    planningSlow: 'מעירים את המודל... בקשה ראשונה אחרי הפסקה יכולה לקחת עד 20 שניות',
  },

  lesson: {
    stepCounter: 'שלב {current} מתוך {total}',
    exit: 'יציאה',
    backToUpload: 'חזרה להעלאת קובץ',
    exitConfirm: 'לצאת מהשיעור? ההתקדמות לא תישמר.',
    pathLabel: 'ההתקדמות בשיעור',
    outline: 'מפת השיעור',
    openOutline: 'פתיחת מפת השיעור',
    outlineDone: 'הושלם',
    outlineCurrent: 'עכשיו',
    outlineNext: 'בהמשך',
    from: 'שיעור מתוך',
    source: 'מקור',
    sourceFor: 'מקור · {label}',
    sourceNote: 'זה הקטע מהקובץ שעליו מבוסס ההסבר. הוא מוצג בשפה ובכיוון המקוריים שלו.',
    sourceEmpty: 'אין קטע מקור להודעה הזאת.',
    inputLabel: 'התשובה שלכם',
    inputPlaceholder: 'כתבו כאן את התשובה...',
    charsLeft: '{count} תווים מעל המגבלה',
    send: 'שליחה',
    stop: 'עצירה',
    hint: 'רמז',
    noMoreHints: 'אין עוד רמזים',
    hintLevel: 'רמז {level} מתוך {max}',
    hintAsked: 'ביקשתם רמז',
    thinking: 'חושבים על זה...',
    waking: 'מעירים את המודל...',
    stopped: 'התשובה נעצרה באמצע.',
    continueAnswer: 'המשך',
    retryTurn: 'המורה עוד לא ענה. אפשר לנסות שוב.',
    stepDone: 'השלב הושלם!',
    // The title of a hint bubble, by the reason for the hint.
    hintTitles: {
      asked: 'הנה רמז קטן',
      partial: 'כמעט! בואו נשלים את זה',
      wrong: 'לא בדיוק, בואו ננסה מכיוון אחר',
    },
    stuckTitle: 'בואו נבין את זה ביחד',
    chatLabel: 'השיחה עם המורה',
    askedBefore: 'שאלה טובה! שמרנו אותה לסוף השיעור.',
  },

  complete: {
    title: 'סיימתם את השיעור! הנה מה שלמדנו',
    steps: '{done} מתוך {total} שלבים',
    attempts: 'ניסיונות',
    hints: 'רמזים',
    recapTitle: 'מה למדנו',
    parkedTitle: 'השאלה ששמרנו לסוף',
    parkedBody: 'אפשר לשאול אותה עכשיו את המורה בכיתה.',
    effort: 'כל רמז וכל ניסיון נוסף הם חלק מהלמידה. זה בדיוק איך המוח מתחזק.',
    viewChat: 'לצפייה בשיחה',
    newLesson: 'שיעור חדש',
  },

  // Texts for an error of the server or of the network, by code. `action: true` offers the settings.
  apiErrors: {
    bad_key: { title: 'מפתח ה-API לא תקין', action: true },
    overloaded: { title: 'המודל עמוס כרגע. נסו שוב בעוד רגע או בחרו מודל אחר', action: true },
    rate_limited: { title: 'יותר מדי בקשות, נסו שוב בעוד כמה שניות' },
    no_vision: { title: 'המודל שבחרתם לא יודע לקרוא תמונות', action: true },
    network: { title: 'אין חיבור לאינטרנט' },
    timeout: { title: 'התשובה לקחה יותר מדי זמן, נסו שוב' },
    too_large: { title: 'הבקשה גדולה מדי, נסו קובץ קטן יותר' },
    bad_request: { title: 'משהו בבקשה לא תקין. בדקו את ההגדרות ונסו שוב', action: true },
    provider_error: { title: 'משהו השתבש, נסו שוב' },
  },

  tutor: {
    label: 'ברק, המורה: {mood}',
    moods: {
      talk: 'מדבר',
      think: 'חושב',
      cheer: 'שמח',
      encourage: 'מעודד',
      lean: 'רוכן לעזור',
      sleepy: 'ממתין',
      dance: 'רוקד',
      still: 'מקשיב',
    },
  },

  // Six phrases, so the praise does not repeat and turn into noise.
  praises: ['כל הכבוד!', 'מעולה!', 'בול!', 'יפה מאוד!', 'וואו, בדיוק!', 'איזו חשיבה חדה!'],
}

export const fmt = (template, values) =>
  template.replace(/\{(\w+)\}/g, (slot, name) => (name in values ? String(values[name]) : slot))
