import { GatsbyImage, getImage } from "gatsby-plugin-image"
import getJustifiedLayout from "justified-layout"
import React, { useMemo } from "react"
import PropTypes from "prop-types"
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"
import useResizeObserver from "use-resize-observer"

import {
    black,
    galleryContainer,
    screen_desktop,
    screen_mobile_small,
    white_faded,
} from "./style.scss"

const GALLERY_CONFIG = {
    boxSpacing: 5,
    containerPadding: 0,
    targetRowHeight: 400,
    targetRowHeightTolerance: 0.25,
}

const LIGHTBOX_OPTIONS = {
    settings: {
        disablePanzoom: true,
        hideControlsAfter: 2000,
        lightboxTransitionSpeed: 0.2,
        overlayColor: white_faded,
        slideTransitionSpeed: 0.2,
        slideTransitionTimingFunction: "easeIn",
    },
    buttons: {
        backgroundColor: "rgba(0,0,0,0)",
        iconColor: black,
        showAutoplayButton: false,
        showDownloadButton: false,
        showFullscreenButton: false,
    },
    caption: {
        showCaption: false,
    },
    progressBar: {
        showProgressBar: false,
    },
    thumbnails: {
        showThumbnails: false,
    },
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
 * On larger screens Flikr's justified layout is used.
 * The dimensions should be used with a wrapping div around the corresponding 
 * image to allocate a defined height and width for the image to resize into.
 * @param {int} galleryWidth - integer size of the parent gallery container
 * @param {*} images - list of GatsbyImageData images
 * @returns list of objects containing the height and width for each image
 */
const getImageLayout = (galleryWidth, images) => {
    const imageDimensions = images.map(({ image }) => {
        const img = getImage(image)
        return {
            height: img.height,
            width: img.width,
        }
    })

    /**
     * On small screens, display one image per row.
     * Justified layout doesn't produce the same result even with
     * fullWidthBreakoutRowCadence due to target height and tolerance.
     */
    if (galleryWidth <= screen_mobile_small) {
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
 * @param {int} galleryWidth - integer size of the parent gallery container.
 * Note that this is an approximate to the actual device width.
 * @param {int} i - index of the photo in the gallery. Used to determine whether
 * to eager load the image or not.
 * @returns string "eager" or "lazy" denoting to eager or lazy loading the image
 */
const getImageLoadBehavior = (galleryWidth, i) => {
    // Eager load the first few photos depending on the screen size. Screen sizes
    // smaller than desktop will have fewer images eager loaded.
    let shouldEagerLoad = false
    if (galleryWidth < screen_desktop) {
        shouldEagerLoad = i < 3
    }
    else {
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

    const galleryLayout = useMemo(() => {
        return width ? getImageLayout(width, fluidImages) : null
    }, [fluidImages, width])

    return (
        <SimpleReactLightbox>
            <SRLWrapper options={LIGHTBOX_OPTIONS}>
                <div ref={containerRef} className={galleryContainer}>
                    {galleryLayout &&
                        fluidImages.map(({ alt, image }, i) => (
                            <div
                                key={image.id}
                                style={{
                                    cursor: "pointer",
                                    height: galleryLayout.boxes[i].height,
                                    width: galleryLayout.boxes[i].width,
                                    marginBottom: GALLERY_CONFIG.boxSpacing,
                                }}
                            >
                                <GatsbyImage
                                    image={getImage(image)}
                                    alt={alt}
                                    loading={getImageLoadBehavior(width, i)}
                                />
                            </div>
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
            </SRLWrapper>
        </SimpleReactLightbox>
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
                            images: PropTypes.object,
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
