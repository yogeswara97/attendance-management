import { doc, getDoc, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";

export const useFireStoreDetail = (collectionName: string, docId: string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, collectionName, docId);
                const docSnap = await getDoc(docRef);

                setData({ id: docSnap.id, ...docSnap.data() });
            } catch (error) {
                setError("Failed to fetch data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collectionName, docId]);

    return { data, loading, error };
};
