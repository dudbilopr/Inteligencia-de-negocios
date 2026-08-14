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
    # Cambiar a formato 16:9 (13.33 x 7.5 pulgadas)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    blank_layout = prs.slide_layouts[6]

    # --- SLIDE 1: Title (High Impact) ---
    slide = prs.slides.add_slide(blank_layout)
    apply_theme(slide, UNAB_BLUE)
    
    # Title Box
    tb1 = slide.shapes.add_textbox(Inches(1), Inches(2.5), Inches(11.33), Inches(2))
    format_text(tb1, "Inteligencia de Negocios", size_pt=60, bold=True, rgb=UNAB_ORANGE, align=PP_ALIGN.CENTER)
    
    # Subtitle Box
    tb2 = slide.shapes.add_textbox(Inches(1), Inches(4.5), Inches(11.33), Inches(1))
    format_text(tb2, "Clase 1: Introducción, Evolución y Conceptos Básicos\nDocente: Dudbil Olvasada Pabon Riaño", size_pt=30, bold=False, rgb=WHITE, align=PP_ALIGN.CENTER)

    # --- Helper to create standard content slide ---
    def add_content_slide(title_text):
        sl = prs.slides.add_slide(blank_layout)
        apply_theme(sl, LIGHT_GRAY)
        # Title
        tb = sl.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(12.33), Inches(1))
        format_text(tb, title_text, size_pt=45, bold=True, rgb=UNAB_BLUE)
        # Accent Line
        shape = sl.shapes.add_shape(1, Inches(0.5), Inches(1.5), Inches(12.33), Inches(0.05))
        shape.fill.solid()
        shape.fill.fore_color.rgb = UNAB_ORANGE
        shape.line.color.rgb = UNAB_ORANGE
        
        # Body frame
        body = sl.shapes.add_textbox(Inches(0.5), Inches(1.8), Inches(12.33), Inches(5))
        tf = body.text_frame
        tf.word_wrap = True
        return sl, tf

    # --- SLIDE 2: Acuerdos ---
    sl, tf = add_content_slide("Acuerdos de Clase")
    add_bullet(tf, "Para un ambiente de aprendizaje seguro y productivo:", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Puntualidad: Iniciamos a las 7:00 AM en punto.", level=1, rgb=UNAB_BLUE)
    add_bullet(tf, "Descansos Cognitivos: Haremos una pausa para evitar fatiga.", level=1, rgb=UNAB_BLUE)
    add_bullet(tf, "Estrategia EMI: Inmersiones cortas en inglés para fortalecer vocabulario.", level=1, rgb=UNAB_BLUE)
    add_bullet(tf, "Uso de IA: Usaremos LLMNotebook como copiloto ético.", level=1, rgb=UNAB_BLUE)

    # --- SLIDE 3: EMI Warm up ---
    sl, tf = add_content_slide("🇬🇧 EMI Strategy: Warm-Up")
    add_bullet(tf, "Let's activate our English and BI Vocabulary!", bold=True, rgb=UNAB_BLUE, size=36)
    add_bullet(tf, "\nActividad Interactiva:", level=0, size=32, rgb=UNAB_BLUE)
    add_bullet(tf, "Abran el archivo quiz_semana_1.html en sus navegadores.", level=1, bold=True, rgb=UNAB_ORANGE, size=30)
    add_bullet(tf, "Vamos a emparejar los conceptos (Dashboard, KPI, Data-Driven) con su definición.", level=1, rgb=UNAB_BLUE, size=26)

    # --- SLIDE 4: Que es BI ---
    sl, tf = add_content_slide("¿Qué es la Inteligencia de Negocios?")
    add_bullet(tf, "Definición:", bold=True, rgb=UNAB_BLUE, size=32)
    add_bullet(tf, "Es un conjunto de estrategias, procesos, aplicaciones, datos y tecnologías enfocadas en la administración y creación de conocimiento.", level=1, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "\nObjetivo Principal:", bold=True, rgb=UNAB_ORANGE, size=32)
    add_bullet(tf, "Convertir datos crudos en información accionable para la toma de decisiones.", level=1, rgb=UNAB_BLUE, size=28)

    # --- SLIDE 5: Evolucion BI ---
    sl, tf = add_content_slide("Evolución del BI")
    add_bullet(tf, "BI Tradicional (1.0):", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Generación de reportes estáticos por el departamento de TI.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "\nSelf-Service BI (2.0):", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Analistas explorando datos con herramientas como Power BI / Tableau.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "\nAugmented BI (3.0):", bold=True, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "Integración de Machine Learning y NLP para descubrir insights automáticamente.", level=1, rgb=UNAB_BLUE, size=24)

    # --- SLIDE 6: Storytelling ---
    sl, tf = add_content_slide("Storytelling con Datos")
    add_bullet(tf, "El poder de una buena historia (Knaflic, 2015):", bold=True, rgb=UNAB_BLUE, size=32)
    add_bullet(tf, "No basta con tener datos; hay que saber comunicarlos.", level=1, rgb=UNAB_BLUE, size=28)
    add_bullet(tf, "1. Entiende a tu audiencia y el contexto.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "2. Elige la presentación visual más adecuada.", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "3. Elimina el desorden visual (Declutter).", level=1, rgb=UNAB_BLUE, size=24)
    add_bullet(tf, "4. Dirige la atención donde realmente importa.", level=1, rgb=UNAB_BLUE, size=24)

    # --- SLIDE 7: Taller ---
    sl, tf = add_content_slide("Taller: Pair Programming")
    add_bullet(tf, "Exploración de Casos de Éxito en Empresas Data-Driven", bold=True, rgb=UNAB_ORANGE, size=32)
    add_bullet(tf, "1. Elijan una empresa (Netflix, Zara, Spotify, Amazon).", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "2. Investiguen qué tipo de datos recolectan (estructurados vs no estructurados).", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "3. Analicen cómo usan esos datos para tomar decisiones.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "4. Redacten un resumen en formato Markdown y súbanlo a GitHub.", level=1, rgb=UNAB_BLUE, size=26)
    add_bullet(tf, "Usen LLMNotebook como asistente de investigación.", level=1, bold=True, rgb=UNAB_BLUE, size=26)

    prs.save('diapositivas_semana_1.pptx')
    print("Presentación PPTX generada con éxito en colores UNAB.")

if __name__ == '__main__':
    main()
