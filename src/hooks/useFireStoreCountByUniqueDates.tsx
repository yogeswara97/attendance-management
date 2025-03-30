import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";

export const useFireStoreCountByUniqueDates = (collectionName: string, dateField: string) => {
    const [counts, setCounts] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const collectionRef = collection(db, collectionName);
                const snapshot = await getDocs(collectionRef);
                const dateCounts: { [key: string]: number } = {};

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const date = data[dateField].toDate().toISOString().split('T')[0]; // Format date to YYYY-MM-DD
                    if (!dateCounts[date]) {
                        dateCounts[date] = 0;
                    }
                    dateCounts[date]++;
                });

                // Convert the dateCounts object to an array
                const countsArray = Object.entries(dateCounts).map(([date, count]) => ({
                    date,
                    count,
                }));

                setCounts(countsArray);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false); // Ensure loading is set to false on error
            }
        };

        fetchCounts();
    }, [collectionName, dateField]);

    return { counts, loading };
};
