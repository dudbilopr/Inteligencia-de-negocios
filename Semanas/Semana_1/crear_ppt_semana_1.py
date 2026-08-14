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
    p.space_after = Pt(8)

def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    blank_layout = prs.slide_layouts[6]

    # --- SLIDE 1: Title (High Impact / Dark Mode) ---
    slide = prs.slides.add_slide(blank_layout)
    apply_theme(slide, UNAB_BLUE)
    tb1 = slide.shapes.add_textbox(Inches(1), Inches(2.5), Inches(11.33), Inches(2))
    format_text(tb1, "Inteligencia de Negocios", size_pt=60, bold=True, rgb=UNAB_ORANGE, align=PP_ALIGN.CENTER)
    tb2 = slide.shapes.add_textbox(Inches(1), Inches(4.5), Inches(11.33), Inches(1))
    format_text(tb2, "Clase 1: Evolución, Ecosistema y Diseño\nDocente: Dudbil Olvasada Pabon Riaño", size_pt=28, bold=False, rgb=WHITE, align=PP_ALIGN.CENTER)

    # Factory para Diapositivas Estándar
    def add_standard_slide(title_text):
        sl = prs.slides.add_slide(blank_layout)
        apply_theme(sl, LIGHT_GRAY)
        tb = sl.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(12.33), Inches(1))
        format_text(tb, title_text, size_pt=36, bold=True, rgb=UNAB_BLUE)
        shape = sl.shapes.add_shape(1, Inches(0.5), Inches(1.1), Inches(12.33), Inches(0.05))
        shape.fill.solid()
        shape.fill.fore_color.rgb = UNAB_ORANGE
        shape.line.color.rgb = UNAB_ORANGE
        body = sl.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(12.33), Inches(5.8))
        tf = body.text_frame
        tf.word_wrap = True
        return sl, tf

    # Factory para Split Screen (50/50 Layout)
    def add_split_slide(title_text):
        sl = prs.slides.add_slide(blank_layout)
        apply_theme(sl, LIGHT_GRAY)
        tb = sl.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(12.33), Inches(1))
        format_text(tb, title_text, size_pt=36, bold=True, rgb=UNAB_BLUE)
        
        # Left side
        body_left = sl.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(6), Inches(5.8))
        tf_left = body_left.text_frame
        tf_left.word_wrap = True
        
        # Right side
        body_right = sl.shapes.add_textbox(Inches(6.8), Inches(1.3), Inches(6), Inches(5.8))
        tf_right = body_right.text_frame
        tf_right.word_wrap = True
        
        return sl, tf_left, tf_right

    # --- SLIDE 2: Agenda (Grid-like text layout) ---
    sl, tf = add_standard_slide("Hoja de Ruta")
    add_bullet(tf, "1. Acuerdos y Reglas de Clase", bold=True, rgb=UNAB_ORANGE, size=26)
    add_bullet(tf, "2. Estrategia EMI (Warm-up en Inglés)", bold=True, rgb=UNAB_ORANGE, size=26)
    add_bullet(tf, "3. Ecosistema de Inteligencia de Negocios", bold=True, rgb=UNAB_ORANGE, size=26)
    add_bullet(tf, "4. Storytelling with Data (Knaflic)", bold=True, rgb=UNAB_ORANGE, size=26)
    add_bullet(tf, "5. Taller Práctico: Pair Programming", bold=True, rgb=UNAB_ORANGE, size=26)
    add_bullet(tf, "6. Conclusiones y Bibliografía", bold=True, rgb=UNAB_ORANGE, size=26)

    # --- SLIDE 3: Timeline Evolución (Simulated Timeline via shapes) ---
    sl, tf = add_standard_slide("Evolución del BI (Línea de Tiempo)")
    add_bullet(tf, "1980s: Sistemas DSS (Decision Support Systems). Reportes estáticos por IT.", bold=True, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "1990s: Data Warehousing. Nace OLAP y la Minería de Datos.", bold=True, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "2000s: BI Tradicional. Dashboards pesados a nivel corporativo.", bold=True, rgb=UNAB_BLUE, size=22)
    add_bullet(tf, "2010s: Self-Service BI (Power BI). Democratización del dato.", bold=True, rgb=UNAB_ORANGE, size=22)
    add_bullet(tf, "2020s: Augmented BI. IA Generativa integrada.", bold=True, rgb=UNAB_ORANGE, size=22)

    # --- SLIDE 4: Split Screen Cuadro Sinóptico ---
    sl, tf_left, tf_right = add_split_slide("Arquitectura Base (ETL y OLAP)")
    add_bullet(tf_left, "Extracción y Transformación:", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf_left, "El 80% del tiempo de un analista se va en limpiar datos (ETL).", level=1, rgb=UNAB_BLUE, size=20)
    add_bullet(tf_left, "Sistemas OLTP son para registrar la venta en caja, no para sacar métricas de 5 años.", level=1, rgb=UNAB_BLUE, size=20)
    
    add_bullet(tf_right, "Carga y Visualización:", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf_right, "El Data Warehouse almacena la historia limpia (OLAP).", level=1, rgb=UNAB_BLUE, size=20)
    add_bullet(tf_right, "Los Dashboards consumen de ese Warehouse.", level=1, rgb=UNAB_BLUE, size=20)

    # --- SLIDE 5: High Impact Solo Text ---
    sl = prs.slides.add_slide(blank_layout)
    apply_theme(sl, UNAB_BLUE)
    tb = sl.shapes.add_textbox(Inches(1), Inches(2), Inches(11.33), Inches(3))
    format_text(tb, "Storytelling with Data\nNo se trata de mostrar números.\nSe trata de inspirar acciones.", size_pt=45, bold=True, rgb=UNAB_ORANGE, align=PP_ALIGN.CENTER)

    # --- SLIDE 6: Tips (Gestalt) ---
    sl, tf = add_standard_slide("Pro-Tips de Diseño (Knaflic)")
    add_bullet(tf, "Decluttering:", bold=True, rgb=UNAB_ORANGE, size=28)
    add_bullet(tf, "Remueve bordes, ejes redundantes y gridlines.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "Gestalt:", bold=True, rgb=UNAB_ORANGE, size=28)
    add_bullet(tf, "El cerebro agrupa objetos por proximidad. Agrupa los KPIs similares.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "Colores Focales:", bold=True, rgb=UNAB_ORANGE, size=28)
    add_bullet(tf, "Un solo color llamativo para el hallazgo, el resto en gris o azul oscuro.", level=1, rgb=UNAB_BLUE, size=24)

    # --- SLIDE 7: Mockup Image Layout ---
    sl = prs.slides.add_slide(blank_layout)
    apply_theme(sl, LIGHT_GRAY)
    tb = sl.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(12.33), Inches(1))
    format_text(tb, "El Dashboard Minimalista", size_pt=35, bold=True, rgb=UNAB_BLUE)
    
    img_path = 'dashboard_mockup.png'
    if os.path.exists(img_path):
        sl.shapes.add_picture(img_path, Inches(1.5), Inches(1.5), width=Inches(10.33))

    # --- SLIDE 8: Conclusiones ---
    sl, tf = add_standard_slide("Conclusiones")
    add_bullet(tf, "El diseño de datos es estrategia organizacional.", bold=True, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Si un dashboard no puede leerse en 5 segundos, fracasó.", bold=True, rgb=UNAB_BLUE, size=26)

    prs.save('diapositivas_semana_1.pptx')
    print("Presentación PPTX interactiva generada con éxito.")

if __name__ == '__main__':
    main()
