import { useState, useEffect, useCallback } from "react";
import { ArsipService } from "../api/ArsipService";

export const useArsip = () => {
  const [arsipList, setArsipList] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [error, setError] = useState(null);

  const fetchArsip = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ArsipService.getAll();
      // Assuming the API returns the data directly. If it's nested (e.g., response.data), adjust here.
      setArsipList(response.data);
    } catch (err) {
      const errorMessage = "Failed to fetch arsip data.";
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchArsip();
  }, [fetchArsip]);


  const createArsip = useCallback(
    async (arsipData) => {
      setLoading(true);
      try {
        await ArsipService.create(arsipData);
        await fetchArsip(); // Refresh the list to show the new item
      } catch (err) {
        const errorMessage = "Failed to create arsip.";
        setError(errorMessage);
        console.error(errorMessage, err);
        throw err; // Re-throw error to allow components to handle it (e.g., keep modal open)
      } finally {
        setLoading(false);
      }
    },
    [fetchArsip]
  );

  const updateArsip = useCallback(
    async (id, arsipData) => {
      setLoading(true);
      try {
        await ArsipService.update(id, arsipData);
        await fetchArsip(); // Refresh the list
      } catch (err) {
        const errorMessage = `Failed to update arsip with ID ${id}.`;
        setError(errorMessage);
        console.error(errorMessage, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchArsip]
  );

  const deleteArsip = useCallback(
    async (id) => {      
      try {
        await ArsipService.delete(id);       
        setArsipList((prevList) => prevList.filter((arsip) => arsip.id !== id));
      } catch (err) {
        console.error(`Failed to delete arsip with ID ${id}.`, err);
        throw err; // Re-throw so the component can display a toast notification.
      }
    },
    [] 
  );

  return {
    arsipList,
    loading,
    error,
    fetchArsip,
    createArsip,
    updateArsip,
    deleteArsip,
  };
};