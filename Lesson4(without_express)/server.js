const bcrypt = require ('bcrypt');
const http = require('http')
const fs = require('fs')
const querystring = require('querystring')

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

const app = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let bodyString = ''

        req.on('data', chunk => {
            bodyString += chunk.toString()
        })

        req.on('end', async () => {
            const body = querystring.decode(bodyString)

            if (req.url === '/') {
                const { userName, userPassword } = body || {}
                if (!userName ||
                  userName === '' ||
                  !userPassword ||
                  userPassword == '' ||
                  /\s/g.test(userName)
                ) {
                    return res.writeHead(400).end('Invalid user data')
                }

                const isLoggedIn = checkUser(userName, userPassword)
                if (!isLoggedIn) {
                    return res.writeHead(400).end('Invalid user data')
                }
                return res.writeHead(200).end(JSON.stringify({ userName, userPassword }))
            }
        })
    }
    if (req.method === 'GET') {
        let filePath = __dirname + req.url
        if (req.url === '/') filePath = __dirname + '/index.html'
        
        try {
            const file = fs.readFileSync(filePath)
            res.end(file)
        } catch (e) {
            res.writeHead(500).end(e.message)
        }
    }
})

app.listen(3000, () => console.log('Server work'));