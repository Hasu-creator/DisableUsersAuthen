from flask import Flask, request, jsonify
from flask_cors import CORS
from waitress import serve
from authentik_client import disable_user_in_authentik, get_all_users_from_authentik, activate_user_in_authentik, get_inactive_users_from_authentik
app = Flask(__name__)

# CORS config - cho phép cả localhost:3000 và localhost:5173
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/api/disable_user', methods=['POST'])
def handle_disable_request():
    data = request.get_json()
    username_to_disable = data.get('username')
    
    if not username_to_disable:
        return jsonify({"success": False, "message": "Username is required"}), 400

    print(f"Nhận yêu cầu vô hiệu hóa cho: {username_to_disable}")

    success, message = disable_user_in_authentik(username_to_disable)
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 500

@app.route('/api/users', methods=['GET'])
def list_users():
    print("Nhận yêu cầu lấy danh sách users")  # Debug log
    success, result = get_all_users_from_authentik()
    
    if success:
        print(f"Trả về {len(result)} users")  # Debug log
        return jsonify(result), 200
    else:
        print(f"Lỗi: {result}")  # Debug log
        return jsonify({"success": False, "message": result}), 500

# Thêm route test
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200


# Route mới: Lấy danh sách users inactive
@app.route('/api/users/inactive', methods=['GET'])
def list_inactive_users():
    print("📥 Nhận yêu cầu lấy danh sách users inactive")
    success, result = get_inactive_users_from_authentik()
    
    if success:
        print(f"✅ Trả về {len(result)} users inactive")
        return jsonify(result), 200
    else:
        print(f"❌ Lỗi: {result}")
        return jsonify({"success": False, "message": result}), 500


# Route mới: Activate user
@app.route('/api/activate_user', methods=['POST'])
def handle_activate_request():
    data = request.get_json()
    username_to_activate = data.get('username')
    
    if not username_to_activate:
        return jsonify({"success": False, "message": "Username is required"}), 400

    print(f"📥 Nhận yêu cầu kích hoạt lại cho: {username_to_activate}")

    success, message = activate_user_in_authentik(username_to_activate)
    if success:
        print(f"✅ Kích hoạt thành công: {username_to_activate}")
        return jsonify({"success": True, "message": message}), 200
    else:
        print(f"❌ Kích hoạt thất bại: {message}")
        return jsonify({"success": False, "message": message}), 500

if __name__ == '__main__':
    print("Starting Waitress server on http://0.0.0.0:5000")
    serve(app, host='0.0.0.0', port=5000)
