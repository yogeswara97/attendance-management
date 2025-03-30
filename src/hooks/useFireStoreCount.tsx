import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../services/firebase";

export const useFireStoreCount = (collectionName: string, filters?: { field: string, operator: string, value: any }[]) => {
    const [count, setCount] = useState<Number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const collectionRef = collection(db, collectionName);

                let queryRef = collectionRef;
                if (filters && filters.length > 0) {
                    queryRef = query(collectionRef, ...filters.map(filter => where(filter.field, filter.operator, filter.value)))
                }

                const countSnapshot = await getCountFromServer(queryRef);
                setCount(countSnapshot.data().count);
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        }

        fetchCount();
    }, [collectionName, filters])

    return { count, loading }
}