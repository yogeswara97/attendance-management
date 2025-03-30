import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFireStoreDetail } from "../../hooks/useFireStoreDetail";
import { useFireStoreList } from "../../hooks/useFireStoreList"; // Import the hook for logbooks
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Switcher from "../../components/Switchers/Switcher";
import { Table } from '../../components/Tables/Table';
import { deleteDoc, doc } from "firebase/firestore";
import {db} from "../../services/firebase";
import { collectionNames } from "../../services/collections";

export default function TraineeDetail() {
    const { id } = useParams<string>();
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { data: trainee, loading: traineeLoading, error } = useFireStoreDetail(collectionNames.users, id || "");

    const filters = [
        { field: "userID", operator: "==", value: id },
    ];
    
    // Fetch logbooks and sort them by date from newest to oldest
    const { data: logbooks = [], loading: logbooksLoading } = useFireStoreList(collectionNames.logbooks, filters, {
        orderBy: { field: "date", direction: "asc" }
    });

    const sortedLogbooks = logbooks?.sort((a, b) => b.date.toDate() - a.date.toDate()) || [];


    useEffect(() => {
        if (trainee) {
            setIsActive(trainee.isActive || false);
        }
    }, [trainee]);

    const handleBack = () => navigate(`/trainee`);

    const handleLogbooksEdit = (logbooksId:string) => navigate(`/trainee/${id}/logbooks/edit/${logbooksId}`)
    const handleLogbooksDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this intern?')) {
            try {
                const docRef = doc(db, collectionNames.logbooks, id);
                await deleteDoc(docRef);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };


    if (traineeLoading && logbooksLoading) {
        return <p>Loading trainee data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!trainee) {
        return <p>No trainee found</p>;
    }
    

    return (
        <>
            <Breadcrumb pageName="Trainee" />

            {/* Trainee Data */}
            <div className="rounded-lg border border-stroke bg-white shadow-default mb-6">
                <div className="flex flex-col gap-5.5 p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Name</label>
                            <input
                                type="text"
                                value={trainee.name || ''}
                                placeholder="Name"
                                className="custom-input"
                                readOnly
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Email</label>
                            <input
                                type="text"
                                value={trainee.email || ''}
                                placeholder="Email"
                                className="custom-input"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Division</label>
                            <input
                                type="text"
                                value={trainee.division || ''}
                                placeholder="Division"
                                className="custom-input"
                                readOnly
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Trainee Type</label>
                            <input
                                type="text"
                                value={trainee.trainee_type || ''}
                                placeholder="Trainee Type"
                                className="custom-input"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Start Date</label>
                            <input
                                type="text"
                                value={trainee.start_date || ''}
                                placeholder="Start Date"
                                className="custom-input"
                                readOnly
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">End Date</label>
                            <input
                                type="text"
                                value={trainee.end_date || ''}
                                placeholder="End Date"
                                className="custom-input"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">NIK</label>
                            <input
                                type="text"
                                value={trainee.nik || ''}
                                placeholder="NIK"
                                className="custom-input"
                                readOnly
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Date of Birth</label>
                            <input
                                type="text"
                                value={trainee.dob || ''}
                                placeholder="Date of Birth"
                                className="custom-input"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">Address</label>
                            <input
                                type="text"
                                value={trainee.address || ''}
                                placeholder="Address"
                                className="custom-input"
                                readOnly
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">In Active</label>
                            <Switcher enabled={isActive} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-10" />

            {/* LogBooks Section */}
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Logbooks List</h2>
                <button
                    onClick={() => navigate(`/trainee/${id}/logbooks/add/`)}
                    className="inline-flex items-center justify-center rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-700"
                >
                    Add Logbooks
                </button>
            </div>
            <Table
                data={sortedLogbooks}
                headers={['Date', 'Check In', 'Check Out', 'Location', ]}
                renderRow={(logbook) => (
                    <>
                        <td className="py-5 px-6">
                            <h5 className="font-medium text-black dark:text-white">
                                {logbook.date?.toDate().toLocaleString() || 'N/A'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black dark:text-white">
                            <h5 className="font-medium text-black dark:text-white">
                                {logbook.session?.check_in?.toDate().toLocaleTimeString() || 'N/A'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black dark:text-white">
                            <h5 className="font-medium text-black dark:text-white">
                                {logbook.session?.check_out?.toDate().toLocaleTimeString() || 'N/A'}
                            </h5>
                        </td>
                        <td className="py-5 px-6 text-black dark:text-white">
                            <h5 className="font-medium text-black dark:text-white">
                                {logbook.session?.location || 'N/A'}
                            </h5>
                        </td>
                    </>
                )}
                onEdit={handleLogbooksEdit}
                onDelete={handleLogbooksDelete}
            />
        </>
    );
}
