import { GatsbyImage, getImage } from "gatsby-plugin-image"
import getJustifiedLayout from "justified-layout"
import React, { useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import useResizeObserver from "use-resize-observer"
import initializeLightbox, { GALLERY_ID, getLightboxData } from "./lightbox"
import { useWindowDimensions } from "../../utils/utils"

import "photoswipe/style.css"
import "./photoswipe.scss"
import {
    galleryContainer,
    screen_desktop,
    screen_mobile_small,
} from "./style.scss"

const GALLERY_CONFIG = {
    boxSpacing: 5,
    containerPadding: 0,
    targetRowHeight: 400,
    targetRowHeightTolerance: 0.25,
}

/**
 * Returns mobile image sizes by using the galleryWidth as the image width
 * and scales down the corresponding height based on the image's aspect
 * ratio.
 * @param {int} galleryWidth - integer size of the parent gallery container
 * @param {*} imageDimensions - list of image dimensions, containing height and width
 * @returns list of objects containing height and width of each image
 */
const getMobileImageSizes = (galleryWidth, imageDimensions) =>
    imageDimensions.map(({ height, width }) => {
        const aspectRatio = width / height
        return {
            height: galleryWidth / aspectRatio,
            width: galleryWidth,
        }
    })

/**
 * Gets the image dimensions for each image based on the gallery's width.
 * On larger screens Flickr's justified layout is used.
 * The dimensions should be used with a wrapping div around the corresponding
 * image to allocate a defined height and width for the image to resize into.
 * @param {int} galleryWidth - integer size of the parent gallery container
 * @param {int} windowWidth - integer width of the viewport
 * @param {*} images - list of GatsbyImageData images
 * @returns list of objects containing the height and width for each image
 */
const getImageLayout = (galleryWidth, windowWidth, images) => {
    const imageDimensions = images.map(({ image }) => {
        const img = getImage(image)
        return {
            height: img.height,
            width: img.width,
        }
    })

    /**
     * On small screens, display one image per row.
     * Justified layout doesn't produce the same result (one image per row
     * with consistent bottom margins) even with fullWidthBreakoutRowCadence
     * due to target height and tolerance.
     */
    if (windowWidth <= screen_mobile_small) {
        return {
            boxes: getMobileImageSizes(galleryWidth, imageDimensions),
            widowCount: 0,
        }
    }

    const justifiedLayoutConfig = {
        ...GALLERY_CONFIG,
        containerWidth: galleryWidth,
    }
    return getJustifiedLayout(imageDimensions, justifiedLayoutConfig)
}

/**
 * Gets the loading behavior of the given image. Earlier images should be loaded
 * ASAP for a better user experience (reduce Largest Contentful Paint).
 * @param {int} windowWidth - integer width of the viewport
 * Note that this is an approximate to the actual device width.
 * @param {int} i - index of the photo in the gallery. Used to determine whether
 * to eager load the image or not.
 * @returns string "eager" or "lazy" denoting to eager or lazy loading the image
 */
const getImageLoadBehavior = (windowWidth, i) => {
    // Eager load the first few photos depending on the screen size. Screen sizes
    // smaller than desktop will have fewer images eager loaded.
    let shouldEagerLoad = false
    if (windowWidth < screen_desktop) {
        shouldEagerLoad = i < 3
    } else {
        shouldEagerLoad = i < 6
    }

    return shouldEagerLoad ? "eager" : "lazy"
}

/**
 * Widows are images that do not take up a full row, leaving empty space to
 * the right. This component creates an empty div filling up that remaining
 * space because the className style `galleryContainer` uses justify-content
 * space-between and will cause widows to be spaced at the left and right
 * ends of the last row.
 *
 * Note: removing widows and using replacing justify-content with gap causes
 * image size issues when resizing.
 */
const Widow = ({ containerWidth, widowBoxes, boxSpacing }) => {
    const height = widowBoxes[0].height
    const width =
        containerWidth -
        widowBoxes.reduce((acc, cur) => acc + cur.width, 0) -
        widowBoxes.length * boxSpacing
    return <div style={{ height, width }} />
}

Widow.propTypes = {
    containerWidth: PropTypes.number.isRequired,
    widowBoxes: PropTypes.arrayOf(
        PropTypes.shape({
            aspectRatio: PropTypes.number,
            height: PropTypes.number,
            left: PropTypes.number,
            top: PropTypes.number,
            width: PropTypes.number,
        })
    ).isRequired,
    boxSpacing: PropTypes.number.isRequired,
}

const Gallery = ({ fluidImages }) => {
    const { ref: containerRef, width } = useResizeObserver()
    const { width: windowWidth } = useWindowDimensions()

    const galleryLayout = useMemo(() => {
        return width && windowWidth
            ? getImageLayout(width, windowWidth, fluidImages)
            : null
    }, [fluidImages, width, windowWidth])

    useEffect(initializeLightbox, [])

    return (
        <div ref={containerRef} className={galleryContainer} id={GALLERY_ID}>
            {galleryLayout &&
                fluidImages.map(({ alt, image }, i) => (
                    <a
                        key={image.id}
                        rel="noreferrer"
                        {...getLightboxData(alt, image)}
                        style={{
                            height: galleryLayout.boxes[i].height,
                            width: galleryLayout.boxes[i].width,
                            marginBottom: GALLERY_CONFIG.boxSpacing,
                        }}
                    >
                        <GatsbyImage
                            image={getImage(image)}
                            alt={alt}
                            loading={getImageLoadBehavior(windowWidth, i)}
                        />
                    </a>
                ))}
            {galleryLayout &&
                galleryLayout.widowCount > 0 &&
                galleryLayout.widowCount < fluidImages.length && (
                    <Widow
                        containerWidth={width}
                        widowBoxes={galleryLayout.boxes.slice(
                            galleryLayout.boxes.length -
                                galleryLayout.widowCount
                        )}
                        boxSpacing={GALLERY_CONFIG.boxSpacing}
                    />
                )}
        </div>
    )
}

Gallery.propTypes = {
    fluidImages: PropTypes.arrayOf(
        PropTypes.shape({
            alt: PropTypes.string.isRequired,
            type: PropTypes.string,
            image: PropTypes.shape(
                {
                    id: PropTypes.string.isRequired,
                    childImageSharp: PropTypes.shape({
                        gatsbyImageData: PropTypes.shape({
                            height: PropTypes.number,
                            images: PropTypes.shape({
                                fallback: PropTypes.shape({
                                    src: PropTypes.string,
                                    srcSet: PropTypes.string,
                                    sizes: PropTypes.string,
                                }),
                                sources: PropTypes.arrayOf(
                                    PropTypes.shape({
                                        srcSet: PropTypes.string,
                                        type: PropTypes.string,
                                        sizes: PropTypes.string,
                                    })
                                ),
                            }),
                            layout: PropTypes.string,
                            width: PropTypes.number,
                        }).isRequired,
                    }).isRequired,
                }.isRequired
            ),
        })
    ).isRequired,
}

export default Gallery
