import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/Tables/Table';
import { doc, deleteDoc, query, collection, where, getDoc, getDocs, limit } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useFireStoreList } from '../../hooks/useFireStoreList';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { collectionNames } from '../../services/collections';

export default function DivisionList() {
    const { data: divisions, loading } = useFireStoreList(collectionNames.divisions);
    const navigate = useNavigate();

    const handleEdit = (id: string) => navigate(`/division/edit/${id}`);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this division?')) {
            try {
                const q = query(collection(db, collectionNames.divisions), where('id', '==', id), limit(1))
                const querySnapshot = await getDocs(q)

                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    await deleteDoc(docRef);
                    alert("Document deleted succesfully.");
                    window.location.reload();
                } else {
                    console.error("No document found with the given custom ID!");
                    alert("Document not found.");
                }
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Breadcrumb pageName="Division" showBackButton={false} />
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">division List</h2>
                <button
                    onClick={() => navigate('/division/add')}
                    className="btn-primary"
                >
                    Add Division
                </button>
            </div>
            <Table
                data={divisions}
                headers={['Division',]}
                renderRow={(division) => (
                    <>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black dark:text-white">{division.name}</h5>
                        </td>
                    </>
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
}
