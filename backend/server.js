const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "JustJournalSecretKey2025"; 


const users = [
    { id: 1, email: "admin@just.edu.jo", password: "123", privilege: "editor" },
    { id: 2, email: "dr.ahmad@just.edu.jo", password: "123", privilege: "author" },
    { id: 3, email: "student@just.edu.jo", password: "123", privilege: "researcher" }
];

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

        res.json({ 
            success: true, 
            token, 
            user: {
                id: user.id ,
                name: user.email, 
                role: user.privilege
                
            } 
        });
    } else {
        res.status(401).json({ success: false, message: "إيميل أو باسورد غلط!" });
    }
});

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});

//--- File Upload Setup (if needed in future) ---

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const researches = [];

// 3. API الرفع
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        // const { title, authorId } = req.body;
        const { title } = req.body;
        const authorId = parseInt(req.body.authorId);    
        const filePath = req.file.path; 

        const newResearch = {
           id: researches.length + 1,
            title: title,
            authorId: authorId, // الآن سيتخزن كرقم (أصفر) وليس نص (أخضر)
            filePath: filePath,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };

        researches.push(newResearch);
        
        console.log("Research Uploaded:", newResearch);
        res.json({ success: true, message: "تم رفع البحث بنجاح!", research: newResearch });

    } catch (error) {
        res.status(500).json({ success: false, message: "فشل رفع الملف" });
    }
});

app.get('/api/pending-researches', (req, res) => {
    const pending = researches.filter(r => r.status === 'Pending');
    res.json(pending);
});


app.get('/api/pending-researches', (req, res) => {
    const pending = researches.filter(r => r.status === 'Pending');
    res.json(pending);
});

app.post('/api/update-status', (req, res) => {
    const { researchId, status } = req.body; // status رح تكون يا 'Approved' يا 'Rejected'

    const research = researches.find(r => r.id === researchId);

    if (research) {
        research.status = status; 
        console.log(`Research ${researchId} is now ${status}`);
        res.json({ success: true, message: `تم تغيير الحالة إلى ${status}` });
    } else {
        res.status(404).json({ success: false, message: "البحث غير موجود" });
    }
});


const categories = ['Computer Science', 'Medicine', 'Engineering'];


// A. للباحث (Researcher): جيب بس الأبحاث الموافق عليها
//هون اذا بدنا نعدل اشي عشان يطلع الابحاث لل (Researcher)
app.get('/api/approved-researches', (req, res) => {
    // بنرجع البحث ومعاه اسم المؤلف والتصنيف
    const approved = researches.filter(r => r.status === 'Approved');
    res.json(approved);
});

// B. للمؤلف (Author): جيب أبحاثي أنا بس (بناءً على الآيدي)
app.get('/api/my-researches/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const myWork = researches.filter(r => r.authorId === authorId);
    res.json(myWork);
});

// C. للمحرر (Editor): جيب قائمة التصنيفات عشان يعبيها بالـ Dropdown
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

// D. للمحرر (Editor): إضافة تصنيف جديد
app.post('/api/categories', (req, res) => {
    const { newCategory } = req.body;
    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        res.json({ success: true, message: "تمت إضافة التصنيف", categories });
    } else {
        res.status(400).json({ success: false, message: "التصنيف موجود مسبقاً أو فارغ" });
    }
});

// E. تعديل API الموافقة (عشان يقبل التصنيف كمان)
app.post('/api/update-status', (req, res) => {
    const { researchId, status, category } = req.body; // ضفنا category

    const research = researches.find(r => r.id === researchId);
    if (research) {
        research.status = status;
        // إذا وافق عليه، بنحفظ التصنيف
        if (status === 'Approved' && category) {
            research.category = category;
        }
        res.json({ success: true, message: "تم التحديث بنجاح" });
    } else {
        res.status(404).json({ success: false, message: "غير موجود" });
    }
});