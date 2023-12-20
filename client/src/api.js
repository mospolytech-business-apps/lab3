import { BASE_URL } from "./config";

const headers = {
  "Content-Type": "application/json",
};

export const api = {
  fetchUsers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error} (${response.status}) `);
      }

      return { res: data, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  fetchOrders: async () => {
    try {
      const response = await fetch(`${BASE_URL}/orders.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error} (${response.status}) `);
      }

      return { res: data, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  fetchEquipments: async () => {
    try {
      const response = await fetch(`${BASE_URL}/equipments.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error} (${response.status}) `);
      }

      return { res: data, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },
  fetchEquipmentFailures: async () => {
    try {
      const response = await fetch(`${BASE_URL}/equipmentFailures.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error} (${response.status}) `);
      }

      return { res: data, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },
};
