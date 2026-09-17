// Por: Santiago Castrillón Rojo
export const CatalogItemModal = (item = null) => {
  const isEditMode = Boolean(item)

  const isChecked = (val) => {
    if (!item?.category) return '';
    if (Array.isArray(item.category)) {
      return item.category.includes(val) ? 'checked' : '';
    }
    return item.category === val ? 'checked' : '';
  }

  return `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">${isEditMode ? 'Editar' : 'Agregar'} Programa de Clases</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="catalogForm" data-edit-id="${item?.id ?? ''}">
            <div class="mb-3">
              <label for="title" class="form-label fw-semibold small">Nombre de la Clase / Programa</label>
              <input type="text" class="form-control" id="title" name="title" placeholder="Ej. Combate Deportivo" value="${item?.title ?? ''}" required>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label fw-semibold small">Descripción</label>
              <textarea class="form-control" id="description" name="description" rows="3" placeholder="Breve detalle del programa..." required>${item?.description ?? ''}</textarea>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-semibold small mb-2">Categoría (Selecciona una o varias)</label>
              <button class="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#categoriesCollapse" 
                      aria-expanded="false" 
                      aria-controls="categoriesCollapse">
                <span class="small text-dark">Desplegar opciones...</span>
                <i class="fa-solid fa-chevron-down small text-secondary"></i>
              </button>
              
              <div class="collapse mt-2" id="categoriesCollapse">
                <div class="list-group border rounded shadow-sm" style="max-height: 220px; overflow-y: auto;">
                  
                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="Kids" ${isChecked('Kids')}>
                    <span class="w-100 small text-dark">Kids</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="Regular" ${isChecked('Regular')}>
                    <span class="w-100 small text-dark">Regular</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="Estudiantes" ${isChecked('Estudiantes')}>
                    <span class="w-100 small text-dark">Tarifa de Estudiantes</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="Gratis" ${isChecked('Gratis')}>
                    <span class="w-100 small text-dark">Gratis</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="FullPass" ${isChecked('FullPass')}>
                    <span class="w-100 small text-dark">Full Pass</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="EspecializadaSinMensualidad" ${isChecked('EspecializadaSinMensualidad')}>
                    <span class="w-100 small text-dark">Sin mensualidad activa</span>
                  </label>

                  <label class="list-group-item d-flex gap-3 align-items-center list-group-item-action" style="cursor: pointer;">
                    <input class="form-check-input flex-shrink-0 category-checkbox mt-0" type="checkbox" name="category" value="EspecializadaAdicional" ${isChecked('EspecializadaAdicional')}>
                    <span class="w-100 small text-dark">Especializada Adicional</span>
                  </label>
                  
                </div>
              </div>
              <small class="text-danger d-none mt-1" id="categoryError">Debes seleccionar al menos una categoría.</small>
            </div>

            <div class="mb-3">
              <label for="image" class="form-label fw-semibold small">Imagen</label>
              <input
                type="file"
                class="form-control"
                id="image"
                name="image"
                accept="image/*"
                ${isEditMode ? '' : 'required'}
              />
              <small id="imageHelpText" class="text-muted ${isEditMode ? '' : 'd-none'}">Si no deseas cambiar la imagen, puedes dejar este campo vacío</small>
            </div>
            <div class="d-flex justify-content-end gap-2 pt-2">
              <button type="submit" class="btn btn-primary" id="addCatalogItem">${isEditMode ? 'Guardar Cambios' : 'Guardar Programa'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
}