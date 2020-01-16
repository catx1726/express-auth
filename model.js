const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/express-auth', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})

const UserSchme = new mongoose.Schema({
    // unique为其用户加上唯一索引，报错处理加上useCreateIndex
    usaername: { type: String, unique: true },
    password: {
        type: String, set(val) {
            // 对密码进行加密
            return require('bcrypt').hashSync(val, 10)
        }
    }
})

const User = mongoose.model('User', UserSchme)

module.exports = { User }