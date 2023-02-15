import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import React from "react"
import PropTypes from "prop-types"

import Seo from "../seo"
import Container from "../container/container"
import Header from "../header/header"

import {
    header,
    hero,
    heroWrapper,
    post,
    postDetail,
    postTitle,
} from "./style.scss"

/**
 * Get's the first post's image data to be used for the metadata image tags
 * when sharing on social media
 *
 * @param {List[object]} posts - list of objects that contain info about
 * each posts' image src, height, and width. Used for metadata images
 * @returns object containing src, height, and width attributes
 */
const getMetaImageFromPost = (posts) => {
    if (!posts.length) {
        return undefined
    }
    return posts[0].frontmatter.hero.childImageSharp.original
}

/**
 * Gets the loading behavior of the given image. Earlier images should be loaded
 * ASAP for a better user experience (reduce Largest Contentful Paint).
 * Both mobile and desktop will see at most 2 posts in the initial viewport, so
 * eager load them.
 * @param {int} i - index of the photo in the gallery. Used to determine whether
 * to eager load the image or not.
 * @returns string "eager" or "lazy" denoting to eager or lazy loading the image
 */
const getImageLoadBehavior = (i) => {
    return i < 2 ? "eager" : "lazy"
}

const CollectionPost = ({ frontmatter, fields, excerpt }, i) => {
    return (
        <article
            key={fields.slug}
            style={{ backgroundColor: frontmatter.backgroundColor }}
        >
            <Link to={fields.slug} className={post}>
                <div className={heroWrapper}>
                    <GatsbyImage
                        alt={frontmatter.heroAlt}
                        className={hero}
                        image={frontmatter.hero.childImageSharp.gatsbyImageData}
                        loading={getImageLoadBehavior(i)}
                    />
                </div>
                <header className={header}>
                    <small className={postDetail}>{frontmatter.location}</small>
                    <h2 className={postTitle}>{frontmatter.title}</h2>
                    <small className={postDetail}>{frontmatter.date}</small>
                </header>
            </Link>
        </article>
    )
}

CollectionPost.defaultProps = {
    excerpt: ``,
}

CollectionPost.propTypes = {
    frontmatter: PropTypes.shape({
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        location: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        hero: PropTypes.shape({
            childImageSharp: PropTypes.shape({
                gatsbyImageData: PropTypes.object.isRequired,
            }).isRequired,
        }).isRequired,
        heroAlt: PropTypes.string.isRequired,
    }).isRequired,
    fields: PropTypes.shape({
        slug: PropTypes.string.isRequired,
    }).isRequired,
    excerpt: PropTypes.string,
}

const Collection = ({ headerData, posts }) => {
    return (
        <Container>
            <Seo
                title={`${headerData.sectionTitle} ${headerData.title}`}
                description={headerData.description}
                keywords={[headerData.sectionTitle, headerData.title]}
                metaImage={getMetaImageFromPost(posts)}
            />
            <Header {...headerData} />
            {posts.map((post, i) => CollectionPost(post, i))}
        </Container>
    )
}

Collection.propTypes = {
    headerData: PropTypes.shape({
        description: PropTypes.string,
        sectionTitle: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            frontmatter: PropTypes.shape({
                hero: PropTypes.shape({
                    childImageSharp: PropTypes.shape({
                        gatsbyImageData: PropTypes.object.isRequired,
                        original: PropTypes.shape({
                            src: PropTypes.string,
                            height: PropTypes.number,
                            width: PropTypes.number,
                        }).isRequired,
                    }).isRequired,
                }).isRequired,
            }),
        })
    ).isRequired,
}

export default Collection
