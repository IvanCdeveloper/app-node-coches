const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = 3005;

require('dotenv').config();

mongoose.connect(process.env.CADENA)
  .then(() => console.log('Connected!'));

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use('/fotos', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');
const modeloCoche = require('./models/coche');
const User = require("./models/User");



const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_seguro';
const JWT_EXPIRES_IN = '2h';

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

app.get('/update_coche', (req, res) => {
  const id = req.query.id;
  modeloCoche.buscaPorId(id)
    .then(
      coche => res.render('actualiza', { coche })
    )
    .catch(err => res.status(500).send("error"))
});

app.post('/update_coche', (req, res) => {
  const { id, marca, color, potencia, precio } = req.body;
  modeloCoche.buscaPorId(id).then(coche => {
    if (coche) {
      coche.marca = marca;
      coche.color = color;
      coche.potencia = potencia;
      coche.precio = precio;
      coche.save()
        .then(coche => res.redirect('/'))
        .catch(err => res.status(500).send("error"))
    } else {
      res.status(404).send('Coche no encontrado');
    }
  });

});
// Ruta para subir archivos
app.post('/subir', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }
  res.json({ message: 'Archivo subido correctamente', file: req.file });
});

app.get('/usuarios', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ mensaje: Err }))

}
)

app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => res.render('usuario', { user }))
    .catch(error => res.status(500).json({ mensaje: Err }))

}


)


//registro de usuario
app.post('/registro', upload.single('foto'), (req, res) => {
  const { name, email, password } = req.body;

  // Encriptar contraseña
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Crear usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        foto: req.file.filename
      });


      // Guardar usuario
      return newUser.save();
    })
    .then(() => {
      res.json({ message: 'Usuario registrado correctamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

          const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: 'strict'
          });

          // Redirigir al perfil
          res.redirect('/perfil');
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    });
});

app.get('/logout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.redirect("./");
});

app.get('/perfil', authMiddleware, (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      res.render('perfil', {
        user: {
          name: user.name,
          email: user.email,
          foto: user.foto
        }
      });
    })
    .catch(error => {
      res.status(500).send('Error al cargar el perfil');
    });
});


// Obtener todos los ítems
app.get("/items", (req, res) => {
  modeloCoche.buscaTodos()
    .then(
      coches => res.status(200).json(coches)
    )
    .catch(err => res.status(500).send("error"))
});


// Obtener un ítem por ID
app.get("/items/:id", (req, res) => {
  const itemId = req.params.id;
  modeloCoche.buscaPorId(itemId)
    .then(
      coche => res.status(200).json(coche)
    )
    .catch(err => res.status(500).send("error"))
});


// Crear un nuevo ítem
app.post("/items", (req, res) => {
  marca = req.body.marca;
  color = req.body.color;
  potencia = req.body.potencia
  precio = req.body.precio;
  modeloCoche.creaNuevoCoche(marca, color, potencia, precio)
    .then(
      coche => res.status(200).json(coche)
    )
    .catch(err => res.status(500).send("error"))

});


// Actualizar un ítem existente
app.put("/items/:id", (req, res) => {
  const itemId = req.params.id;
  coche = req.body;
  //res.send(coche);
  modeloCoche.actualizaCoche(itemId, coche)
    .then(
      cocheAtualizado => res.status(200).json(cocheAtualizado)
    )
    .catch(err => res.status(500).send("error al actualizar el coche"))

});


// Eliminar un ítem
app.delete("/items/:id", (req, res) => {
  const itemId = req.params.id;
  modeloCoche.borraCoche(itemId)
    .then(
      coche => res.status(200).json(coche)
    )
    .catch(err => res.status(500).send("error"))

});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
