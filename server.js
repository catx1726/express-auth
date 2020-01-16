const express = require('express')

const { User } = require('./model')

const app = express()

// token生成的密钥,不应该出现在线上代码库中
const secret = 'cad66'

const jwt = require('jsonwebtoken')

app.get('/', async (req, res) => {
    res.send('index.html ok!')
})

/* 显示所有用户 */
app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

/* 注册 */
app.post('/api/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send('注册成功')
})

/* 登陆 */
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    // 1. 比较用户名，检测是否存在用户
    if (!user) {
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    // 2. 比较用户的密码是否正确，用bcrypt
    // TODO 2019年12月20日 目前brypt下载不了，晚点再试 
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码错误'
        })
    }
    // 3. 生成token，用jsonwebtoken
    const token = jwt.sign({
        id: String(user._id)
    }, secret)
    res.send({
        user,
        token: token
    })
})

/* 检测用户token的中间件(因为很多请求都需要检测Token) */
const auth = async (req, res, next) => {
    // 1. 拿到用户传上来的token
    // 2. 通过secret进行token转译，获取相应的用户信息
    // 3. 通过用户信息进行返回数据 
    const raw = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(rew, secret)
    req.user = await User.findById(id) // 将user挂载到req，供后面访问
    next()
}

/* 获取用户信息 */
app.get('/api/userprofile', auth, async (req, res) => {
    res.send(user)
})

app.listen(3001, () => {
    console.log(`http://localhost:3001`)
})