import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import { Reto, RetoUsuario, User } from '../models/associations.js';

// Obtener todos los retos activos
export const obtenerRetos = async (req, res) => {
  try {
    const retos = await Reto.findAll({
      where: { activo: true },
      order: [['createdAt', 'DESC']],
    });
    res.json(retos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener retos', detalle: error.message });
  }
};

// Obtener retos por categoría
export const obtenerRetosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const retos = await Reto.findAll({
      where: { activo: true, categoria },
      order: [['dificultad', 'ASC']],
    });
    res.json(retos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener retos por categoría', detalle: error.message });
  }
};

const MAX_RETOS_DIARIOS = 16; 

// Obtener retos diarios para un usuario
export const obtenerRetoDiario = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // 1. Buscar los retos ya asignados HOY
        let retosHoy = await RetoUsuario.findAll({ 
            where: { usuarioId, fechaAsignacion: { [Op.gte]: hoy } },
            include: [{ model: Reto, as: 'reto' }],
            order: [['fechaAsignacion', 'DESC']], // Opcional: ordenar
        });

        const retosAsignados = retosHoy.length;

        // 2. Si tiene menos del máximo, asignar los restantes
        if (retosAsignados < MAX_RETOS_DIARIOS) {
            
            const retosCompletados = await RetoUsuario.findAll({
                where: { usuarioId, completado: true },
                attributes: ['retoId'],
            });
            const idsCompletados = retosCompletados.map(r => r.retoId);
            
            // IDs de retos asignados hoy para no duplicar en la misma tanda
            const idsAsignadosHoy = retosHoy.map(r => r.retoId);

            const idsAExcluir = [...new Set([...idsCompletados, ...idsAsignadosHoy])];
            
            // Cantidad de retos que faltan por asignar
            const cantidadFaltante = MAX_RETOS_DIARIOS - retosAsignados;

            // 3. Buscar la cantidad faltante de retos aleatorios
            const nuevosRetosAleatorios = await Reto.findAll({
                where: { 
                    activo: true, 
                    id: { 
                        [Op.notIn]: idsAExcluir.length ? idsAExcluir : [0] // Evitar IDs completados o ya asignados hoy
                    } 
                },
                order: sequelize.random(), // Obtener de forma aleatoria
                limit: cantidadFaltante, // Limitar a la cantidad que falta
            });

            // Si no hay más retos para asignar, terminar
            if (nuevosRetosAleatorios.length > 0) {
                const nuevosRetosUsuario = nuevosRetosAleatorios.map(reto => ({
                    usuarioId,
                    retoId: reto.id,
                    fechaAsignacion: new Date()
                }));

                // 4. Crear las nuevas asignaciones
                const instanciasCreadas = await RetoUsuario.bulkCreate(nuevosRetosUsuario);
                const idsCreados = instanciasCreadas.map(i => i.id);

                // 5. Obtener las nuevas asignaciones con la información del Reto
                const nuevosRetosConDetalle = await RetoUsuario.findAll({
                    where: { id: { [Op.in]: idsCreados } },
                    include: [{ model: Reto, as: 'reto' }],
                });
                
                // 6. Combinar las listas
                retosHoy = [...retosHoy, ...nuevosRetosConDetalle];
            }
        }

        // 7. Devolver solo los detalles de los retos (el array de 'reto' dentro de RetoUsuario)
        const retosFinales = retosHoy.map(ru => ru.reto);
        
        res.json(retosFinales); 

    } catch (error) {
        console.error('Error en obtenerRetoDiario:', error);
        res.status(500).json({ error: 'Error al obtener reto diario', detalle: error.message });
    }
};

// Marcar reto como completado
export const completarReto = async (req, res) => {
  try {
    const { retoUsuarioId } = req.params;
    const usuarioId = req.user.id;

    // req.body puede venir vacío en multipart, así que validamos:
    const notas = req.body.notas || null;

    // Si envías un JSON string con 'datosExtra'
    let datosExtra = {};
    if (req.body.datosExtra) {
      try {
        datosExtra = JSON.parse(req.body.datosExtra);
      } catch (e) {
        console.warn('Error parseando datosExtra:', e);
      }
    }

    const retoUsuario = await RetoUsuario.findOne({ where: { id: retoUsuarioId, usuarioId } });
    if (!retoUsuario) return res.status(404).json({ error: 'Reto no encontrado' });
    if (retoUsuario.completado) return res.status(400).json({ error: 'Este reto ya fue completado' });

    // ✅ Marcar reto como completado
    retoUsuario.completado = true;
    retoUsuario.fechaCompletado = new Date();

    if (notas) retoUsuario.notas = notas;

    // Si quieres guardar evidencia, puedes hacerlo aquí
    if (req.file) {
      retoUsuario.evidencia = req.file.filename;
    }

    await retoUsuario.save();

    res.json({ mensaje: 'Reto completado exitosamente', reto: retoUsuario, datosExtra });
  } catch (error) {
    console.error('Error completarReto:', error);
    res.status(500).json({ error: 'Error al completar reto', detalle: error.message });
  }
};


// Obtener historial de retos del usuario
export const obtenerHistorialRetos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const historial = await RetoUsuario.findAll({
      where: { usuarioId },
      include: [{ model: Reto }],
      order: [['fechaAsignacion', 'DESC']],
    });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial', detalle: error.message });
  }
};

// Obtener estadísticas de retos del usuario
export const obtenerEstadisticas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const total = await RetoUsuario.count({ where: { usuarioId } });
    const completados = await RetoUsuario.count({ where: { usuarioId, completado: true } });

    const impactoData = await RetoUsuario.findAll({ where: { usuarioId, completado: true }, include: [Reto] });

    let totalCO2 = 0, totalAgua = 0, totalPuntos = 0;
    impactoData.forEach(r => {
      if (r.Reto) {
        totalCO2 += r.Reto.impacto_co2 || 0;
        totalAgua += r.Reto.impacto_agua || 0;
        totalPuntos += r.Reto.puntos || 0;
      }
    });

    res.json({
      total,
      completados,
      pendientes: total - completados,
      porcentajeCompletado: total > 0 ? ((completados / total) * 100).toFixed(2) : 0,
      impacto: { co2Ahorrado: totalCO2.toFixed(2), aguaAhorrada: totalAgua.toFixed(2), puntosGanados: totalPuntos },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas', detalle: error.message });
  }
};
