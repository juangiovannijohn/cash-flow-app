const { userModel } = require('./../models');



const getUsers = async (req, res)=>{
    const data = await userModel.find({});

        res.send({data})
    }

const getUser =  async (req, res)=>{
    const body = req.body;
    const userId = body.user;
    try {
        const user = await userModel.findById(userId);
        console.log(user)
        if (!user) {
            console.log('no existe usuario')
            return res.status(403).send({ error: 'El usuario especificado no existe' });
        }
        console.log('si se encontro usuario')
           return  res.status(202).send({user})
        
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'El usuario especificado no existe CATCH' });
    }
}

const createUser = async (req, res) => {
    const body = req.body;
    const data =await userModel.create(body);
    console.log({body});

    res.send(data)
}

const updateUser = () => {}

const changePassUser = ( ) => {}

const deleteUser = ( ) => {}

const renewUser = ( ) => {}






module.exports = { 
    getUser,
    getUsers,
    createUser,
    updateUser,
    changePassUser,
    deleteUser,
    renewUser
}