from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
import pandas as pd
import nltk
import os
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Adjust as needed

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/medicineDB"
mongo = PyMongo(app)

# Tokenization function
def tokenize(text):
    return nltk.word_tokenize(text.lower().replace(" ", ""))  # Convert to lowercase and remove spaces

# Define possible keywords
KEYWORDS = [
    'painrelief', 'feverreduction', 'antiemetic', 'antidiarrheal',
    'antitussive', 'expectorant', 'decongestant', 'antihistamine',
    'antiseptic', 'analgesic', 'sedative', 'hypnotic', 'anxiolytic',
    'antidepressant', 'antibiotic', 'antipyretic', 'antifungal',
    'antiviral', 'antiinflammatory', 'bronchodilator', 
    'cardiovascularsupport', 'gastrointestinalrelief',
    'neurologicalsupport', 'respiratorysupport', 'immunomodulator', 'headache'
]

def find_matching_substitutes(tokens):
    matching_substitutes = []
    for token in tokens:
        if token in KEYWORDS:
            # Retrieve medicines matching the token
            medicines = mongo.db.medicines.find({
                "$or": [
                    {"use0": token},
                    {"use1": token},
                    {"use2": token},
                    {"use3": token},
                    {"use4": token}
                ]
            })
            for medicine in medicines:
                # Collect substitutes from substitute0 to substitute4
                substitutes = [
                    medicine.get('substitute0'),
                    medicine.get('substitute1'),
                    medicine.get('substitute2'),
                    medicine.get('substitute3'),
                    medicine.get('substitute4')
                ]
                # Filter out None values
                substitutes = [sub for sub in substitutes if sub]
                matching_substitutes.extend(substitutes)
    return matching_substitutes

@app.route('/', methods=['GET'])
def home():
    return "Flask server is running.", 200

@app.route('/load-data', methods=['POST'])
def load_data():
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'medicine_dataset.csv')
        if not os.path.exists(csv_path):
            logger.error("medicine_dataset.csv not found.")
            return jsonify({"error": "medicine_dataset.csv not found."}), 400
        df = pd.read_csv(csv_path)
        data = df.to_dict(orient='records')
        mongo.db.medicines.insert_many(data)
        logger.info("Data loaded successfully.")
        return jsonify({"message": "Data loaded successfully!"}), 200
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        # Tokenize the user's message
        tokens = tokenize(user_message)
        
        # Find matching substitutes based on keywords
        matching_substitutes = find_matching_substitutes(tokens)
        
        matching_substitutes = matching_substitutes[:5]

        # Prepare the response
        if matching_substitutes:
            response_message = {
                "message": "We found the following medicines that can help you:",
                "substitutes": matching_substitutes
            }
        else:
            response_message = {
                "message": "I'm sorry, I couldn't find any medicines for your symptoms."
            }

        return jsonify(response_message), 200
    except Exception as e:
        logger.error(f"Error in /chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    nltk.download('punkt')  # Ensure 'punkt' is downloaded before running
    app.run(debug=True)
