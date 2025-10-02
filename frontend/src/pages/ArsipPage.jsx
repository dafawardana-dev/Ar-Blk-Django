import React, { useState, useMemo } from "react";
import { useArsip } from "../hooks/useArsip";
import FormModal from "../modalup/FormModul";
import ConfirmationModal from "../modalup/ConfirmationModal";
// Ensure you have the right to use lucide-react icons, or replace with your own SVGs or a library with a known license.
import { Toaster, toast } from "react-hot-toast";
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ArsipPage = () => {
  // 1. Use the custom hook to get state and functions
  const { arsipList, loading, error, createArsip, updateArsip, deleteArsip } = useArsip();

  // 2. State for managing the modal and the data being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArsip, setEditingArsip] = useState(null);
  // State for confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingArsipId, setDeletingArsipId] = useState(null);

  // New state for search and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 3. Handler for saving data (create or update)
  const handleSave = async (formData) => {
    try {
      if (editingArsip) {
        // If we are editing, call updateArsip
        await updateArsip(editingArsip.id, formData);
        toast.success("Data arsip berhasil diperbarui!");
      } else {
        // Otherwise, call createArsip
        await createArsip(formData);
        toast.success("Arsip baru berhasil ditambahkan!");
      }
      // Close the modal on success
      setIsModalOpen(false);
      setEditingArsip(null);
    } catch (err) {
      // The error is already logged by the hook, but you could
      // show a toast notification here.
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
      console.error("Failed to save arsip:", err);
    }
  };

  // 4. Handlers to open the modal for creating or editing
  const handleOpenCreateModal = () => {
    setEditingArsip(null); // Ensure we are not in edit mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (arsip) => {
    setEditingArsip(arsip); // Set the data to be edited
    setIsModalOpen(true);
  };

  // Handlers for delete confirmation
  const handleOpenConfirmModal = (id) => {
    setDeletingArsipId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingArsipId) {
      try {
        await deleteArsip(deletingArsipId);
        toast.success("Data arsip berhasil dihapus.");
      } catch (err) {
        // Error is already logged by the hook, maybe show a toast here
        toast.error("Gagal menghapus data. Silakan coba lagi.");
      } finally {
        setIsConfirmOpen(false);
        setDeletingArsipId(null);
      }
    }
  };

  // Memoize filtered and paginated data for performance
  const filteredArsip = useMemo(() => {
    return arsipList.filter((arsip) => arsip.nama.toLowerCase().includes(searchQuery.toLowerCase()) || arsip.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [arsipList, searchQuery]);

  const paginatedArsip = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArsip.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArsip, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredArsip.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 5. Render loading and error states
  if (loading && !isModalOpen) {
    // Show loading only on initial fetch, not during background updates
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      {/* Toaster component for displaying notifications */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000 }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Arsip</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari arsip..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Arsip</span>
          </button>
        </div>
      </div>

      {/* 6. Render the data table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Arsip
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedArsip.length > 0 ? (
              paginatedArsip.map((arsip, index) => (
                <tr key={arsip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{arsip.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate" title={arsip.deskripsi}>
                    {arsip.deskripsi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{arsip.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(arsip)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 rounded-full transition-all" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleOpenConfirmModal(arsip.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-full transition-all" title="Hapus">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <span className="text-sm text-gray-700">
          Halaman {currentPage} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7. Render the FormModal */}
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} initialData={editingArsip || { nama: "", deskripsi: "", tanggal: "" }} isEditing={!!editingArsip} />

      {/* 8. Render the ConfirmationModal */}
      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Hapus Arsip" message="Apakah Anda yakin ingin menghapus data arsip ini? Tindakan ini tidak dapat dibatalkan." />
    </div>
  );
};

export default ArsipPage;
