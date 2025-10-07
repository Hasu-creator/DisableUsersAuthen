import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

AUTHENTIK_URL = "https://ssotest.sctvdev.top"
API_TOKEN = "3Vw3z2QiPL4q3KfhQ3A902qtS82JVH2gqFoZ2mS9EMCp7PXZ7RPSjjElo4BL"

# Thử cả 2 format
API_HEADERS_BEARER = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

API_HEADERS_TOKEN = {
    "Authorization": f"Token {API_TOKEN}",
    "Content-Type": "application/json"
}

def test_authentication():
    """Test cả 2 format authentication"""
    test_url = f"{AUTHENTIK_URL}/api/v3/core/users/?is_active=true&page_size=1"
    
    print("🧪 Testing Bearer format...")
    try:
        response = requests.get(test_url, headers=API_HEADERS_BEARER, verify=False)
        if response.status_code == 200:
            print("   ✅ Bearer format WORKS!")
            return API_HEADERS_BEARER
    except Exception as e:
        print(f"   ❌ Bearer failed: {e}")
    
    print("\n🧪 Testing Token format...")
    try:
        response = requests.get(test_url, headers=API_HEADERS_TOKEN, verify=False)
        if response.status_code == 200:
            print("   ✅ Token format WORKS!")
            return API_HEADERS_TOKEN
    except Exception as e:
        print(f"   ❌ Token failed: {e}")
    
    print("\n❌ Both authentication methods failed!")
    return None

WORKING_HEADERS = test_authentication()

def get_all_users_from_authentik():
    if not WORKING_HEADERS:
        return False, "Authentication failed. Please check your API token."
    
    list_url = f"{AUTHENTIK_URL}/api/v3/core/users/?is_active=true&page_size=1000"
    
    try:
        response = requests.get(list_url, headers=WORKING_HEADERS, verify=False)
        response.raise_for_status()
        
        data = response.json()
        
        user_list = [
            {
                "username": user["username"],
                "name": f"{user.get('name', 'N/A')} ({user['username']})",
                "email": user["email"]
            }
            for user in data.get("results", [])
        ]

        print(f"✅ Lấy thành công {len(user_list)} người dùng đang hoạt động.")
        return True, user_list

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi lấy danh sách User: {e}")
        return False, f"API List Error: {e}"

def disable_user_in_authentik(username):
    if not WORKING_HEADERS:
        return False, "Authentication failed. Please check your API token."
    
    # Tìm user
    search_url = f"{AUTHENTIK_URL}/api/v3/core/users/?username={username}"
    try:
        response = requests.get(search_url, headers=WORKING_HEADERS, verify=False) 
        response.raise_for_status() 
        data = response.json()
        
        if not data['results']:
            print(f"❌ Không tìm thấy người dùng với username '{username}'")
            return False, "User not found"
        
        user = data['results'][0]
        user_pk = user['pk']
        print(f"✅ Tìm thấy User ID: {user_pk}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi tìm kiếm User: {e}")
        return False, f"API Search Error: {e}"

    # Disable user
    update_url = f"{AUTHENTIK_URL}/api/v3/core/users/{user_pk}/"
    update_data = {"is_active": False}
    try:
        response = requests.patch(update_url, headers=WORKING_HEADERS, json=update_data, verify=False)
        print(f"📊 Response Status: {response.status_code}")
        print(f"📄 Response Body: {response.text[:200]}")
        
        if response.status_code == 403:
            print("❌ LỖI 403: Token không có quyền 'Change User'!")
            return False, "Permission denied. Token needs 'Change User' permission."
        response.raise_for_status()
        
        verify_response = requests.get(search_url, headers=WORKING_HEADERS, verify=False)
        user_status = verify_response.json()['results'][0]['is_active']
        print(f"🔍 Verify: is_active = {user_status}")
        
        if user_status == False:
            print(f"✅ XÁC NHẬN: User {username} đã bị deactivate!")
        else:
            print(f"⚠️ CẢNH BÁO: is_active vẫn là True!")
        print(f"✅ Set is_active=False cho {username}")
    except requests.exceptions.RequestException as e:
        return False, f"API Update Error: {e}"

    # Xoá session của user
    try:
        session_url = f"{AUTHENTIK_URL}/api/v3/core/sessions/?user={user_pk}"
        resp_sessions = requests.get(session_url, headers=WORKING_HEADERS, verify=False)
        if resp_sessions.status_code == 200:
            sessions = resp_sessions.json().get("results", [])
            for s in sessions:
                sid = s["id"]
                del_url = f"{AUTHENTIK_URL}/api/v3/core/sessions/{sid}/"
                requests.delete(del_url, headers=WORKING_HEADERS, verify=False)
            print(f"🗑 Xoá {len(sessions)} session cho user {username}")
    except Exception as e:
        print(f"⚠️ Lỗi xoá sessions: {e}")

    # Xoá token OAuth cho user
    try:
        token_url = f"{AUTHENTIK_URL}/api/v3/core/tokens/?user={user_pk}"
        resp_tokens = requests.get(token_url, headers=WORKING_HEADERS, verify=False)
        if resp_tokens.status_code == 200:
            tokens = resp_tokens.json().get("results", [])
            for t in tokens:
                tid = t["pk"]
                del_url = f"{AUTHENTIK_URL}/api/v3/core/tokens/{tid}/"
                requests.delete(del_url, headers=WORKING_HEADERS, verify=False)
            print(f"🗑 Xoá {len(tokens)} token cho user {username}")
    except Exception as e:
        print(f"⚠️ Lỗi xoá tokens: {e}")

    return True, f"User '{username}' disabled, sessions and tokens revoked."

def get_inactive_users_from_authentik():
    """Lấy danh sách users đã bị deactivate"""
    if not WORKING_HEADERS:
        return False, "Authentication failed. Please check your API token."
    
    list_url = f"{AUTHENTIK_URL}/api/v3/core/users/?is_active=false&page_size=1000"
    
    try:
        response = requests.get(list_url, headers=WORKING_HEADERS, verify=False)
        response.raise_for_status()
        
        data = response.json()
        
        user_list = [
            {
                "username": user["username"],
                "name": f"{user.get('name', 'N/A')} ({user['username']})",
                "email": user["email"],
                "deactivated_at": user.get("last_login", "N/A")
            }
            for user in data.get("results", [])
        ]

        print(f"✅ Lấy thành công {len(user_list)} người dùng đã bị deactivate.")
        return True, user_list

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi lấy danh sách User inactive: {e}")
        return False, f"API List Error: {e}"

def edit_user_in_authentik(username, update_data):
    """Chỉnh sửa thông tin tài khoản người dùng"""
    if not WORKING_HEADERS:
        return False, "Authentication failed. Please check your API token."
    
    # Tìm user
    search_url = f"{AUTHENTIK_URL}/api/v3/core/users/?username={username}"
    try:
        response = requests.get(search_url, headers=WORKING_HEADERS, verify=False) 
        response.raise_for_status() 
        data = response.json()
        
        if not data['results']:
            print(f"❌ Không tìm thấy người dùng với username '{username}'")
            return False, "User not found"
        
        user = data['results'][0]
        user_pk = user['pk']
        print(f"✅ Tìm thấy User ID: {user_pk}")
        print(f"📝 Current user data: name='{user.get('name')}', email='{user.get('email')}'")

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi tìm kiếm User: {e}")
        return False, f"API Search Error: {e}"

    # Cập nhật thông tin user
    update_url = f"{AUTHENTIK_URL}/api/v3/core/users/{user_pk}/"
    
    # Chuẩn bị data cần update - CHỈ gửi các trường có giá trị
    payload = {}
    if 'name' in update_data and update_data['name']:
        payload['name'] = update_data['name'].strip()
    if 'email' in update_data and update_data['email']:
        payload['email'] = update_data['email'].strip()
    
    if not payload:
        print("⚠️ Không có dữ liệu để cập nhật")
        return False, "No data to update"
    
    print(f"📤 Sending update payload: {payload}")
    
    try:
        response = requests.patch(update_url, headers=WORKING_HEADERS, json=payload, verify=False)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📄 Response Body: {response.text[:500]}")
        
        if response.status_code == 200:
            updated_user = response.json()
            print(f"✅ Cập nhật thành công tài khoản '{username}'")
            
            # Trả về data đúng format mà frontend expect
            return True, {
                "username": updated_user['username'],
                "name": updated_user.get('name', 'N/A'),
                "email": updated_user['email']
            }
        elif response.status_code == 403:
            print(f"❌ Lỗi Quyền truy cập (Status 403)")
            return False, "Permission denied. Token needs 'Change User' permission."
        else:
            print(f"❌ Lỗi API: Status {response.status_code}, Body: {response.text}")
            return False, f"API Error: {response.status_code} - {response.text}"
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi cập nhật User: {e}")
        return False, f"API Update Error: {e}"

def activate_user_in_authentik(username):
    """Kích hoạt lại tài khoản đã bị deactivate"""
    if not WORKING_HEADERS:
        return False, "Authentication failed. Please check your API token."
    
    # Tìm user
    search_url = f"{AUTHENTIK_URL}/api/v3/core/users/?username={username}"
    try:
        response = requests.get(search_url, headers=WORKING_HEADERS, verify=False) 
        response.raise_for_status() 
        data = response.json()
        
        if not data['results']:
            print(f"❌ Không tìm thấy người dùng với username '{username}'")
            return False, "User not found"
        
        user = data['results'][0]
        user_pk = user['pk']
        print(f"✅ Tìm thấy User ID: {user_pk}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi tìm kiếm User: {e}")
        return False, f"API Search Error: {e}"

    # Activate user
    update_url = f"{AUTHENTIK_URL}/api/v3/core/users/{user_pk}/"
    update_data = {"is_active": True}
    
    try:
        response = requests.patch(update_url, headers=WORKING_HEADERS, json=update_data, verify=False)
        
        if response.status_code == 200:
            print(f"✅ Kích hoạt thành công tài khoản '{username}'")
            return True, f"User '{username}' has been activated successfully."
        elif response.status_code == 403:
            print(f"❌ Lỗi Quyền truy cập (Status 403)")
            return False, "Permission denied. Token needs 'Change User' permission."
        else:
            print(f"❌ Lỗi API: Status {response.status_code}, Body: {response.text}")
            return False, f"API Error: {response.status_code}"
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi kích hoạt User: {e}")
        return False, f"API Update Error: {e}"