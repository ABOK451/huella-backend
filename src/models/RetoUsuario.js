import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { User } from './user.model.js';
import Reto from './reto.js';

const RetoUsuario = sequelize.define('RetoUsuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User.getTableName(), key: 'id' }
  },
  retoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Reto.getTableName(), key: 'id' }
  },
  completado: { type: DataTypes.BOOLEAN, defaultValue: false },
  fechaAsignacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fechaCompletado: { type: DataTypes.DATE, allowNull: true },
  notas: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'retos_usuarios',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['usuarioId','retoId','fechaAsignacion'] }
  ]
});

export default RetoUsuario;
