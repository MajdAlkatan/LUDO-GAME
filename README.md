
# مشروع لعبة Ludo مع ذكاء اصطناعي


---

## المكونات الرئيسية

### 1. الفئات الأساسية

#### أ. `Game` (اللعبة)
- **الوظيفة**: إدارة تدفق اللعبة الرئيسي
- **المهام**:
  - التحكم في دور اللاعبين
  - إدارة رمي النرد
  - تنفيذ خوارزمية الذكاء الاصطناعي
  - التنسيق بين المكونات الأخرى

#### ب. `Board` (اللوحة)
- **الوظيفة**: إدارة حالة اللعبة الفعلية
- **المهام**:
  - تتبع مواقع القطع
  - التحقق من الاصطدامات والإزالات
  - إعادة تعيين المواقع

#### ج. `Player` (اللاعب)
- **الوظيفة**: تمثيل بيانات اللاعب
- **المهام**:
  - إدارة القطع الأربعة الخاصة باللاعب
  - تحديد القطع القابلة للحركة

#### د. `Piece` (قطعة اللعبة)
- **الوظيفة**: تمثيل قطعة فردية
- **المهام**:
  - حساب الحركات
  - التحقق من الأهلية للحركة
  - إدارة المواقع الخاصة بالقطعة

---

### 2. الخوارزميات الرئيسية

#### أ. خوارزمية Expectimax
- **الهدف**: اختيار أفضل حركة للكمبيوتر مع مراعاة الاحتمالات
- **التنفيذ**:
  - بناء شجرة قرارات بعمق 3 مستويات (`AI_CONFIG.SEARCH_DEPTH`)
  - تقييم كل حالة باستخدام دالة `evaluateState()`
  - حساب القيمة المتوقعة مع مراعاة احتمالات النرد

#### ب. تقييم الحالة (`evaluateState`)
- **المعايير**:
  - تقدم القطع نحو المنزل (+10 لكل خطوة)
  - القطع في مواقع آمنة (+50)
  - القطع في المنزل (+1000)
  - عرقلة الخصم (+100)
  - تجنب المواقع الخطرة (-30)

---

### 3. التدفق الرئيسي للعبة

1. **رمي النرد**:
   - يتم تمكين الزر للاعب البشري أو التنفيذ التلقائي للكمبيوتر
   - معالجة حالات 6 متتالية (3 مرات تفقد الدور)

2. **تحديد القطع القابلة للحركة**:
   - التحقق من:
     - وجود القطعة في القاعدة (تتطلب 6 للخروج)
     - عدم تجاوز مدخل المنزل

3. **تنفيذ الحركة**:
   - للبشر: تمييز القطع القابلة للحركة
   - للكمبيوتر: استخدام `getBestComputerMove()`

4. **الاصطدامات**:
   - إعادة القطع إلى القاعدة إذا التقيت في موقع غير آمن

---

## الهيكل التنظيمي للكود
/ludo
|-- Board.js # إدارة لوحة اللعبة
|-- Game.js # المنطق الرئيسي للعبة
|-- Player.js # تمثيل اللاعبين
|-- Piece.js # إدارة القطع الفردية
|-- constants.js # الثوابت والإعدادات
|-- UI.js # إدارة الواجهة الرسومية
|-- node.js # عقد قرارات الذكاء الاصطناعي
|-- state.js # تمثيل حالة اللعبة

---

## نقاط القوة في التصميم

1. **فصل الواجهة عن المنطق**:
   - الواجهة (`UI.js`) مستقلة تمامًا عن منطق اللعبة
   
2. **نظام الحالات**:
   - `GameState` لعزل الحالات أثناء المحاكاة
   
3. **الذكاء الاصطناعي القابل للتعديل**:
   - عمق البحث وعدد الفروع قابلة للتخصيص عبر `AI_CONFIG`

4. **إدارة الأخطاء**:
   - تحقق من صحة الحركات قبل التنفيذ
   - معالجة الحالات الطارئة (مثل 3 ستات متتالية)

---

## كيفية التشغيل
1. تأكد من وجود خادم ويب محلي
2. افتح ملف `index.html` في المتصفح
3. ابدأ اللعب بالنقر على زر النرد

---

##  نقاط للمستقبل
- إضافة واجهة رسومية أكثر تفاعلية
- تحسين أداء خوارزمية البحث بتقنية التقليم (Pruning)
- إمكانية تخصيص إعدادات اللعبة عبر واجهة المستخدم