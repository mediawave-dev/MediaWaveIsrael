# התקנת MediaWave Israel - הוראות לקלוד קוד

## מה זה?
אתר של MediaWave Israel עם מערכת ניהול תוכן (CMS) מבוססת Directus.
הקובץ הזה מיועד לקלוד קוד - תעתיק לו את ההוראות והוא יעשה הכל, כולל התקנות.

מסד הנתונים כבר מוכן בתוך ה-repo עם כל התוכן והתרגום לעברית.

---

## פרומפט לקלוד קוד - תעתיק את הבלוק הזה:

```
תתקין לי את הפרויקט MediaWave Israel מאפס. תעשה הכל לבד, כולל התקנת כלים חסרים.

### שלב 1: בדיקה והתקנת Node.js
בדוק אם Node.js מותקן:
  node --version
אם לא מותקן או שהגרסה נמוכה מ-18, תתקין עם winget:
  winget install OpenJS.NodeJS.LTS
אחרי ההתקנה, רענן את הטרמינל ובדוק שוב שזה עובד.

### שלב 2: בדיקה והתקנת Docker Desktop
בדוק אם Docker מותקן:
  docker --version
אם לא מותקן, תתקין עם winget:
  winget install Docker.DockerDesktop
אחרי ריסטרט, ודא ש-Docker Desktop רץ (הפעל אותו מתפריט ההתחלה אם צריך).
בדוק עם: docker ps
אם מקבלים שגיאה - Docker Desktop לא רץ. תגיד לי לפתוח אותו ולחכות 30 שניות.

### שלב 3: בדיקה והתקנת Git
בדוק אם Git מותקן:
  git --version
אם לא מותקן, תתקין עם winget:
  winget install Git.Git

### שלב 4: התקנת חבילות הפרויקט
הרץ: npm install

### שלב 5: הקמת CMS
הרץ: docker compose up -d
חכה 30 שניות ואז בדוק שרץ: docker ps
ודא שיש קונטיינר של directus בסטטוס Up.
אם לא עולה, נסה שוב: docker compose down && docker compose up -d

הערה: מסד הנתונים כבר מוכן עם כל התוכן והתרגומים לעברית.
לא צריך להריץ סקריפטים נוספים.

### שלב 6: הפעלת האתר
הרץ: npm run dev
האתר יעלה בכתובת http://localhost:5173

### שלב 7: אימות
פתח בדפדפן ובדוק ששני הדברים עובדים:
- האתר: http://localhost:5173
- ממשק ניהול CMS: http://localhost:8055
  - אימייל: admin@mediawave.co.il
  - סיסמה: admin123

תדווח לי מה הצליח ומה לא.
```

---

## אם משהו לא עובד

### winget לא מזוהה
אם winget לא עובד, זה Windows ישן. תתקינו ידנית:
- Node.js: https://nodejs.org (גרסת LTS, הריצו את המתקין)
- Docker Desktop: https://www.docker.com/products/docker-desktop
- Git: https://git-scm.com/download/win

### Docker Desktop דורש WSL2
אם Docker מבקש WSL2, הריצו ב-PowerShell כמנהל:
```
wsl --install
```
והפעילו מחדש את המחשב.

### שגיאת port 8055 תפוס
```
docker compose down
docker compose up -d
```

### האתר עולה בלי נתונים מה-CMS
זה תקין - האתר מציג נתונים קבועים כברירת מחדל.
בדקו שה-Docker רץ: `docker ps`

---

## כיבוי
```
כדי לכבות הכל:
- לעצור את האתר: Ctrl+C בטרמינל
- לעצור את ה-CMS: docker compose down
```
