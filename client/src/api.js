import { BASE_URL } from "./config";

const headers = {
  "Content-Type": "application/json",
};

export const api = {
  fetchUsers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`);

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

  addUser: async (user) => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(user),
      });

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
      const response = await fetch(`${BASE_URL}/orders`);

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

  fetchUserById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();

      if (!response.ok) {
        throw new Error(`${user.error} (${response.status}) `);
      }

      return { res: user, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  addOrder: async (order) => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(order),
      });

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

  updateOrder: async (order) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${order.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(order),
      });

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

  fetchTools: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tools`);

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

  addTool: async (tool) => {
    try {
      const response = await fetch(`${BASE_URL}/tools`, {
        method: "POST",
        headers,
        body: JSON.stringify(tool),
      });

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

  deleteTool: async (tool) => {
    try {
      const response = await fetch(`${BASE_URL}/tools/${tool.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  deleteIngredient: async (obj) => {
    console.log(obj);
    try {
      const response = await fetch(`${BASE_URL}/ingredients/${obj.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  fetchEquipment: async () => {
    try {
      const response = await fetch(`${BASE_URL}/equipment`);

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

  addEquipment: async (tool) => {
    try {
      const response = await fetch(`${BASE_URL}/equipment`, {
        method: "POST",
        headers,
        body: JSON.stringify(tool),
      });

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

  deleteEquipment: async (equipment) => {
    try {
      const response = await fetch(`${BASE_URL}/equipment/${equipment.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  fetchIngredients: async () => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients`);

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

  fetchEquipment: async () => {
    try {
      const response = await fetch(`${BASE_URL}/equipment`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`${data.error} (${response.status}) `);
      }

      return { res: data, err: null, response };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  addEquipment: async (equipment) => {
    try {
      const response = await fetch(`${BASE_URL}/equipment`, {
        method: "POST",
        headers,
        body: JSON.stringify(equipment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  fetchEquipmentFailures: async () => {
    try {
      const response = await fetch(`${BASE_URL}/equipmentFailures`);

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

  addEquipmentFailures: async (equipmentFailures) => {
    try {
      const response = await fetch(`${BASE_URL}/equipmentFailures`, {
        method: "POST",
        headers,
        body: JSON.stringify(equipmentFailures),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },

  editEquipmentFailures: async (equipmentFailures) => {
    try {
      const response = await fetch(
        `${BASE_URL}/equipmentFailures/${equipmentFailures.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(equipmentFailures),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { res: null, err: null };
    } catch (error) {
      return { res: null, err: error };
    }
  },
};
