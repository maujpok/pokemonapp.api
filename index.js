const server = require('./src/app');
const { conn } = require('./src/db');
// const fetchTypes = require('./src/helpers/fetchTypes');
const PORT = process.env.PORT || 3001;

conn.sync({ force: false, alter: true })
  .then(() => {
    server.listen(PORT, async () => {
        console.log(`Listening at ${PORT}`)
        // fetchTypes()
    });
});