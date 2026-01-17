import requests
import json

url = 'http://localhost:8000/novels/7/chapters/'
headers = {'Content-Type': 'application/json'}
data = {
    'title': 'Chương 1: Khởi Đầu',
    'content': '<p>Ngày xửa ngày xưa, tại một vùng đất xa xôi...</p>',
    'order': 1
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(response.status_code)
    print(response.json())
except Exception as e:
    print(e)
