// Adds the 2026 course batch to Firestore, skipping any title that already exists.
// Usage: node src/seedData/seedNewCourses.js   (needs SEED_EMAIL / SEED_PASSWORD of an admin in .env)
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { mcpAgentsCourse } from './mcpAgentsCourse.js';
import { agenticCodingCourse } from './agenticCodingCourse.js';
import { llmEvalsCourse } from './llmEvalsCourse.js';
import { aiSecurityCourse } from './aiSecurityCourse.js';
import { aiGovernanceCourse } from './aiGovernanceCourse.js';
import { aiAutomationCourse } from './aiAutomationCourse.js';
import { aiEthicsCourse } from './aiEthicsCourse.js';

const courses = [
  mcpAgentsCourse,
  agenticCodingCourse,
  llmEvalsCourse,
  aiSecurityCourse,
  aiGovernanceCourse,
  aiAutomationCourse,
  aiEthicsCourse,
];

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  const { SEED_EMAIL, SEED_PASSWORD } = process.env;
  if (!SEED_EMAIL || !SEED_PASSWORD) throw new Error('Set SEED_EMAIL and SEED_PASSWORD in .env');

  const { user } = await signInWithEmailAndPassword(auth, SEED_EMAIL, SEED_PASSWORD);
  console.log(`Signed in as ${user.email}`);

  const existing = new Set((await getDocs(collection(db, 'courses'))).docs.map(d => d.data().title));

  for (const course of courses) {
    if (existing.has(course.title)) {
      console.log(`↷ Skipped (already exists): ${course.title}`);
      continue;
    }
    const ref = doc(collection(db, 'courses'));
    await setDoc(ref, {
      id: ref.id,
      ...course,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledStudents: 0,
    });
    const lessons = course.chapters.reduce((n, ch) => n + ch.lessons.length, 0);
    console.log(`✅ Added: ${course.title} (${course.chapters.length} chapters, ${lessons} lessons) → ${ref.id}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error('❌', error.message);
  process.exit(1);
});
