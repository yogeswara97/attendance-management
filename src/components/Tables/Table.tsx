import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

type TableProps<T> = {
    data: T[];
    headers: string[];
    renderRow: (item: T) => React.ReactNode;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string, imageUrl?: string) => void;
    showActions?: boolean;
};

export const Table = <T,>({ data, headers, renderRow, onView, onEdit, onDelete, showActions = true }: TableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Filter data based on search term
    const filteredData = data.filter(item => {
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value)); 
        setCurrentPage(1);
    };

    return (
        <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded p-2 border-ash-5 "
                />
            </div>
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-ash-1 text-left">
                            {headers.map((header, index) => (
                                <th key={index} className="py-4 px-6 font-medium text-black ">
                                    {header}
                                </th>
                            ))}
                            {showActions && (
                                <th className="py-4 px-6 font-medium text-black  w-45">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} className="border-b border-[#eee]">
                                    {renderRow(item)}
                                    {showActions && (
                                        <td className="py-5 px-6">
                                            {onView && (
                                                <button
                                                    className="text-slate-500 hover:text-slate-700 p-2 ml-2"
                                                    onClick={() => onView(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 p-2"
                                                    onClick={() => onEdit(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="text-red-500 hover:text-red-700 p-2 ml-2"
                                                    onClick={() => onDelete(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length + (showActions ? 1 : 0)} className="text-center py-8">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-2">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-md text-gray-700">
                            Showing
                            <span className="font-medium mx-1">{startIndex + 1}</span>
                            to
                            <span className="font-medium mx-1">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span>
                            of
                            <span className="font-medium mx-1">{filteredData.length}</span>
                            results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <div className="w-25 mr-5">
                                <select
                                    id="itemsPerPage"
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="w-full rounded border-[1.5px] border-gray-300 bg-transparent py-2 px-2 text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600"
                                    required
                                >
                                    <option value={20}>20</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <span className="sr-only">Previous</span>
                                <GrFormPrevious />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-200'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <span className="sr-only">Next</span>
                                <GrFormNext />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};
