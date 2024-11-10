const exp = require('express');
const fs = require('fs');
const path = require('path');
const app = exp();
const port = process.env.port || 8000;
app.use(exp.json());
let files = [];
const folderPath = path.join(__dirname, '/files');


app.post('/create-file', (req, res) => {
  req.body.id = files.length > 0 ? files[files.length - 1].id + 1 : 1;
  function text () { 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    let randomText = '';
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomText += characters.charAt(randomIndex);
    }
    return randomText;
  }
  let filename = new Date().toDateString();
  let currentDate = new Date().toISOString();
  files.push(req.body);
  const filePath = path.join(folderPath, `${filename + text()}.txt`);
  fs.writeFileSync(filePath, currentDate, 'utf-8', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
  });
  res.status(200).send(`File ${filename}.txt created successfully`);
 
});



app.get('/get-file', (req, res) => {
  const getAllFiles = fs.readdirSync(folderPath);
  fs.readdir(folderPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(404).send('File not found');
    }
    data.forEach(e => {
      console.log(e);
    })
  });
  res.status(200).send({ message: 'Fetched Successfully', getAllFiles });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/get-file`);
});


