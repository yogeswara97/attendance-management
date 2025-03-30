import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { collectionNames } from "../../services/collections";

export default function DivisionEdit() {
    const { id } = useParams<string>();
    const [loading, setLoading] = useState(false);
    const [divisionData, setDivisionData] = useState({
        name: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDivision = async () => {
            setLoading(true);
            try {
                // Buat query untuk mencari dokumen dengan field id
                const q = query(collection(db, collectionNames.divisions), where("id", "==", parseInt(id)));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setDivisionData({
                        name: docData.name || '',
                    });
                } else {
                    console.error("No such document!");
                    alert("No division found with the given ID.");
                    navigate('/division'); // Redirect if no division found
                }
            } catch (error) {
                console.error("Error fetching division:", error);
                alert("Failed to fetch division data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDivision();
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDivisionData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => navigate(`/division`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update Firestore with division data
            const q = query(collection(db, collectionNames.divisions), where("id", "==", parseInt(id)));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef, {
                    ...divisionData,
                });
                alert("Division updated successfully!");
                navigate('/division'); // Redirect after successful update
            } else {
                alert("No division found to update.");
            }
        } catch (error) {
            console.error("Error updating division:", error);
            alert("Failed to update division. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Breadcrumb pageName="Division" />

            {/* Division Data */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={divisionData.name}
                                placeholder="Enter division name"
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
