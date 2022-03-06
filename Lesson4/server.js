const express = require("express");
const bcrypt = require ('bcrypt');
const fs = require('fs');
const app = express();   
const urlencodedParser = express.urlencoded({extended: false});

function createHash(userPassword) {
  const salt = bcrypt.genSaltSync(10);
  console.log(salt);
    return bcrypt.hashSync(userPassword, salt);
}

function checkUser(userName, hash) {
    const data = fs.readFileSync('users.txt', 'utf-8');
    const users = []

    data.split(';').forEach(item => {
        if (!item.length) return

        const [userName, hash] = item.split(' ')
        users.push({
            userName,
            hash,
        })
    })

    let currentUser = users.find(item => item.userName === userName)

    if (!currentUser) {
        const newData = `${data}${userName} ${hash};`

        fs.writeFileSync('users.txt', newData, 'utf-8');
        return true
    }

    return currentUser.hash === 'hash'
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

    const hash = createHash(userPassword)
    const isLoggedIn = checkUser(userName, hash)
    if (!isLoggedIn) response.sendStatus(400)
    response.sendStatus(200)
});

app.listen(3000, () => console.log('Server work'));




