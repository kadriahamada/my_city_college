const mysql2 = require("mysql2/promise");

class CONNECT_DB {
  constructor() {
    this.conn = null;
  }

  async connect() {
    this.conn = await mysql2.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
    });
  }

  async query(sql, params = []) {
    if (!this.conn) {
      await this.connect();
    }
    return this.conn.query(sql, params);
  }
  async execute(sql, params = []) {
    if (!this.conn) {
      await this.connect();
    }
    return this.conn.execute(sql, params);
  }

  async findOne(table, params = {}) {
    let sql = `select *from ${table} where `;
    if (Object.keys(params).length > 0) {
      const keys = Object.keys(params);
      const lastIndex = keys.length - 1;
      const values = Object.values(params);
      keys.forEach((key, index) => {
        console.log(index);
        sql += ` ${key}=? `;
        if (keys.length > 1 && index !== lastIndex) {
          sql += ` and `;
        } else {
          sql += ";";
        }
      });
      console.log(sql);
      const [rows] = await this.query(sql, values);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return {};
      }
      //  const
    } else {
      throw new Error("Params are required and should be an object");
    }
  }
}

module.exports = CONNECT_DB;
