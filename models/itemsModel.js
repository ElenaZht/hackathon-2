import { db } from '../config/db.js';

export const getItemsFromDB = async (category) => {
    try {
      const items = await db('items').where('category', category);
      return items;
    } catch (err) {
      console.error('Error fetching items:', err);
    }
};

export const getSalesFromDB = async () => {
    try {
      const items = await db('items').where('onsale', true);
      return items;
    } catch (err) {
      console.error('Error fetching items:', err);
    }
};

export const addOrderToDB = async (order) => {

    try {
      const result = await db.raw(
        `INSERT INTO orders (order_items) VALUES (?::jsonb) RETURNING id;`,
        [JSON.stringify(order)]
      );
      return result.rows[0].id;

    } catch (error) {
      console.error('Error adding order:', error);
    }
}