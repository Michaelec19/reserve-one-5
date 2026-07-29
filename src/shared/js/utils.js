export const validarTextosVacios = (text) => {
  if (!text || text?.trim()) {
    return null
  }

  return text
}
