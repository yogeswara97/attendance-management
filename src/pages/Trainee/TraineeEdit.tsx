import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFireStoreDetail } from "../../hooks/useFireStoreDetail";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Switcher from "../../components/Switchers/Switcher";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useFireStoreList } from "../../hooks/useFireStoreList";
import { collectionNames } from "../../services/collections";

export default function TraineeEdit() {
    const { id } = useParams<string>();
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { data: trainee, loading: traineeLoading, error } = useFireStoreDetail(collectionNames.users, id || "");

    const [traineeData, setTraineeData] = useState({
        name: '',
        email: '',
        division: '',
        trainee_type: '',
        start_date: '',
        end_date: '',
        nik: '',
        address: '',
        dob: ''
    });

    // State for password and confirm password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (trainee) {
            setIsActive(trainee.isActive || false);
            setTraineeData({
                name: trainee.name || '',
                email: trainee.email || '',
                division: trainee.division || '',
                trainee_type: trainee.trainee_type || '',
                start_date: trainee.start_date || '',
                end_date: trainee.end_date || '',
                nik: trainee.nik || '',
                address: trainee.address || '',
                dob: trainee.dob || ''
            });
        }
    }, [trainee]);

    const { data: divisions, loading: divisionsLoading, error: divisionsError } = useFireStoreList(collectionNames.divisions);

    const handleToggle = (newState: boolean) => {
        setIsActive(newState); // Update the isActive state
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTraineeData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(''); 
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordError(''); 
    };

    const handleCancel = () => navigate(`/trainee`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return; // Prevent form submission
        }
        
        setLoading(true);
        try {
            // Update Firestore with trainee data
            await updateDoc(doc(db, collectionNames.users, id), {
                ...traineeData,
                isActive, // Include the isActive state
                password // Include the password if needed
            });
            alert("Trainee updated successfully!");
            navigate('/trainee'); // Redirect after successful update
        } catch (error) {
            console.error("Error updating trainee:", error);
            alert("Failed to update trainee. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (traineeLoading || divisionsLoading) {
        return <p>Loading...</p>;
    }

    if (error || divisionsError) {
        return <p>Error: {error}</p>;
    }

    if (!trainee) {
        return <p>No trainee found</p>;
    }

    return (
        <>
            <Breadcrumb pageName="Trainee" />

            {/* Trainee Data */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={traineeData.name}
                                placeholder="Enter customer name"
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={traineeData.email}
                                placeholder="Enter email"
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Division</label>
                            <select
                                name="division"
                                value={traineeData.division}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Division</option>
                                {divisions.map(division => (
                                    <option key={division.id} value={division.name}>
                                        {division.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Trainee Type</label>
                            <select
                                name="trainee_type"
                                value={traineeData.trainee_type}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select trainee type</option>
                                <option value="intern">Intern</option>
                                <option value="part-time">Part Time</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={traineeData.start_date}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={traineeData.end_date}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">NIK</label>
                            <input
                                type="number"
                                name="nik"
                                value={traineeData.nik}
                                placeholder="Enter NIK"
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={traineeData.dob}
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={traineeData.address}
                                placeholder="Enter address"
                                className="custom-input"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">In Active</label>
                            <Switcher enabled={isActive} onToggle={handleToggle} />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Password</label>
                            <input
                                type="password"
                                value={password}
                                placeholder="Enter password"
                                className={`custom-input ${passwordError ? 'border-red-4' : ''}`}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && (
                                <div className="text-red-500 mb-4">{passwordError}</div>
                            )}
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm password"
                                className={`custom-input ${passwordError ? 'border-red-4' : ''}`}
                                onChange={handleConfirmPasswordChange}
                            />
                            {passwordError && (
                                <div className="text-red-500 mb-4">{passwordError}</div>
                            )}
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
