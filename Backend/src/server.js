const app = require('./app');
const port = app.get('port');
const cors = require('cors');
app.use(cors());

app.listen(port, () => console.log(`Run on port ${port}!`));