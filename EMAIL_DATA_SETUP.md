# Email‑Based Data Isolation

All student data is now linked by email only. To upload your CSV data to Firebase in this format:

1. Place your portal_data - portal_data.csv in the project root.
2. Download your Firebase service account key from the Firebase Console and save it as serviceAccountKey.json in the project root.
3. Install dependencies: 
pm install csvtojson firebase-admin
4. Run the upload script: 
ode scripts/uploadByEmail.js

After uploading, each student will see only their own data when logged in.
