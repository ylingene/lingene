import {
  COLLECTIONS,
  ERROR,
  HOME,
  ILLUSTRATIONS,
  PHOTOGRAPHY,
  PHOTOGRAPHY_PAGES,
} from "./defs"

// returns null if root path: '/'
const getCurrentBasePath = (location) =>
         location.pathname.match(/\w+/) && location.pathname.match(/\w+/)[0]

export const combineClassNames = (classNamesList) => classNamesList.join(' ')

export const getPage = (location) => {
    const basePath = getCurrentBasePath(location)
    switch (basePath) {
      case PHOTOGRAPHY:
        return PHOTOGRAPHY
      case COLLECTIONS:
        return COLLECTIONS
      case ILLUSTRATIONS:
        return ILLUSTRATIONS
      case null:
        return HOME
      default:
          return ERROR
    }
}

export const isCollectionsPage = (location) => {
    const page = getPage(location)
    return page === COLLECTIONS
}

export const isPhotographyGalleryPage = (location) => {
  const page = getPage(location)
  return page === PHOTOGRAPHY
}

export const isPhotographyPage = (location) => {
    const page = getPage(location)
    return PHOTOGRAPHY_PAGES.indexOf(page) >= 0
}
