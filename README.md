# 🏥 Medicine Delivery Website

A full-stack **MERN** application for online medicine delivery, featuring **Stripe payment integration** and an **AI chatbot** powered by **Flask & NLP** to assist users with medicine-related queries.

---

## 🌟 Features

✅ **User Authentication** (Signup/Login)  
✅ **Medicine Search & Filtering**  
✅ **Cart Management**  
✅ **Stripe Payment Gateway**  
✅ **AI Chatbot for Medicine Queries** (Price, Dosage, Side Effects, etc.)  
✅ **Order Management**  
✅ **Responsive UI** (Light & Dark Mode)  

---

## 🛠️ Tech Stack

### **Frontend:**
- React.js
- Redux (for state management)
- Bootstrap / TailwindCSS

### **Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication

### **AI Chatbot:**
- Flask & Python
- NLTK for NLP processing
- FuzzyWuzzy for fuzzy matching
- Flask-PyMongo (to fetch medicine details from MongoDB)

### **Payment Integration:**
- Stripe API

---

## 🚀 Installation & Setup

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/your-username/medicine-delivery.git
cd medicine-delivery
```

### **2️⃣ Backend Setup**
```sh
cd backend
npm install  # Install dependencies
npm start    # Start backend server
```

### **3️⃣ AI Chatbot Setup**
```sh
cd chatbot
pip install -r requirements.txt  # Install Python dependencies
python app.py  # Start Flask chatbot
```

### **4️⃣ Frontend Setup**
```sh
cd frontend
npm install  # Install dependencies
npm start    # Start frontend
```

---

## 🤖 AI Chatbot Functionality
- Recognizes **user symptoms** and suggests medicines.
- Provides **medicine details** (price, dosage, side effects, etc.).
- Uses **fuzzy string matching** to detect medicine names with typos.
- Stores **chat history** for context-aware responses.

### **Chat API Endpoint:**
**POST** `/chat`
```json
{
  "message": "What are the side effects of Paracetamol?"
}
```
**Response:**
```json
{
  "message": "The side effects of Paracetamol include nausea, dizziness, and liver damage.",
  "medicines": []
}
```

---

## 💳 Stripe Payment Integration
- Secure payment processing with **Stripe API**.
- Stores **order details** and **payment history**.
- Provides a smooth checkout experience.

---

## 📌 To-Do List
- [ ] Implement **order tracking**.
- [ ] Improve **chatbot accuracy** with ML models.
- [ ] Add **voice-based assistant**.

---

## 💡 Contributing
1. Fork the repo 🍴
2. Create a new branch `git checkout -b feature-name` 🌿
3. Commit changes `git commit -m "Added new feature"` 📌
4. Push `git push origin feature-name` 🚀
5. Open a **Pull Request** 💬

---

## 📞 Contact
For any issues or feature requests, open an **issue** or reach out at:  
📧 Email: ombelose421@gmail.com 
💻 GitHub: [om1304](https://github.com/om1304)
