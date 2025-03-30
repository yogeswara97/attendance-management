import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import {db} from "../../services/firebase";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BsTrash3Fill, BsFillPlusCircleFill } from "react-icons/bs";
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

export default function LogbookAdd() {
    const { id } = useParams<string>();
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

    const handleAddTask = () => {
        setLogbookData(prev => ({
            ...prev,
            task: [...prev.task, ''] // Add an empty string for a new task input    
        }));
    };

    const handleTaskChange = (index: number, value: string) => {
        const updatedTasks = [...logbookData.task];
        updatedTasks[index] = value; // Update the specific task input
        setLogbookData(prev => ({ ...prev, task: updatedTasks }));
    };

    const handleRemoveTask = (index: number) => {
        setLogbookData(prev => ({
            ...prev,
            task: prev.task.filter((_, i) => i !== index) // Remove task by index
        }));
    };

    const handleCancel = () => navigate(`/trainee/${id}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create a unique document ID (you can also use a specific field if needed)
            const logbookDocRef = doc(collection(db, collectionNames.logbooks));

            // Add a new logbook document to Firestore
            await setDoc(logbookDocRef, {
                ...logbookData,
                date: new Date(logbookData.date),
                session: {
                    ...logbookData.session,
                    check_in: new Date(logbookData.session.check_in),
                    check_out: new Date(logbookData.session.check_out),
                }
            });
            alert("Logbook added successfully!");
            navigate(`/trainee/${id}`); // Redirect after successful addition
        } catch (error) {
            console.error("Error adding logbook:", error);
            alert("Failed to add logbook. Please try again.");
        } finally {
            setLoading(false);
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
                                        onChange={(e) => handleTaskChange(index, e.target.value)} // Update task input
                                    />
                                    {index > 0 && ( // Show trash icon only for tasks after the first
                                        <button
                                            type="button"
                                            className="ml-2 text-red-600"
                                            onClick={() => handleRemoveTask(index)} // Remove task by index
                                        >
                                            <BsTrash3Fill size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddTask}
                                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-600 text-green-600 py-2 px-6 bg-whitecursor-pointer font-medium"
                            >
                                <BsFillPlusCircleFill size={18} />
                                Add More Task
                            </button>
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
