import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../services/firebase";


export const useFireStoreList = (collectionName: string, filters?: { field: string; operator: string; value: any; }[], p0?: { orderBy: { field: string; direction: string; }; }) => {
    const [data, setData] = useState<any[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(db, collectionName);

                //fillter
                let queryRef = collectionRef;
                if (filters && filters.length > 0) {
                    queryRef = query(collectionRef, ...filters.map(filter => where(filter.field, filter.operator, filter.value)));
                }

                const sanpshot = await getDocs(queryRef);
                const list = sanpshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(list);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [collectionName]);

    return { data, loading };
}