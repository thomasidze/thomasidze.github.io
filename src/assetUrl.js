// Пути из profile.js пишутся от корня ('/bg/cross.mp4'). Сайт может жить и в подпапке
// (например, thomasidze.github.io/Portfolio-Website/), поэтому превращаем их в относительные
// к базе сборки. Внешние ссылки (https://...) не трогаем.
export const assetUrl = (path) => {
  if (!path || /^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
