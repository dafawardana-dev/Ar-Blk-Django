import { useState, useEffect, useCallback } from "react";
import { ArsipService } from "../api/ArsipService";

/**
 * Custom hook for managing 'arsip' data.
 * It handles fetching, creating, updating, and deleting arsip records,
 * while managing loading and error states.
 */
export const useArsip = () => {
  const [arsipList, setArsipList] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [error, setError] = useState(null);

  /**
   * Fetches the complete list of arsip records from the API.
   * Uses useCallback to prevent re-creation on every render.
   */
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

  // Effect to perform the initial data fetch when the hook is first used.
  useEffect(() => {
    fetchArsip();
  }, [fetchArsip]);

  /**
   * Creates a new arsip record.
   * @param {object} arsipData - The data for the new record.
   */
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

  /**
   * Updates an existing arsip record.
   * @param {string|number} id - The ID of the record to update.
   * @param {object} arsipData - The new data for the record.
   */
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

  // Return state and functions to be used by components.
  return {
    arsipList,
    loading,
    error,
    fetchArsip,
    createArsip,
    updateArsip,
    // You can also add deleteArsip here following the same pattern
  };
};