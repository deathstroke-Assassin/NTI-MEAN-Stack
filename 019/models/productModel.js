const mysql =require('mysql2')

const connection = mysql.createPool({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
}
)

async function index() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products ORDER BY id DESC', [],(error, result)=> {
            if (!error) {
                resolve(result)
            }
        })
    })
}
async function createForm(params) {
    
}

module.exports = {
    index,
}