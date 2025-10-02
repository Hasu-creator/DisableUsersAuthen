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
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:100]}")
        if response.status_code == 200:
            print("   ✅ Bearer format WORKS!")
            return API_HEADERS_BEARER
    except Exception as e:
        print(f"   ❌ Bearer failed: {e}")
    
    print("\n🧪 Testing Token format...")
    try:
        response = requests.get(test_url, headers=API_HEADERS_TOKEN, verify=False)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:100]}")
        if response.status_code == 200:
            print("   ✅ Token format WORKS!")
            return API_HEADERS_TOKEN
    except Exception as e:
        print(f"   ❌ Token failed: {e}")
    
    print("\n❌ Both authentication methods failed!")
    return None

# Test khi import module
print("=" * 60)
print("Testing Authentik Authentication...")
print("=" * 60)
WORKING_HEADERS = test_authentication()
print("=" * 60)

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
    
    search_url = f"{AUTHENTIK_URL}/api/v3/core/users/?username={username}"
    
    try:
        response = requests.get(search_url, headers=WORKING_HEADERS, verify=False) 
        response.raise_for_status() 
        
        data = response.json()
        
        if not data['results']:
            print(f"❌ Không tìm thấy người dùng với username '{username}'")
            return False, "User not found"
        
        user_pk = data['results'][0]['pk']
        print(f"✅ Tìm thấy User ID: {user_pk}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi tìm kiếm User: {e}")
        return False, f"API Search Error: {e}"

    update_url = f"{AUTHENTIK_URL}/api/v3/core/users/{user_pk}/"
    update_data = {"is_active": False}
    
    try:
        response = requests.patch(update_url, headers=WORKING_HEADERS, json=update_data, verify=False)
        response.raise_for_status()
        
        if response.json().get('is_active') is False:
            print(f"✅ Vô hiệu hóa thành công tài khoản '{username}'")
            return True, f"User '{username}' successfully disabled."
        else:
            print(f"⚠️ Cập nhật thành công nhưng trạng thái is_active không phải False.")
            return True, "Update successful, but check status."

    except requests.exceptions.RequestException as e:
        print(f"❌ Lỗi khi vô hiệu hóa User: {e}")
        return False, f"API Update Error: {e}"