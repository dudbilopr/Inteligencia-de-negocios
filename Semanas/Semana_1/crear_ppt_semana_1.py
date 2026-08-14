import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Colores UNAB
UNAB_BLUE = RGBColor(0, 56, 101) # #003865
UNAB_ORANGE = RGBColor(232, 92, 11) # #E85C0B
WHITE = RGBColor(255, 255, 255)
LIGHT_GRAY = RGBColor(240, 240, 240)

def apply_theme(slide, bg_color=UNAB_BLUE):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = bg_color

def format_text(shape, text, size_pt, bold=False, rgb=WHITE, align=PP_ALIGN.LEFT):
    shape.text = text
    for p in shape.text_frame.paragraphs:
        p.alignment = align
        for run in p.runs:
            run.font.size = Pt(size_pt)
            run.font.bold = bold
            run.font.color.rgb = rgb
            run.font.name = 'Century Gothic'

def add_bullet(tf, text, level=0, bold=False, rgb=WHITE, size=24):
    p = tf.add_paragraph()
    p.text = text
    p.level = level
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = rgb
    p.font.name = 'Century Gothic'

def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    blank_layout = prs.slide_layouts[6]

    # --- SLIDE 1: Title (High Impact) ---
    slide = prs.slides.add_slide(blank_layout)
    apply_theme(slide, UNAB_BLUE)
    tb1 = slide.shapes.add_textbox(Inches(1), Inches(2.5), Inches(11.33), Inches(2))
    format_text(tb1, "Inteligencia de Negocios", size_pt=60, bold=True, rgb=UNAB_ORANGE, align=PP_ALIGN.CENTER)
    tb2 = slide.shapes.add_textbox(Inches(1), Inches(4.5), Inches(11.33), Inches(1))
    format_text(tb2, "Clase 1: Introducción, Evolución y Conceptos Básicos\nDocente: Dudbil Olvasada Pabon Riaño", size_pt=30, bold=False, rgb=WHITE, align=PP_ALIGN.CENTER)

    def add_content_slide(title_text):
        sl = prs.slides.add_slide(blank_layout)
        apply_theme(sl, LIGHT_GRAY)
        tb = sl.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(12.33), Inches(1))
        format_text(tb, title_text, size_pt=45, bold=True, rgb=UNAB_BLUE)
        shape = sl.shapes.add_shape(1, Inches(0.5), Inches(1.5), Inches(12.33), Inches(0.05))
        shape.fill.solid()
        shape.fill.fore_color.rgb = UNAB_ORANGE
        shape.line.color.rgb = UNAB_ORANGE
        body = sl.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(12.33), Inches(5))
        tf = body.text_frame
        tf.word_wrap = True
        return sl, tf

    # --- SLIDE 2: Acuerdos ---
    sl, tf = add_content_slide("Acuerdos de Clase")
    add_bullet(tf, "Horario Oficial: Viernes de 10:00 AM a 1:00 PM.", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Puntualidad: Llegar a tiempo garantiza no perder conceptos clave.", level=1, rgb=UNAB_BLUE)
    add_bullet(tf, "Descansos Cognitivos: Haremos una pausa a las 11:30 AM.", level=1, rgb=UNAB_BLUE)
    add_bullet(tf, "Estrategia EMI: 10 minutos de inmersión en inglés por sesión.", level=1, rgb=UNAB_BLUE)

    # --- SLIDE 3: EMI Warm up ---
    sl, tf = add_content_slide("🇬🇧 EMI Strategy: Warm-Up")
    add_bullet(tf, "Let's activate our English and BI Vocabulary!", bold=True, rgb=UNAB_BLUE, size=36)
    add_bullet(tf, "\nActividad Interactiva:", level=0, size=32, rgb=UNAB_BLUE)
    add_bullet(tf, "Abran el archivo quiz_semana_1.html en sus navegadores.", level=1, bold=True, rgb=UNAB_ORANGE, size=30)
    add_bullet(tf, "Vamos a emparejar los conceptos (Dashboard, KPI, Data-Driven) con su definición.", level=1, rgb=UNAB_BLUE, size=26)

    # --- SLIDE 4: Que es BI ---
    sl, tf = add_content_slide("¿Qué es la Inteligencia de Negocios?")
    add_bullet(tf, "Definición (Sharda et al., 2020):", bold=True, rgb=UNAB_BLUE, size=32)
    add_bullet(tf, "Conjunto de estrategias, procesos y tecnologías enfocadas en la creación de conocimiento mediante análisis de datos.", level=1, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "El rol de la Analítica:", bold=True, rgb=UNAB_ORANGE, size=32)
    add_bullet(tf, "- Descriptiva: ¿Qué sucedió? (Reportes históricos)", level=1, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "- Predictiva: ¿Qué pasará? (Pronósticos, ML)", level=1, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "- Prescriptiva: ¿Qué debemos hacer? (Optimización)", level=1, rgb=UNAB_BLUE, size=28)

    # --- SLIDE 5: Glosario Técnico ---
    sl, tf = add_content_slide("Glosario Técnico de BI")
    add_bullet(tf, "ETL (Extract, Transform, Load):", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Extraer datos, transformarlos al formato analítico y cargarlos.", level=1, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "OLTP vs OLAP:", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "OLTP: Transacciones rápidas diarias (Ej. Caja Registradora).", level=1, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "OLAP: Consultas analíticas multidimensionales (Cubo de Datos).", level=1, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "Data Warehouse & Data Mart:", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Repositorio centralizado de datos (Warehouse) y sus subdivisiones por área (Marts).", level=1, rgb=UNAB_BLUE, size=22)

    # --- SLIDE 6: Storytelling ---
    sl, tf = add_content_slide("Storytelling con Datos")
    add_bullet(tf, "Principios de Diseño Visual (Knaflic, 2015):", bold=True, rgb=UNAB_ORANGE, size=32)
    add_bullet(tf, "1. Eliminar el desorden (Declutter):", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Quita bordes, gridlines y fondos que no sumen información.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "2. Dirigir la Atención:", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Usa colores vibrantes (naranja) SOLO para los datos clave. El resto en tonos neutros (gris/azul).", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "3. Evitar el 3D:", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Los gráficos 3D (especialmente Pie Charts) distorsionan las proporciones reales.", level=1, rgb=UNAB_BLUE, size=24)

    # --- SLIDE 7: Dashboards ---
    sl, tf = add_content_slide("Ejemplo Práctico: Dashboards")
    add_bullet(tf, "¿Qué hace a un Dashboard excelente?", bold=True, rgb=UNAB_BLUE, size=32)
    add_bullet(tf, "Jerarquía visual: Lo más importante (KPIs globales) va arriba a la izquierda.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Ley de Proximidad (Gestalt): Gráficos de un mismo tema deben agruparse espacialmente.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Menos es más: Un gerente tiene 5 segundos para entender si la empresa va bien o mal.", level=1, rgb=UNAB_BLUE, size=26)

    # --- SLIDE 8: Taller ---
    sl, tf = add_content_slide("Taller: Pair Programming")
    add_bullet(tf, "Análisis Crítico de Dashboards", bold=True, rgb=UNAB_ORANGE, size=32)
    add_bullet(tf, "1. Busquen en internet 2 Dashboards de Ventas (Uno saturado y uno limpio).", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "2. Analicen qué principios de Gestalt y 'Decluttering' se violan en el malo.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "3. Redacten un resumen en formato Markdown y súbanlo a GitHub.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Usen LLMNotebook como asistente crítico para esta evaluación.", level=1, bold=True, rgb=UNAB_BLUE, size=26)

    prs.save('diapositivas_semana_1.pptx')
    print("Presentación PPTX generada con éxito con contenido avanzado.")

if __name__ == '__main__':
    main()
