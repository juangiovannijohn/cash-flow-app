const { userModel } = require("./../models");
const mongoose = require("mongoose");

const getCategories = async (req, res) => {};

const getCategory = async (req, res) => {
  const userId = req.body.user;
  console.log(req.body);
  let ok = false;
  let msg = "categorias de usuario no encontradas";
  let status = 400;
  let categories;
  try {
    const data = await userModel.findById(userId);
    console.log("info del usuario encontrado", data);

    if (data != null && data.isActive) {
      ok = true;
      msg = "Usuario encontrado";
      status = 200;
      categories = {
        idUser: data._id,
        categories: data.categories,
      };
    }
    return res.status(status).json({
      ok,
      msg,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ ok: false, error: "El usuario especificado no existe CATCH" });
  }
};
const createCategory = async (req, res) => {
  const { id, categories } = req.body;

  const user = await userModel.findById(id);
  let categorias = user.categories;

  // Filtrar las categorías que ya existen en la lista actual de categorías del usuario
  const newCategories = categories.filter(
    (category) => !categorias.some((c) => c.name === category.name)
  );

  // Agregar las nuevas categorías a la lista de categorías del usuario
  categorias = categorias.concat(newCategories);

  // Actualizar las categorías del usuario en la base de datos
  user.categories = categorias;
  await user.save();

  res.status(200).json({ success: true, categorias });
};

const updateCategory = async (req, res) => {
  try {
    const { id, oldCategoryName, newCategoryName } = req.body;

    const user = await userModel.findById(id);
    let categorias = user.categories;

    // Buscar la categoría antigua y reemplazarla con la nueva
    const categoryIndex = categorias.findIndex(
      (category) => category.name === oldCategoryName
    );
    if (categoryIndex >= 0) {
      categorias[categoryIndex].name = newCategoryName;
    }

    // Actualizar las categorías del usuario en la base de datos
    user.categories = categorias;
    await user.save();

    res.status(200).json({ success: true, categorias });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al modificar la categoría." });
  }
};

const deleteCategory = async (req, res) => {
  const { id, categoryNames } = req.body;
  try {
    const user = await userModel.findById(id);
    let categorias = user.categories;

    // Filtrar las categorías que no coinciden con los nombres de categoría proporcionados
    categorias = categorias.filter(
      (category) => !categoryNames.includes(category.name)
    );

    // Actualizar las categorías del usuario en la base de datos
    user.categories = categorias;
    await user.save();

    res.status(200).json({ success: true, categorias });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
