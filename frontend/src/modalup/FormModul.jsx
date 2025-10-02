// src/popup/FormModal.jsx
import React, { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import InputField from "../component/layouts/InputField.jsx";

const FormModal = ({ isOpen, onClose, initialData, onSave, isEditing }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // The error stack points to an issue downstream from here.
  };

  return (
    // Overlay: hanya blur/background gelap, tidak fullscreen
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Klik di luar modal → tutup
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()} // Mencegah klik dalam modal menutup
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900">{isEditing ? "Edit Data Arsip" : "Tambah Arsip Baru"}</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors" title="Tutup">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <InputField label="Nama Arsip" name="nama" value={formData.nama || ""} onChange={handleChange} />
          <InputField label="Deskripsi" name="deskripsi" value={formData.deskripsi || ""} onChange={handleChange} />
          <InputField label="Tanggal" name="tanggal" type="date" value={formData.tanggal || ""} onChange={handleChange} />

          <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg mt-6 w-full justify-center">
            {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEditing ? "Simpan Perubahan" : "Tambahkan Arsip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
