#!/usr/bin/env python3
"""Upload a file to Google Drive using stored OAuth token."""
import json, sys, os, subprocess

TOKEN_FILE = os.path.expanduser("~/.hermes/google_token.json")
CLIENT_FILE = os.path.expanduser("~/.hermes/google_client_secret.json")

def load_json(path):
    with open(path) as f:
        return json.load(f)

def refresh_token():
    creds = load_json(CLIENT_FILE)
    token = load_json(TOKEN_FILE)
    client_id = creds["installed"]["client_id"]
    client_secret = creds["installed"]["client_secret"]
    refresh_tok = token["refresh_token"]
    
    import urllib.request, urllib.parse
    data = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_tok,
        "grant_type": "refresh_token",
    }).encode()
    
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=data)
    resp = json.loads(urllib.request.urlopen(req).read())
    token["access_token"] = resp["access_token"]
    with open(TOKEN_FILE, "w") as f:
        json.dump(token, f, indent=2)
    return resp["access_token"]

def upload_file(filepath, name=None):
    token = load_json(TOKEN_FILE)
    access = token.get("access_token")
    
    import urllib.request, urllib.parse, mimetypes, json as j
    
    fname = name or os.path.basename(filepath)
    mime = mimetypes.guess_type(filepath)[0] or "application/octet-stream"
    
    # Metadata
    metadata = {"name": fname, "mimeType": mime}
    meta_bytes = j.dumps(metadata).encode()
    
    # File data
    with open(filepath, "rb") as f:
        file_data = f.read()
    
    # Multipart upload
    boundary = "HERMES_UPLOAD_BOUNDARY"
    body = (
        f"--{boundary}\r\n"
        f"Content-Type: application/json; charset=UTF-8\r\n\r\n"
        f"{meta_bytes.decode()}\r\n"
        f"--{boundary}\r\n"
        f"Content-Type: {mime}\r\n\r\n"
    ).encode() + file_data + f"\r\n--{boundary}--\r\n".encode()
    
    headers = {
        "Authorization": f"Bearer {access}",
        "Content-Type": f"multipart/related; boundary={boundary}",
        "Content-Length": str(len(body)),
    }
    
    req = urllib.request.Request(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        data=body, headers=headers, method="POST"
    )
    
    try:
        resp = urllib.request.urlopen(req)
        result = j.loads(resp.read())
        return result
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("Token expired, refreshing...")
            access = refresh_token()
            headers["Authorization"] = f"Bearer {access}"
            req = urllib.request.Request(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                data=body, headers=headers, method="POST"
            )
            resp = urllib.request.urlopen(req)
            result = j.loads(resp.read())
            return result
        raise

def make_public(file_id):
    token = load_json(TOKEN_FILE)
    import urllib.request, urllib.parse, json as j
    headers = {"Authorization": f"Bearer {token['access_token']}"}
    data = j.dumps({"role": "reader", "type": "anyone"}).encode()
    req = urllib.request.Request(
        f"https://www.googleapis.com/drive/v3/files/{file_id}/permissions",
        data=data, headers=headers, method="POST"
    )
    urllib.request.urlopen(req)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: upload_gdrive.py <filepath> [name]")
        sys.exit(1)
    
    filepath = sys.argv[1]
    name = sys.argv[2] if len(sys.argv) > 2 else None
    
    print(f"Uploading {filepath}...")
    result = upload_file(filepath, name)
    file_id = result["id"]
    print(f"File ID: {file_id}")
    
    make_public(file_id)
    print(f"Permission: anyone with link can view")
    
    print(f"\nView: https://drive.google.com/file/d/{file_id}/view")
    print(f"Download: https://drive.google.com/uc?id={file_id}&export=download")
