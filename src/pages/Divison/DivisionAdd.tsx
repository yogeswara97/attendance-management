import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { collectionNames } from "../../services/collections";
import { useFireStoreList } from "../../hooks/useFireStoreList";

export default function DivisionAdd() {
    const [loading, setLoading] = useState(false);
    const [divisionData, setDivisionData] = useState({
        id: '',
        name: '',
    });
    const { data: divisions = [], loading: divisionLoading } = useFireStoreList(collectionNames.divisions);

    console.log(divisions);
    useEffect(() => {
        if (divisions.length > 0) {
            const highestId = Math.max(...divisions.map(division => division.id));
            setDivisionData(prev => ({ ...prev, id: highestId + 1 })); 
        } else {
            setDivisionData(prev => ({ ...prev, id: 1 })); 
        }
    }, [divisions]);


    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDivisionData(prev => ({ ...prev, [name]: value }));
    };
    const handleCancel = () => navigate(`/division`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const divisionCollectionRef = collection(db, collectionNames.divisions);

            // Add a new division document to Firestore with an auto-generated ID
            await addDoc(divisionCollectionRef, {
                ...divisionData,
            });
            alert("Division added successfully!");
            navigate('/division'); // Redirect after successful addition
        } catch (error) {
            console.error("Error adding division:", error);
            alert("Failed to add division. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    if (divisionLoading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <Breadcrumb pageName="Division" />

            {/* Division Data */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Id</label>
                            <input
                                type="text"
                                name="id"
                                value={divisionData.id}
                                placeholder="Enter id"
                                className="custom-input"
                                onChange={handleInputChange}
                                readOnly
                                required
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={divisionData.name}
                                placeholder="Enter name"
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

            {/* LogBooks */}
        </>
    );
}
