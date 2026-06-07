import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function saveProgress(userId, caseId, { totalScore, tier, accuracy }) {
  if (!db) return;
  await setDoc(
    doc(db, 'users', userId, 'progress', caseId),
    { totalScore, tier, accuracy, completedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function loadAllProgress(userId) {
  if (!db) return {};
  const snap = await getDocs(collection(db, 'users', userId, 'progress'));
  const result = {};
  snap.forEach(d => { result[d.id] = d.data(); });
  return result;
}
