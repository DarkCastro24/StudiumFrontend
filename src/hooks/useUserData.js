import { useEffect, useState } from 'react';
import axios from 'axios';
import { GLOBAL } from '../services/apiConfig';

export const useUserData = (userId) => {
  const API_URL = GLOBAL[0].BASE_URL;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile/${userId}`);
        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error('Error al obtener los datos del usuario. Estado de respuesta:', response.status);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error.message);
      }
    };

    fetchUserData();
  }, [API_URL, userId]);

  return { userData, setUserData };
};
