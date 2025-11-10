import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

export const useMedicine = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useNotification();

  const searchMedicine = async (symptom) => {
    if (!symptom || !symptom.trim()) {
      showError('Please enter a symptom');
      return;
    }

    setLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/medicines/search?symptom=${encodeURIComponent(symptom)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search medicines');
      }

      const data = await response.json();

      if (data.found) {
        setSearchResult({
          symptom: data.symptom,
          medicines: data.medicines,
          found: true
        });
        showSuccess('Medicine recommendations found!');
      } else {
        setSearchResult({
          symptom: data.symptom,
          message: data.message,
          found: false
        });
        showError(data.message);
      }
    } catch (error) {
      console.error('Medicine search error:', error);
      showError('Failed to search medicines. Please check your connection.');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResult,
    searchMedicine,
    loading
  };
};
