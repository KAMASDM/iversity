import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';

// Firebase configuration — loaded from .env (never hardcode credentials)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addPromptEngineeringCourse() {
  try {
    console.log('Adding Prompt Engineering course to Firestore...');
    
    const courseData = {
      ...promptEngineeringCourse,
      createdBy: 'system',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledStudents: 0,
    };

    const docRef = await addDoc(collection(db, 'courses'), courseData);
    
    console.log('✅ Course added successfully!');
    console.log('Course ID:', docRef.id);
    console.log('\nCourse Details:');
    console.log('- Title:', courseData.title);
    console.log('- Level:', courseData.level);
    console.log('- Duration:', courseData.duration, 'weeks');
    console.log('- Chapters:', courseData.chapters.length);
    console.log('- Total Lessons:', courseData.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding course:', error);
    process.exit(1);
  }
}

addPromptEngineeringCourse();
