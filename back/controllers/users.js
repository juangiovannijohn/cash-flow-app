const { userModel } = require("./../models");
const mongoose = require("mongoose");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Usuario o contraseña incorrectos",
      });
    }
    if(user.pass != password){
      return res.status(401).json({
        ok: false,
        error: "Usuario o contraseña incorrectos",
      });
    }
/*    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        error: "Usuario o contraseña incorrectos",
      });
    }
*/
    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      birthday: user.birthday,
      country: user.country,
      city: user.city,
      categories: user.categories,
    };

    return res.status(200).json({
      ok: true,
      user: userData,
      token: "token_de_autenticación",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      error: "Error al iniciar sesión",
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const data = await userModel.find({});
    const user = data.map((user) => {
      if (user.isActive) {
        return {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          lastname: data.lastname,
          birthday: user.birthday,
          country: user.country,
          city: user.city,
          categories: user.categories,
        };
      }
    });

    res.status(200).json({
      ok: true,
      users: user,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      ok: false,
      error,
    });
  }
};
const getUserById = async (req, res) => {
  const userId = req.body.user;
  let ok;
  let msg;
  let status;
  let user;
  try {
    const data = await userModel.findById(userId);
    console.log("info del usuario encontrado", data);

    if (data == null) {
      ok = false;
      msg = "El usuario especificado no existe";
      status = 401;
      user = null;
    } else if (!data.isActive) {
      console.log("El usuario ha sido eliminado");
      ok = false;
      msg = "El usuario ha sido eliminado";
      status = 403;
      user = null;
    } else {
      ok = true;
      msg = "Usuario encontrado";
      status = 200;
      user = {
        _id: data._id,
        email: data.email,
        role: data.role,
        name: data.name,
        lastname: data.lastname,
        birthday: data.birthday,
        country: data.country,
        city: data.city,
        categories: data.categories,
      };
    }
    return res.status(status).json({
      ok,
      msg,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ ok: false, error: "El usuario especificado no existe CATCH" });
  }
};
const getUserByEmail = async (req, res) => {
  const email = req.body.email;
  try {
    const data = await userModel.findOne({ email });
    const user = {
      _id: data._id,
      email: data.email,
      role: data.role,
      name: data.name,
      lastname: data.lastname,
      birthday: data.birthday,
      country: data.country,
      city: data.city,
      categories: data.categories,
    };
    if (!user) {
      console.log("no existe usuario");
      return res.status(403).json({
        ok: false,
        error: "El usuario especificado no existe",
      });
    }
    console.log("si se encontro usuario");
    return res.status(200).json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ ok: false, error: "El usuario especificado no existe CATCH" });
  }
};
const createUser = async (req, res) => {
  const {
    email,
    pass,
    role,
    name,
    lastname,
    birthday,
    country,
    city,
    categories,
  } = req.body;
  try {
    //const hashedPass = await bcrypt.hash(pass, 10);
    const hashedPass = pass;
    let cateGories = categories;
    if (categories == "") {
      cateGories = [{ name: "" }];
    }

    console.log({ cateGories });

    const user = await userModel.create({
      email,
      pass: hashedPass,
      role: role || "user",
      name,
      lastname,
      birthday,
      country,
      city,
      categories: cateGories,
    });
    //TODO: la info que devuelve, devuelve con password, es correcto ? o devolver algo como el estilo "pass": "el que colocaste anteriormente"

    console.log("Usuario creado correctamente");
    return res
      .status(201)
      .json({ ok: true, msg: "Usuario creado correctamente", user });
  } catch (error) {
    console.log("Error", error);
    //email duplicado
    if (mongoose.Error.ValidationError && error.code === 11000) {
      return res
        .status(400)
        .json({
          ok: false,
          error: "El correo electrónico ya está en uso",
          msg: error.message,
        });
    } else {
      return res
        .status(400)
        .json({
          ok: false,
          error: "Error al crear el usuario",
          msg: error.message,
        });
    }
  }
};
const updateUser = async (req, res) => {
  const { id, name, lastname, birthday, country, city } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        lastname,
        birthday,
        country,
        city,
      },
      { new: true }
    );
    console.log("usuario actualizado", user);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }

    const userReturn = {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      lastname: user.lastname,
      birthday: user.birthday,
      country: user.country,
      city: user.city,
      categories: user.categories,
    };

    return res.status(200).json({
      ok: true,
      msg: "Usuario actualizado correctamente",
      user: userReturn,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: falsem, msg: "Server error", error: error.message });
  }
};
const changePassUser = async (req, res) => {
  const { id, email, pass } = req.body;
  const byId = await userModel.findById(id);
  const byEmail = await userModel.findOne({ email });

  if(byEmail.pass == byId.pass){

  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        pass,
      },
      { new: true }
    );
    console.log("usuario actualizado", user);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }

    const userReturn = {
      _id: user._id,
      email: user.email,
      pass: user.pass,
    };

    return res.status(200).json({
      ok: true,
      msg: "Password actualizada correctamente",
      user: userReturn,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: falsem, msg: "Server error", error: error.message });
  }
}else{
    return res
    .status(400)
    .json({ ok: false, msg: "No se pudo cambiar la contraseña" });
}
}; //TODO: agregar buenas validaciones.

const deleteUser = async (req, res) => {
  const { id, email, pass } = req.body;
  const byId = await userModel.findById(id);
  const byEmail = await userModel.findOne({ email });

  if (byEmail.pass == pass && byId.pass == pass) {
    try {
      const user = await userModel.findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        { new: true }
      );
      console.log("usuario actualizado", user);
      if (!user) {
        return res.status(404).json({ ok: false, msg: "User not found" });
      }

      const userReturn = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        lastname: user.lastname,
        birthday: user.birthday,
        country: user.country,
        city: user.city,
        categories: user.categories,
        isActive: user.isActive,
      };

      return res.status(200).json({
        ok: true,
        msg: "Usuario actualizado correctamente",
        user: userReturn,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, msg: "Server error", error: error.message });
    }
  } else {
    return res
      .status(400)
      .json({ ok: false, msg: "Usuario o contraseña incorrectos" });
  }
};

const renewUser = async (req, res) => {
  const { id, email, pass } = req.body;
  const byId = await userModel.findById(id);
  const byEmail = await userModel.findOne({ email });

  if (byEmail.pass == pass && byId.pass == pass) {
    try {
      const user = await userModel.findByIdAndUpdate(
        id,
        {
          isActive: true,
        },
        { new: true }
      );
      console.log("usuario actualizado", user);
      if (!user) {
        return res.status(404).json({ ok: false, msg: "User not found" });
      }

      const userReturn = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        lastname: user.lastname,
        birthday: user.birthday,
        country: user.country,
        city: user.city,
        categories: user.categories,
        isActive: user.isActive,
      };

      return res.status(200).json({
        ok: true,
        msg: "Usuario actualizado correctamente",
        user: userReturn,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ ok: false, msg: "Server error", error: error.message });
    }
  } else {
    return res
      .status(400)
      .json({ ok: false, msg: "Usuario o contraseña incorrectos" });
  }
};

module.exports = {
  login,
  getUserById,
  getUserByEmail,
  getUsers,
  createUser,
  updateUser,
  changePassUser,
  deleteUser,
  renewUser,
};
