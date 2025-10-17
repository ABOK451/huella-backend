import Reto from './reto.js';
import RetoUsuario from './RetoUsuario.js';
import { User } from './user.model.js';

// Relaciones
RetoUsuario.belongsTo(Reto, { foreignKey: 'retoId',  as: 'reto'  });
RetoUsuario.belongsTo(User, { foreignKey: 'usuarioId' });

Reto.hasMany(RetoUsuario, { foreignKey: 'retoId' });
User.hasMany(RetoUsuario, { foreignKey: 'usuarioId' });

export { Reto, RetoUsuario, User };
