import { graphql } from "gatsby"

/**
 * Gatsby image fragment sub-class with custom image options. To be used for displaying
 * most images.
 *
 * Recommend loading smaller image sizes to the browser because the constrained
 * Gatsby images will never span the full screen on sizes larger than mobile.
 *
 * (min-width: 400px) 50vw, 100vw -> if screen >= 400px image size is 50vw, else 100vw
 *
 * See
 *   - Gatsby blog: https://www.gatsbyjs.com/blog/meet-new-gatsby-image/
 *   - Mozilla: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes
 */
export const imageFragment = graphql`
    fragment ImageFragment on ImageSharp {
        gatsbyImageData(sizes: "(min-width: 400px) 50vw, 100vw")
    }
`
/**
 * Used by components to provide image information (typically one image) so that social
 * media platforms can render them when sharing links.
 */
export const metaImageFragment = graphql`
    fragment MetaImageFragment on ImageSharp {
        original {
            src
            height
            width
        }
    }
`

/**
 * Used by components to render a image gallery, which provides information like imageFragment
 * and MetaImageFragment for each image in the gallery. Each gallery is defined in a yaml file.
 */
export const galleryImageFragment = graphql`
    fragment GalleryImageFragment on Yaml {
        alt
        type
        image {
            id
            childImageSharp {
                ...ImageFragment
                ...MetaImageFragment
            }
        }
    }
`
