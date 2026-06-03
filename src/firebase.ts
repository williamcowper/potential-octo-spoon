import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase 配置通过 Vite 环境变量注入（VITE_FIREBASE_...）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let db: ReturnType<typeof getFirestore> | null = null
try{
  const app = initializeApp(firebaseConfig as any)
  db = getFirestore(app)
}catch(e){
  console.warn('Firebase init failed, please check env vars', e)
}

export { db }
