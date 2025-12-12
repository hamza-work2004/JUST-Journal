const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // عشان نحذف الملفات من الكمبيوتر

const app = express();
app.use(cors());
app.use(bodyParser.json());

// مهم جداً: فتح مجلد uploads عشان نقدر نشوف الملفات
app.use('/uploads', express.static('uploads'));

const SECRET_KEY = "JustJournalSecretKey2025"; 

const users = [
    { id: 1, email: "admin@just.edu.jo", password: "123", privilege: "editor" },
    { id: 2, email: "dr.ahmad@just.edu.jo", password: "123", privilege: "author" },
    { id: 3, email: "student@just.edu.jo", password: "123", privilege: "researcher" }
];

const researches = []; // الداتا بيس المؤقتة

// Sign Up API
app.post('/api/signup', (req, res) => {
    const { name, email, password, privilege } = req.body;

    // 1. فحص إذا الإيميل موجود
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: "الإيميل مستخدم مسبقاً" });
    }

    // 2. إنشاء يوزر جديد مع ID
    const newUser = {
        id: users.length + 1, // بنعطيه رقم تسلسلي
        email: email,
        password: password, // ملاحظة: في المشروع الحقيقي لازم يتشفر
        name: name,
        privilege: privilege || 'researcher' // الافتراضي باحث
    };

    // 3. الحفظ
    users.push(newUser);
    console.log("New User Registered:", newUser);
    
    res.json({ success: true, message: "تم إنشاء الحساب بنجاح" });
});

// --- 1. Login API ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.privilege }, 
            SECRET_KEY, 
            { expiresIn: '2h' } 
        );
        // رجعنا الآيدي عشان نستخدمه في الفرونت
        res.json({ success: true, token, user: { id: user.id, name: user.email, role: user.privilege } });
    } else {
        res.status(401).json({ success: false, message: "إيميل أو باسورد غلط!" });
    }
});

// --- 2. File Upload Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // تأكد إن المجلد موجود، أو انشئه يدوياً
        if (!fs.existsSync('uploads/')){
            fs.mkdirSync('uploads/');
        }
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // اسم ملف مميز عشان ما يتكرر
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// فلتر أنواع الملفات (حماية السيرفر)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('فقط ملفات PDF و Word مسموحة!'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- 3. APIs ---

// رفع بحث جديد
app.post('/api/upload', (req, res) => {
    // استخدمنا upload جوا الدالة عشان نمسك الإيرور تبع الفلتر
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: "الرجاء اختيار ملف" });
        }

        try {
            const { title } = req.body;
            const authorId = parseInt(req.body.authorId); // تحويل لرقم
            
            const newResearch = {
                id: researches.length + 1,
                title: title,
                authorId: authorId,
                filePath: req.file.filename, // اسم الملف بس
                status: 'Pending',
                category: null,
                note: '', // ملاحظات الرفض
                date: new Date().toISOString().split('T')[0]
            };

            researches.push(newResearch);
            console.log("Uploaded:", newResearch);
            res.json({ success: true, message: "تم الرفع بنجاح!", research: newResearch });

        } catch (error) {
            res.status(500).json({ success: false, message: "فشل السيرفر" });
        }
    });
});

// حذف بحث (فقط إذا كان Pending)
app.delete('/api/research/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = researches.findIndex(r => r.id === id);

    if (index !== -1) {
        const research = researches[index];
        
        // حماية: ممنوع حذف الموافق عليه
        // if (research.status !== 'Pending') {
        //     return res.status(403).json({ success: false, message: "لا يمكن حذف بحث تم تقييمه" });
        // }

        // 1. حذف الملف من الكمبيوتر
        const fullPath = path.join(__dirname, 'uploads', research.filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        // 2. حذف من المصفوفة
        researches.splice(index, 1);
        res.json({ success: true, message: "تم الحذف بنجاح" });
    } else {
        res.status(404).json({ success: false, message: "غير موجود" });
    }
});


app.put('/api/research/:id', upload.single('file'), (req, res) => {
    const id = parseInt(req.params.id);
    const research = researches.find(r => r.id === id);

    if (!research) return res.status(404).json({ success: false, message: "غير موجود" });

    // حماية: ممنوع التعديل إذا كان Approved (بس الحذف مسموح)
    // إذا بدك تسمح بالتعديل حتى بعد النشر، شيل هذا الشرط
    if (research.status !== 'Pending') {
        return res.status(403).json({ success: false, message: "لا يمكن تعديل بحث تم نشره (يمكنك حذفه ورفعه مجدداً)" });
    }

    // تحديث العنوان
    if (req.body.title) {
        research.title = req.body.title;
    }

    // تحديث الملف (إذا رفع واحد جديد)
    if (req.file) {
        // 1. احذف القديم
        const oldPath = path.join(__dirname, 'uploads', research.filePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        
        // 2. اعتمد الجديد
        research.filePath = req.file.filename;
    }

    console.log("Updated:", research);
    res.json({ success: true, message: "تم التعديل بنجاح" });
});

// جلب الأبحاث المعلقة
app.get('/api/pending-researches', (req, res) => {
    const pending = researches.filter(r => r.status === 'Pending');
    res.json(pending);
});

// تحديث الحالة (موافقة أو رفض مع سبب)
app.post('/api/update-status', (req, res) => {
    const { researchId, status, category, note } = req.body; 

    const research = researches.find(r => r.id === researchId);

    if (research) {
        research.status = status;
        
        if (status === 'Approved' && category) {
            research.category = category;
            research.note = ''; // تنظيف الملاحظات لو وافقنا
        }
        
        if (status === 'Rejected' && note) {
            research.note = note; // حفظ سبب الرفض
        }

        res.json({ success: true, message: `تم التحديث: ${status}` });
    } else {
        res.status(404).json({ success: false, message: "البحث غير موجود" });
    }
});

// التصنيفات
const categories = ['Computer Science', 'Medicine', 'Engineering'];

app.get('/api/categories', (req, res) => res.json(categories));

app.post('/api/categories', (req, res) => {
    const { newCategory } = req.body;
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: "موجود مسبقاً" });
    }
});

// جلب أبحاث الباحث (Researcher)
app.get('/api/approved-researches', (req, res) => {
    const approved = researches.filter(r => r.status === 'Approved');
    res.json(approved);
});

// جلب أبحاث المؤلف (Author)
app.get('/api/my-researches/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const myWork = researches.filter(r => r.authorId === authorId);
    res.json(myWork);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});