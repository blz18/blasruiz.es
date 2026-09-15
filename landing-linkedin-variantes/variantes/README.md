# Variantes del hero

> Nota (15-sep-2026): la landing pasó de `landing-linkedin/index.html` a un archivo suelto en la raíz del repo, `landing-linkedin.html`. Esta carpeta (`landing-linkedin-variantes/`) solo guarda el material de referencia descartado; ya no vive junto a la página en producción.

## `hero-esfera-wireframe.html`

Versión conservada del hero con la esfera wireframe, la cámara interior y los elementos audiovisuales en rejilla de puntos. También hay una copia en `../hero-esfera-wireframe.html` (dentro de `landing-linkedin-variantes/`), preparada con las rutas ajustadas a esa carpeta.

Para recuperarla como landing activa, copia `../hero-esfera-wireframe.html` sobre `../../landing-linkedin.html` (raíz del repo) y ajusta la referencia del modelo (`assets/sfera.obj`) a `landing-linkedin-variantes/assets/sfera.obj`, ya que la landing activa ya no tiene una carpeta propia. El HTML de esta carpeta sirve como archivo de consulta directa y apunta a `../assets/sfera.obj`.
