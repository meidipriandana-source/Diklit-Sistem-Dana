import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Certificate {
  id?: string;
  name: string;
  owner: string;
  nip?: string;
  skp: number;
  fileUrl?: string;
  fileName?: string;
  status: string;
  issueDate: string;
  expiryDate: string;
  ownerId: string;
  updatedAt: string;
}

export interface Employee {
  id?: string;
  name: string;
  role?: string;
  dept?: string;
  nip?: string;
  ownerId: string;
  updatedAt: string;
}

const CERT_COLLECTION = 'certificates';
const EMP_COLLECTION = 'employees';

export const certificatesService = {
  async getAll(): Promise<Certificate[]> {
    if (!auth.currentUser) return [];
    try {
      const q = query(collection(db, CERT_COLLECTION), where('ownerId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, CERT_COLLECTION);
      return [];
    }
  },

  async add(cert: Omit<Certificate, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CERT_COLLECTION), cert);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, CERT_COLLECTION);
      return '';
    }
  },

  async update(id: string, cert: Partial<Certificate>): Promise<void> {
    try {
      const docRef = doc(db, CERT_COLLECTION, id);
      await updateDoc(docRef, cert);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${CERT_COLLECTION}/${id}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, CERT_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${CERT_COLLECTION}/${id}`);
    }
  },

  subscribe(callback: (certs: Certificate[]) => void) {
    if (!auth.currentUser) return () => {};
    const q = query(collection(db, CERT_COLLECTION), where('ownerId', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      const certs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
      callback(certs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, CERT_COLLECTION);
    });
  }
};

export const employeesService = {
  async getAll(): Promise<Employee[]> {
    if (!auth.currentUser) return [];
    try {
      const q = query(collection(db, EMP_COLLECTION), where('ownerId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, EMP_COLLECTION);
      return [];
    }
  },

  async add(emp: Omit<Employee, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EMP_COLLECTION), emp);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, EMP_COLLECTION);
      return '';
    }
  },

  async update(id: string, emp: Partial<Employee>): Promise<void> {
    try {
      const docRef = doc(db, EMP_COLLECTION, id);
      await updateDoc(docRef, emp);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${EMP_COLLECTION}/${id}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, EMP_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${EMP_COLLECTION}/${id}`);
    }
  },

  subscribe(callback: (emps: Employee[]) => void) {
    if (!auth.currentUser) return () => {};
    const q = query(collection(db, EMP_COLLECTION), where('ownerId', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      const emps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      callback(emps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, EMP_COLLECTION);
    });
  }
};
