import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
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

// CRUD for Projects with onSnapshot real-time listener
export async function fetchProjects() {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
  }
}

export function subscribeToProjects(callback: (projects: any[]) => void, onError?: (error: any) => void) {
  const colRef = collection(db, 'projects');
  return onSnapshot(colRef, (querySnapshot) => {
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(projects);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, 'projects');
  });
}

export async function saveProject(project: any) {
  try {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
  }
}

// CRUD for Modification Requests (Drafts) with onSnapshot real-time listener
export async function fetchDrafts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'drafts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'drafts');
  }
}

export function subscribeToDrafts(callback: (drafts: any[]) => void, onError?: (error: any) => void) {
  const colRef = collection(db, 'drafts');
  return onSnapshot(colRef, (querySnapshot) => {
    const drafts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(drafts);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, 'drafts');
  });
}

export async function saveDraft(draft: any) {
  try {
    const draftRef = doc(db, 'drafts', draft.id);
    await setDoc(draftRef, draft, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `drafts/${draft.id}`);
  }
}

// CRUD for Support Tickets with onSnapshot real-time listener
export async function fetchTickets() {
  try {
    const querySnapshot = await getDocs(collection(db, 'support_tickets'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'support_tickets');
  }
}

export function subscribeToTickets(callback: (tickets: any[]) => void, onError?: (error: any) => void) {
  const colRef = collection(db, 'support_tickets');
  return onSnapshot(colRef, (querySnapshot) => {
    const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(tickets);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.LIST, 'support_tickets');
  });
}

export async function saveTicket(ticket: any) {
  try {
    const ticketRef = doc(db, 'support_tickets', ticket.id);
    await setDoc(ticketRef, ticket, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `support_tickets/${ticket.id}`);
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
