import pool from "../config/db.js"
export default class GuitarModel {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM guitars')
        return rows
    }
    static async create(input) {
        const [result] = await pool.query('INSERT INTO guitars(name, price, stock) VALUES (?, ?, ?)', [...input])
        return result.insertId
    }
    static async update({id, input}) {
        await pool.query('UPDATE guitars SET name=?, price=?, stock=? WHERE id=?', [...input, id]);
    }      
    static getById = async(id)=>{
        const [rows] = await pool.query('SELECT * FROM guitars WHERE id=?',[id])
        return rows[0]
    }
    static delete=async(id)=>{
        await pool.query('DELETE FROM guitars WHERE id=?',[id])
    }
}