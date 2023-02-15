import { useState, useEffect } from "react"
import {
    COLLECTIONS,
    ERROR,
    HOME,
    HOME_PATH,
    ILLUSTRATIONS,
    PHOTOGRAPHY,
} from "./defs"

export const getPage = (location) => {
    const path = location.pathname
    if (path.indexOf(COLLECTIONS) !== -1) {
        return COLLECTIONS
    } else if (path.indexOf(PHOTOGRAPHY) !== -1) {
        return PHOTOGRAPHY
    } else if (path.indexOf(ILLUSTRATIONS) !== -1) {
        return ILLUSTRATIONS
    } else if (path === HOME_PATH) {
        return HOME
    } else {
        return ERROR
    }
}

// Window Dimension observer https://stackoverflow.com/a/36862446
const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

// Hook to get the viewport height and width to set accurate device breakpoints in code
export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    )

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowDimensions
}
