// src/pages/ArsipPage.jsx
import React, { useState, useMemo } from "react";
import { useArsip } from "../hooks/useArsip";
import FormModal from "../modalup/FormModul";
import ConfirmationModal from "../modalup/ConfirmationModal"; 
import { Toaster, toast } from "react-hot-toast";
import { Edit, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ArsipPage = () => {
  const { arsipList, loading, error, createArsip, updateArsip, deleteArsip } = useArsip();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArsip, setEditingArsip] = useState(null);

  // State untuk konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // --- Handler Simpan ---
  const handleSave = async (formData) => {
    try {
      if (editingArsip) {
        await updateArsip(editingArsip.id, formData);
        toast.success("Data arsip berhasil diperbarui!");
      } else {
        await createArsip(formData);
        toast.success("Arsip baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      setEditingArsip(null);
    } catch (err) {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
      console.error("Failed to save arsip:", err);
    }
  };

  // --- Buka Modal Tambah/Edit ---
  const handleOpenCreateModal = () => {
    setEditingArsip(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (arsip) => {
    setEditingArsip(arsip);
    setIsModalOpen(true);
  };

  // --- Buka Modal Konfirmasi Hapus ---
  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // --- Eksekusi Hapus ---
  const handleConfirmDelete = async () => {
    try {
      await deleteArsip(deleteId);
      toast.success("Data arsip berhasil dihapus.");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      toast.error("Gagal menghapus data. Silakan coba lagi.");
      console.error("Failed to delete arsip:", err);
    }
  };

  // --- Tutup Modal Hapus ---
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  // --- Filter & Pagination ---
  const filteredArsip = useMemo(() => {
    return arsipList.filter((arsip) =>
      arsip.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      arsip.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

  // --- Render Loading / Error ---
  if (loading && !isModalOpen) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Arsip</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari arsip..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Tambah Arsip</span>
          </button>
        </div>
      </div>

      {/* Tabel Modern */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Arsip</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedArsip.length > 0 ? (
                paginatedArsip.map((arsip, index) => (
                  <tr key={arsip.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{arsip.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={arsip.deskripsi}>
                      {arsip.deskripsi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{arsip.tanggal}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(arsip)}
                          className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(arsip.id)}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-lg">Tidak ada data yang ditemukan.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <span className="text-sm text-gray-600">
            Menampilkan halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >              
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingArsip || { nama: "", deskripsi: "", tanggal: "" }}
        isEditing={!!editingArsip}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data arsip ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
};

export default ArsipPage;