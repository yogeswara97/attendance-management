import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/Tables/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useFireStoreList } from '../../hooks/useFireStoreList';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { collectionNames } from '../../services/collections';
import { deleteUser, getAuth } from 'firebase/auth';

export default function AdminList({ role }) {

    const filters = [
        { field: "role", operator: '!=', value: 'trainee' },
    ]
    const { data: admins, loading } = useFireStoreList(collectionNames.users, filters);
    const navigate = useNavigate();

    const handleEdit = (id: string) => navigate(`/admin/edit/${id}`);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                const adminDocRef = doc(db, collectionNames.users, id);
                const adminDoc = await getDoc(adminDocRef);
    
                if (!adminDoc.exists()) {
                    alert("Admin not found.");
                    return;
                }

                
    
                const adminData = adminDoc.data();
                const adminUID = adminDoc.id; // Get the UID from Firestore
                
                console.log(adminUID);
                
                if (!adminUID) {
                    alert("Admin UID not found. Cannot delete.");
                    return;
                }
    
                const auth = getAuth(); // Get the Firebase Auth instance
    
                // ***KEY CHANGE:  Use the adminUID to delete the user***
                const userToDelete = auth.currentUser; // Get the currently logged-in user
    
                if (userToDelete && userToDelete.uid === adminUID) {
                    alert("You cannot delete your own account.");
                    return;
                }
    
                // Delete the user from Firebase Authentication
                await deleteUser(auth); // Use the adminUID here
    
                // Delete the admin document from Firestore
                await deleteDoc(adminDocRef);
    
                alert("Admin account has been deleted successfully!");
                // Consider a more targeted state update instead of a full page reload
            } catch (error) {
                console.error("Error deleting admin:", error);
                alert("Failed to delete admin. Please try again.");
            }
        }
    };
    

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Breadcrumb pageName="Admin" showBackButton={false} />
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Admin List</h2>
                {role == 'super.admin' && (
                    <button
                        onClick={() => navigate('/admin/add')}
                        className="btn-primary"
                    >
                        Add Admin
                    </button>
                )}
            </div>
            <Table
                data={admins}
                headers={['Category', 'Division', 'Role', 'Email', 'In Active']}
                renderRow={(admin) => (
                    <>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black dark:text-white">{admin.name}</h5>
                        </td>
                        <td className="py-5 px-6 text-black">
                            <h5 className={`font-medium ${admin.division == null || admin.division === "" ? 'text-red-4' : 'text-black'}`}>
                                {admin.division || 'Undefined'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black dark:text-white">
                            <h5
                                className={`font-medium w-auto p-2 rounded-lg  text-center border
                                    ${admin.role === 'admin' ? 'bg-blue-2 border-blue-4' :
                                        admin.role === 'super.admin' ? 'bg-yellow-2 border-yellow-3' :
                                            'bg-red-2 border-red-4'}`}
                            >
                                {admin.role === 'admin' ? 'Admin' : admin.role === 'super.admin' ? 'Super Admin' : 'Undefined!!'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black dark:text-white">
                            <h5 className="font-medium text-black dark:text-white">{admin.email}</h5>
                        </td>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black dark:text-white">
                                {admin.isActive ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                            </h5>
                        </td>
                    </>
                )}
                showActions={role === 'super.admin' ? true : false}
                onEdit={role === 'super.admin' ? handleEdit : undefined} // Pass handleEdit only if role is super.admin
                onDelete={role === 'super.admin' ? handleDelete : undefined}
            />
        </>
    );
}
