const { categoryModel, userModel } = require('./../models');

const getCategories = async (req, res)=>{
    const data = await categoryModel.find({});

        res.send({data})
    }

const getCategory = ( ) => { }

// const createCategory = async (req, res) => {
//     const body = req.body;
//     const data =await categoryModel.create(body);
//     console.log({body});

//     res.send(data)
// }

const createCategory = async (req, res) => {
    const body = req.body;
    const userId = body.user;

    // Verificar que el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(400).send({ error: 'El usuario especificado no existe' });
    }

    // Crear la categoría
    const data = await categoryModel.create(body);
    console.log({body});

    res.send(data)
}

const updateCategory = () => {}

const deleteCategory = ( ) => {}

module.exports = { 
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
}