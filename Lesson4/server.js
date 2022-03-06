const express = require("express");
const bcrypt = require ('bcrypt');
const fs = require('fs');
const app = express();   
const urlencodedParser = express.urlencoded({extended: false});

function createHash(userPassword) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userPassword, salt);
  return {
      hash,
      salt,
  }
}

function checkUser(userName, userPassword) {
    const data = fs.readFileSync('users.txt', 'utf-8');

    const users = []
    data.split(';').forEach(item => {
        if (!item.length) return

        const [userName, hash] = item.split(' ')
        users.push({
            userName,
            hash
        })
    })

    const currentUser = users.find(item => item.userName === userName)

    if (!currentUser) {
        const { hash, salt } = createHash(userPassword)
        const newData = `${data}${userName} ${hash} ${salt};`

        fs.writeFileSync('users.txt', newData, 'utf-8');
        return true
    }

    return bcrypt.compareSync(Buffer.from(userPassword), currentUser.hash)
}

app.use(express.static(__dirname));
  
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.post("/", urlencodedParser, function (request, response) {
    const { userName, userPassword } = request?.body || {}
    if (!userName ||
        userName === '' ||
        !userPassword ||
        userPassword == '' ||
        /\s/g.test(userName)
    ) {
        return response.sendStatus(400);
    }

    const isLoggedIn = checkUser(userName, userPassword)
    if (!isLoggedIn) response.sendStatus(400)
    response.sendStatus(200)
});

app.listen(3000, () => console.log('Server work'));



