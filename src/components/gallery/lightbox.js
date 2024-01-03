import { getImage } from "gatsby-plugin-image"
import PhotoSwipeLightbox from "photoswipe/lightbox"

const PHOTOSWIPE_OPTIONS = {
    zoom: false,
    counter: false,
    bgOpacity: 0.95,
    showHideAnimationType: "fade",
    imageClickAction: "next",
    tapAction: "next",
    showAnimationDuration: 0,
    hideAnimationDuration: 200,
    paddingFn: (viewportSize, itemData, index) => {
        // Have top & bottom lightbox padding on smaller screens.
        // Called often, so must be performant
        const padding = viewportSize.x < 800 ? 24 : 48
        return {
            top: padding,
            bottom: padding,
            left: 0,
            right: 0,
        }
    },
}

export const GALLERY_ID = "pswp-gallery"

/**
 * Gets the necessary data for Photoswipe from the corresponding image
 *
 * @param {string} alt - alt text for the image
 * @param {object} image - Gatsby Image object
 * @returns object of props to be passed into the Photoswipe child link elements
 */
export const getLightboxData = (alt, image) => {
    const gatsbyImage = getImage(image)
    return {
        href: gatsbyImage.images.fallback.src,
        "data-pswp-height": gatsbyImage.height,
        "data-pswp-width": gatsbyImage.width,
        "data-pswp-srcset": gatsbyImage.images.fallback.srcSet,
        "data-pswp-webp-src": gatsbyImage.images.sources[0].srcSet,
        "data-pswp-alt": alt,
    }
}

/**
 * To be called in a React hook for initialization and clean up.
 *
 * @returns function for lightbox clean up when component unmounts
 */
const initializeLightbox = () => {
    let lightbox = new PhotoSwipeLightbox({
        gallery: "#" + GALLERY_ID, // id of the parent container
        children: "a", // child pswp elements within parent container
        ...PHOTOSWIPE_OPTIONS,
        pswpModule: () => import("photoswipe"),
    })

    /*
    // commenting out since showAnimationDuration: 0, so no placeholder will be shown.
    // there's a problem with stretching of placeholder and lightbox image when loading.
    // issue: https://github.com/dimsemenov/PhotoSwipe/issues/1966

    // update msrc, the source of the thumbnail placeholder, when opening the lightbox
    lightbox.addFilter("domItemData", (itemData, element, linkEl) => {
        // Use the currently presented image url (srcset) for the thumbnail placeholder when
        // transitioning and loading in the larger image. As a fallback, use the extracted
        // smallest image in the srcset. Photoswipe doesn't fetch the correct img in
        // GatsbyImage. See photoswipe/src/js/core/base.js thumbnailEl
        // https://github.com/dimsemenov/PhotoSwipe/blob/beb4810b17e90b8b01a8331974b4c66169cd23a5/src/js/core/base.js#L157-L164
        const imageEl = linkEl.querySelector("picture img")
        const backupSrc = itemData.srcset.split(",")[0].split(" ")[0]
        itemData.msrc = imageEl.currentSrc || backupSrc
        return itemData
    })
    */

    // add custom attributes to pswp data
    lightbox.addFilter("itemData", (itemData, index) => {
        itemData.webpSrc = itemData.element.dataset.pswpWebpSrc
        itemData.alt = itemData.element.dataset.pswpAlt
        return itemData
    })

    // use <picture> instead of <img> for webp images
    lightbox.on("contentLoadImage", (e) => {
        const { content } = e

        // prevent to stop the default behavior
        e.preventDefault()

        // create most broadly compatible html for webp images
        content.pictureElement = document.createElement("picture")

        const sourceWebp = document.createElement("source")
        sourceWebp.srcset = content.data.webpSrc
        sourceWebp.type = "image/webp"

        const sourceJpg = document.createElement("source")
        sourceJpg.srcset = content.data.srcset
        sourceJpg.type = "image/jpeg"

        content.element = document.createElement("img")
        content.element.src = content.data.src
        content.element.setAttribute("alt", content.data.alt)
        content.element.className = "pswp__img"

        content.pictureElement.appendChild(sourceWebp)
        content.pictureElement.appendChild(sourceJpg)
        content.pictureElement.appendChild(content.element)

        // call this since it's skipped when not doing default behavior
        // https://github.com/dimsemenov/PhotoSwipe/blob/beb4810b17e90b8b01a8331974b4c66169cd23a5/src/js/slide/content.js#L130
        content.updateSrcsetSizes()

        content.state = "loading"

        if (content.element.complete) {
            content.onLoaded()
        } else {
            content.element.onload = () => {
                content.onLoaded()
            }

            content.element.onerror = () => {
                content.onError()
            }
        }
    })

    // by default PhotoSwipe appends <img>, but we want to append <picture>
    lightbox.on("contentAppendImage", (e) => {
        const { content } = e
        if (content.pictureElement && !content.pictureElement.parentNode) {
            e.preventDefault()

            /**
             * when using compatible webp html, pswp often doesn't display image correctly due
             * to the image width not being set. For these cases, use the sizes attribute that
             * is the appropriately sized width to be displayed. See updateSrcsetSizes method:
             * 
             * https://github.com/dimsemenov/PhotoSwipe/blob/beb4810b17e90b8b01a8331974b4c66169cd23a5/src/js/slide/content.js#L304-L310
             * issue: https://github.com/dimsemenov/PhotoSwipe/issues/2005
             * 
             * update 2024/01/02: a workaround "fix" was merged in but it introduces constant
             * flickering of images even though they've been loaded
             * PR: https://github.com/dimsemenov/PhotoSwipe/pull/2024
             */
            if (!content.element.style.width) {
                content.element.style.width = content.element.sizes
                content.element.style.height = "auto"
            }

            content.slide.container.appendChild(content.pictureElement)
        }
    })

    // for next/prev navigation with <picture>
    // by default PhotoSwipe removes <img>,
    // but we want to remove <picture>
    lightbox.on('contentRemove', (e) => {
        const { content } = e;
        if (content.pictureElement && content.pictureElement.parentNode) {
            e.preventDefault();
            content.pictureElement.remove();
        }
    });

    // managing the lightbox
    lightbox.init()
    return () => {
        lightbox.destroy()
        lightbox = null
    }
}

export default initializeLightbox
