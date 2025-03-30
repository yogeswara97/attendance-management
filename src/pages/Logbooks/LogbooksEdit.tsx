import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {db} from "../../services/firebase";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useFireStoreDetail } from "../../hooks/useFireStoreDetail";
import { collectionNames } from "../../services/collections";

// Define the type for logbook data
interface LogbookData {
    date: string;
    session: {
        check_in: string;
        check_out: string;
        location: string;
    };
    task: string[]; // Specify that task is an array of strings
    userID: string | undefined;
}

export default function LogbookEdit() {
    const { id,logbooksId } = useParams<string>();
    const { data: logbooks } = useFireStoreDetail(collectionNames.logbooks, logbooksId || "");
    const [loading, setLoading] = useState(false);
    const [logbookData, setLogbookData] = useState<LogbookData>({
        date: '',
        session: {
            check_in: '',
            check_out: '',
            location: ''
        },
        task: [''], // Initialize with one empty task input
        userID: id // Set userID based on the URL parameter
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (logbooks) {
            setLogbookData({
                date: logbooks.date instanceof Timestamp ? logbooks.date.toDate().toISOString().slice(0, 16) : '', // Convert Firestore Timestamp to ISO string
                session: {
                    check_in: logbooks.session.check_in instanceof Timestamp ? logbooks.session.check_in.toDate().toISOString().slice(0, 16) : '',
                    check_out: logbooks.session.check_out instanceof Timestamp ? logbooks.session.check_out.toDate().toISOString().slice(0, 16) : '',
                    location: logbooks.session.location || '',
                },
                task: logbooks.task || [''],
                userID: id
            });
        }
    }, [logbooks, id]);
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogbookData(prev => ({ ...prev, [name]: value }));
    };

    const handleSessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogbookData(prev => ({
            ...prev,
            session: { ...prev.session, [name]: value }
        }));
    };

    const handleCancel = () => navigate(`/trainee/${id}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        try {
            // Reference the existing logbook document using the ID from the URL
            const logbookDocRef = doc(db, collectionNames.logbooks, logbooksId || ""); // Use the existing document ID

            // Update the logbook document in Firestore
            await setDoc(logbookDocRef, {
                date: new Date(logbookData.date),
                session: {
                    ...logbookData.session,
                    check_in: new Date(logbookData.session.check_in),
                    check_out: new Date(logbookData.session.check_out),
                },
                task: logbookData.task
            }, { merge: true }); // Use merge to update only the fields that have changed

            alert("Logbook updated successfully!");
            navigate(`/trainee/${id}`); // Redirect after successful update
        } catch (error) {
            console.error("Error updating logbook:", error);
            alert("Failed to update logbook. Please try again.");
        } finally{
            setLoading(false)
        }
    };

    return (
        <>
            <Breadcrumb pageName="Trainee Logbooks" />
            {/* Logbook Data */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Date</label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={logbookData.date}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={logbookData.session.location}
                                placeholder="Enter location"
                                className="custom-input"
                                onChange={handleSessionChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Check In</label>
                            <input
                                type="datetime-local"
                                name="check_in"
                                value={logbookData.session.check_in}
                                className="custom-input"
                                onChange={handleSessionChange}
                                required
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Check Out</label>
                            <input
                                type="datetime-local"
                                name="check_out"
                                value={logbookData.session.check_out}
                                className="custom-input"
                                onChange={handleSessionChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full">
                            <label className="mb-2.5 block text-black dark:text-white">Tasks</label>
                            {logbookData.task.map((task, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={task}
                                        placeholder={`Task ${index + 1}`}
                                        className="custom-input w-full"
                                        readOnly
                                    />
                                </div>
                            ))}
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
