import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import app, { auth, db } from "../../services/firebase";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Switcher from "../../components/Switchers/Switcher";
import { useFireStoreList } from "../../hooks/useFireStoreList"; // Import the hook
import { collectionNames } from "../../services/collections";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";

export default function AdminAdd() {
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        division: '',
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const { data: divisions, loading: divisionsLoading, error: divisionsError } = useFireStoreList(collectionNames.divisions);

    const handleToggle = (newState: boolean) => {
        setIsActive(newState); // Update the isActive state
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdminData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(''); // Clear error when user types
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordError(''); // Clear error when user types
    };

    const handleCancel = () => navigate(`/admin`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return; // Prevent form submission
        }
        setLoading(true);
        try {
            const userCredential  = await createUserWithEmailAndPassword(auth, adminData.email, password);
            const userId = userCredential.user.uid;

            const adminCollectionRef = collection(db, collectionNames.users);
            await setDoc(doc(adminCollectionRef,userId), {
                ...adminData,
                role: 'admin',
                isActive
            });
            
            alert("Admin added successfully!");
            navigate('/admin'); 
        } catch (error) {
            console.error("Error adding admin:", error);
            alert("Failed to add admin. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    if (divisionsLoading) return <p>Loading...</p>;
    if (divisionsError) return <p>Error loading divisions: {divisionsError}</p>;

    return (
        <>
            <Breadcrumb pageName="Admin" />

            {/* Admin Data */}
            <form onSubmit={handleSubmit} className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={adminData.name}
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
                                value={adminData.email}
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
                                value={adminData.division}
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
                                required
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
                                required
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


