import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
app.config['SECRET_KEY'] = 'your-secret-key-here'

@app.route('/api/test')
def test_endpoint():
    return {'message': 'Backend is working!', 'status': 'success'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
