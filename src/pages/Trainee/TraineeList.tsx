import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/Tables/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useFireStoreList } from '../../hooks/useFireStoreList';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { collectionNames } from '../../services/collections';

export default function TraineeList() {
    const filters = [
        { field: "role", operator: '==', value: 'trainee' }
    ];
    const { data: trainee, loading } = useFireStoreList(collectionNames.users, filters);
    const navigate = useNavigate();

    const handleView = (id: string) => navigate(`/trainee/${id}`);

    const handleEdit = (id: string) => navigate(`/trainee/edit/${id}`);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this intern?')) {
            try {
                const docRef = doc(db, collectionNames.users, id);
                await deleteDoc(docRef);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    if (loading) return <p className='h-screen'>Loading...</p>;

    return (
        <>
            <Breadcrumb pageName="Trainee" showBackButton={false} />
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Trainee List</h2>
                <button
                    onClick={() => navigate('/trainee/add')}
                    className="btn-primary"
                >
                    Add Trainee
                </button>
            </div>
            <Table
                data={trainee}
                headers={['Name', 'Division', 'Traine Type', 'In Active']}
                renderRow={(traine) => (
                    <>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black">{traine.name}</h5>
                        </td>
                        <td className="py-5 px-6 text-black">
                            <h5 className={`font-medium ${traine.division == null || traine.division === "" ? 'text-red-4' : 'text-black'}`}>
                                {traine.division || 'Undefined'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black">
                            <h5
                                className={`font-medium text-black  text-center
                                            ${traine.trainee_type === 'intern' ? 'bg-green-1 border-green-5' : traine.trainee_type === 'part-time' ? 'bg-blue-1 border-blue-4' : 'bg-red-1 border-red-4'} 
                                            w-auto p-2 border rounded`}
                            >
                                {traine.trainee_type === 'intern' ? 'Intern' : traine.trainee_type === 'part-time' ? 'Part Time' : 'Undefined'}
                            </h5>
                        </td>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black">
                                {traine.isActive ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                            </h5>
                        </td>
                    </>
                )}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </>
    );
}
