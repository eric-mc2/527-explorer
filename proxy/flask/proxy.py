from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:*", "http://localhost:*"]}})

API_BASE_URL = "https://projects.propublica.org/527-explorer"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def proxy_request(path):
    try:
        full_url = f"{API_BASE_URL}/{path}"
        app.logger.info(f"Proxying request: {full_url}")
        app.logger.info(f"Query params: {dict(request.args)}")
        response = requests.get(full_url, params=request.args, verify=True)
        response.raise_for_status()
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        app.logger.error(f"Request error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(ssl_context='adhoc')  # Generates self-signed certificate
