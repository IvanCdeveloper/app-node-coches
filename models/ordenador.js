// Using Node.js `require()`
const mongoose = require('mongoose');


//definimos el esquema del documento
const ordenadorSchema = new mongoose.Schema({
  marca: String,
  precio: Number
});
//creamos el modelo

const Ordenador = mongoose.model('Ordenadore', ordenadorSchema, 'ordenadores');
const buscaPrimero = () => {
  //buscamos el primer registro
  return Ordenador.findOne()
    .then(ordenador => {
      if (ordenador) {
        console.log('Primer ordenador encontrado', ordenador);
      } else {
        console.log('No se encontró ningún registro')
      }
    })
    .catch(err => console.error('Error al obtener el ordenador', err));
}

const buscaTodos = () => {
  //buscamos todos los registros
  return Ordenador.find()
    .then(ordenadores => {
      if (ordenadores.length > 0) {
        /*console.log('Ordenadores encontrados',ordenadores);*/
        return ordenadores;
      } else {
        console.log('No se encontró ningún registro');
        return null;
      }
    })
    .catch(err => {
      console.error('Error al obtener los ordenadores', err);
      throw err;
    });
}

const buscaPorId = (id) => {
  //buscamos el primer registro
  return Ordenador.findById(id)
    .then(ordenador => {
      if (ordenador) {
        //console.log('Primer ordenador encontrado',ordenador);
        return ordenador;
      } else {
        console.log('No se encontró ningún registro con el id' + id);
        return null;
      }
    })
    .catch(err => {
      console.error('Error al obtener el ordenador' + id, err);
      throw err;
    });
}

/***************************** */
// busca por precio mayor a 3000
/****************************** */
const buscaPrecioMayor = (precioMinimo) => {
  //buscamos todos los registros
  Ordenador.find({ precio: { $gt: precioMinimo } })
    .then(ordenadores => {
      if (ordenadores.length > 0) {
        console.log('Ordenadores encontrados con precio mayor a ' + precioMinimo, ordenadores)
      } else {
        console.log('No se encontró ningún registro')
      }
    })
    .catch(err => console.error('Error al obtener los ordenadores', err));
}

const creaNuevoOrdenador = (m, p) => {
  const nuevoOrdenador = new Ordenador({
    marca: m,
    precio: p
  });

  // Guardar el ordenador en la base de datos
  return nuevoOrdenador.save()
    .then(ordenador => {
      console.log('Ordenador guardado:', ordenador);
      return ordenador;
    })
    .catch(err => {
      console.error('Error al guardar el ordenador:', err);
      throw err;
    });

}
const creaNuevoOrdenadorGeneral = (ordenador) => {
  const nuevoOrdenador = new Ordenador({
    marca: m,
    precio: p
  });

  // Guardar el ordenador en la base de datos
  return nuevoOrdenador.save()
    .then(ordenador => {
      console.log('Ordenador guardado:', ordenador);
      return ordenador;
    })
    .catch(err => {
      console.error('Error al guardar el ordenador:', err);
      throw err;
    });

}

const actualizaPrecio = (idOrdenador, nuevoPrecio) => {
  Ordenador.findByIdAndUpdate(idOrdenador, { precio: nuevoPrecio }, { new: true })
    .then(ordenadorActualizado => {
      if (ordenadorActualizado) {
        console.log('Ordenador actualizado:', ordenadorActualizado);
      } else {
        console.log('No se encontró ningún ordenador con ese ID.');
      }
    })
    .catch(err => console.error('Error al actualizar el ordenador:', err));
}

const actualizaOrdenador = (idOrdenador, ordenadorActualizar) => {
  return Ordenador.findByIdAndUpdate(idOrdenador, ordenadorActualizar, { new: true })
    .then(ordenadorActualizado => {
      if (ordenadorActualizado) {
        console.log('Ordenador actualizado:', ordenadorActualizado);
        return ordenadorActualizado;
      } else {
        console.log('No se encontró ningún ordenador con ese ID.');
        return null;
      }
    })
    .catch(err => console.error('Error al actualizar el ordenador:', err));
}

const borraOrdenador = (idOrdenadorParaBorrar) => {
  return Ordenador.findByIdAndDelete(idOrdenadorParaBorrar)
    .then(ordenadorEliminado => {
      if (ordenadorEliminado) {
        console.log('Ordenador eliminado:', ordenadorEliminado);
        return ordenadorEliminado;
      } else {
        console.log('No se encontró ningún ordenador con ese ID.');
        return null;
      }
    })
    .catch(err => {
      console.error('Error al eliminar el ordenador:', err);
      throw err;
    });

}
module.exports = {
  actualizaOrdenador, buscaPrimero, buscaTodos, buscaPorId,
  buscaPrecioMayor, actualizaPrecio, borraOrdenador, creaNuevoOrdenador, Ordenador
}
