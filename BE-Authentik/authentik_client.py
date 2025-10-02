#authentik_client.py
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
        response.raise_for_status()
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