# Guía de Clase Semana 1: Introducción a la Inteligencia de Negocios

**Módulo:** Inteligencia de Negocios  
**Semana:** 1  
**Tiempo estimado:** 3 horas presenciales  
**Objetivo de Aprendizaje:** Comprender la evolución, concepto e impacto de la Inteligencia de Negocios, conocer la terminología técnica estándar (Glosario BI) y entender los principios básicos de diseño visual de Dashboards.

---

## ⏰ Agenda de la Sesión (180 min)

1. **10:00 - 10:20 AM (20 min):** Bienvenida y Presentación del Curso (Syllabus, Reglas, Evaluación).
2. **10:20 - 10:40 AM (20 min):** Estrategia EMI (Vocabulario en inglés y Quiz Interactivo).
3. **10:40 - 11:30 AM (50 min):** Teoría Parte 1: Evolución de BI, Tipos de datos, Glosario Clave (ETL, OLAP vs OLTP, Data Warehouse).
4. **11:30 - 11:50 AM (20 min):** Descanso Cognitivo ☕.
5. **11:50 - 12:20 PM (30 min):** Teoría Parte 2: Introducción a *Storytelling with Data* y Principios Gestalt para Dashboards.
6. **12:20 - 12:50 PM (30 min):** Taller Pair Programming: Análisis de Ejemplos de Dashboards Reales (Bueno vs Malo).
7. **12:50 - 1:00 PM (10 min):** Conclusiones y cierre.

---

## 📚 Glosario de Términos (Extraído de Sharda et al.)

Para alinear el conocimiento técnico del curso, hoy definiremos:
- **ETL (Extract, Transform, Load):** El proceso de extraer datos de los sistemas fuente, transformarlos para que tengan un formato analítico, y cargarlos en un Data Warehouse.
- **OLTP (Online Transaction Processing):** Sistemas diseñados para manejar transacciones diarias rápidas (Ej. Sistema de caja de un supermercado).
- **OLAP (Online Analytical Processing):** Sistemas diseñados para consultas analíticas complejas y multidimensionales.
- **Data Warehouse (Bodega de Datos):** Repositorio centralizado de datos estructurados integrados de múltiples fuentes.
- **Data Mart:** Un subconjunto del Data Warehouse enfocado en una línea de negocio específica (ej. Ventas o Finanzas).
- **Analítica Descriptiva vs Predictiva:** Descriptiva (¿Qué pasó?), Predictiva (¿Qué pasará?).

---

## 🎨 Tips de Diseño para Dashboards (Knaflic - Storytelling with Data)

Para dejar de hacer "gráficos básicos" y crear Dashboards de alto impacto:
1. **Decluttering (Eliminar el desorden):** Todo elemento que no aporte valor debe ser eliminado (bordes innecesarios, fondos grises, grid lines gruesas).
2. **Principio de Proximidad y Similitud (Gestalt):** Agrupa los KPIs relacionados visualmente usando los colores institucionales para indicar pertenencia.
3. **Atención Dirigida:** Usa el color naranja (#E85C0B) solo para resaltar el dato crítico que la gerencia debe ver, manteniendo el resto en azul oscuro (#003865) o gris.
4. **Evita los Gráficos 3D:** Distorsionan la percepción de los datos reales. Nunca uses *Pie charts* en 3D.

---

## 🇬🇧 Estrategia EMI (English as a Medium of Instruction)

**Vocabulario Clave:**
- *Data Warehouse*, *ETL*, *Insights*, *Clutter*, *Dashboard*.

*Acción para el docente:* Dirigir a los estudiantes a abrir el archivo `quiz_semana_1.html` para un ejercicio interactivo de completar espacios.

---

## 🧠 Taller de Exploración (Pair Programming)

**Actividad:** Exploración Guiada de Dashboards
**Herramientas:** LLMNotebook (o ChatGPT/Claude) y GitHub.

**Instrucciones:**
1. Formar parejas de trabajo.
2. Busquen en internet 2 ejemplos de "Dashboards de Ventas" (Uno saturado/malo y uno limpio/bueno).
3. Utilizando el LLMNotebook como asistente de análisis, redacten:
   - ¿Qué principios de Gestalt / *Decluttering* viola el mal Dashboard?
   - ¿Por qué el buen Dashboard es efectivo para tomar decisiones rápidas?
4. Crear un archivo Markdown (`.md`) resumen en su repositorio de GitHub personal y compartir el link en el espacio de clase.
