import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFireStoreDetail } from "../../hooks/useFireStoreDetail";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Switcher from "../../components/Switchers/Switcher";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useFireStoreList } from "../../hooks/useFireStoreList";
import { collectionNames } from "../../services/collections";

export default function AdminEdit() {
    const { id } = useParams<string>();
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { data: admin, loading: adminLoading, error } = useFireStoreDetail(collectionNames.users, id || "");

    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        division: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (admin) {
            setIsActive(admin.isActive || false);
            setAdminData({
                name: admin.name || '',
                email: admin.email || '',
                division: admin.division || '',
            });
        }
    }, [admin]);

    const { data: divisions, loading: divisionsLoading, error: divisionsError } = useFireStoreList(collectionNames.divisions);

    const handleToggle = (newState: boolean) => {
        setIsActive(newState); // Update the isActive state
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAdminData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordError('');
    };

    const handleCancel = () => navigate(`/admin`);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // Update Firestore with admin data
            await updateDoc(doc(db, collectionNames.users, id), {
                ...adminData,
                isActive,
                password
            });

            alert("Admin updated successfully!");
            navigate('/admin'); // Redirect after successful update
        } catch (error) {
            console.error("Error updating admin:", error);
            alert("Failed to update admin. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || divisionsLoading) {
        return <p>Loading...</p>;
    }

    if (error || divisionsError) {
        return <p>Error: {error}</p>;
    }

    if (!admin) {
        return <p>No admin found</p>;
    }

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
                                readOnly
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
                    {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
                    </div> */}

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
