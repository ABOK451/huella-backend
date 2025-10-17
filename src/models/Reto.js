import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Reto = sequelize.define('Reto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  categoria: { type: DataTypes.ENUM('agua','energia','transporte','residuos','consumo'), allowNull: false },
  dificultad: { type: DataTypes.ENUM('facil','medio','dificil'), defaultValue: 'facil' },
  puntos: { type: DataTypes.INTEGER, defaultValue: 10 },
  impacto_co2: { type: DataTypes.FLOAT, defaultValue: 0, comment: 'kg de CO2 ahorrado' },
  impacto_agua: { type: DataTypes.FLOAT, defaultValue: 0, comment: 'litros de agua ahorrados' },
  instrucciones: { type: DataTypes.TEXT, allowNull: true },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'retos',
  timestamps: true
});

export default Reto;
