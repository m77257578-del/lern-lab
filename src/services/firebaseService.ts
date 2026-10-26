import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRUD for Projects
export async function fetchProjects() {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
  }
}

export async function saveProject(project: any) {
  try {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
  }
}

// CRUD for Modification Requests (Drafts)
export async function fetchDrafts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'drafts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'drafts');
  }
}

export async function saveDraft(draft: any) {
  try {
    const draftRef = doc(db, 'drafts', draft.id);
    await setDoc(draftRef, draft, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `drafts/${draft.id}`);
  }
}
// Auth functions
export async function signUpUser(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'auth/signup');
  }
}

export async function signInUser(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'auth/signin');
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'auth/signout');
  }
}

export function subscribeToAuthChanges(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}
