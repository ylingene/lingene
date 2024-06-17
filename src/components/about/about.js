import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import PropTypes from "prop-types"

import Container from "../container/container"
import { BlueDot, RedDot } from "../dots/dots"
import Seo from "../seo"
import SocialLinks from "../social/social"
import { COLLECTIONS_PATH, PHOTOGRAPHY_PATH } from "../../utils/defs"

import {
    aboutMe,
    aboutSection,
    aboutWrapper,
    dot,
    header,
    headerLine,
    link,
    links,
    pictureWrapper,
    profilePicture,
    square,
    wrapper,
} from "./style.scss"

const Picture = ({ author, image }) => (
    <div className={square}>
        <GatsbyImage
            image={image}
            alt={author.name}
            className={profilePicture}
            loading="eager"
        />
    </div>
)

Picture.propTypes = {
    author: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    image: PropTypes.object.isRequired,
}

const AboutMe = () => (
    <div className={aboutMe}>
        <header className={header}>
            <h1>Lingene</h1>
            <div className={headerLine} />
        </header>
        <p>I'm an engineer and an artist.</p>
        <p>
            I'm currently a senior software engineer at Patreon in San Francisco, CA and was previously at Affirm.
            I graduated with a B.S.E. in Computer Science and Engineering from the University of Michigan in 2018.
        </p>
        <p>
            As an artist, I'm drawn to environments and nature. I capture them
            primarily through photographs, but I also enjoy exploring them
            through other art mediums.
        </p>
        <p>Connect with me:</p>
        <SocialLinks />
    </div>
)

const Works = () => (
    <div>
        <header className={header}>
            <h2>Check out my work</h2>
        </header>
        <div className={links}>
            <Link className={link} to={PHOTOGRAPHY_PATH}>
                Photo Gallery
                <BlueDot className={dot} />
            </Link>
            <Link className={link} to={COLLECTIONS_PATH}>
                Photo Collections
                <RedDot className={dot} />
            </Link>
        </div>
    </div>
)

const About = () => {
    const data = useStaticQuery(graphql`
        query ProfileQuery {
            profilePicture: file(absolutePath: { regex: "/lingene.jpg/" }) {
                childImageSharp {
                    gatsbyImageData(width: 300)
                    ...MetaImageFragment
                }
            }
            site {
                siteMetadata {
                    author {
                        name
                    }
                }
            }
        }
    `)

    const image = data.profilePicture.childImageSharp.gatsbyImageData
    const metaImage = data.profilePicture.childImageSharp.original
    const { author } = data.site.siteMetadata
    const keywords = [`software`, `engineer`, `Affirm`, `artist`]
    return (
        <Container className={wrapper}>
            <Seo keywords={keywords} metaImage={metaImage} />
            <div className={pictureWrapper}>
                <Picture author={author} image={image} />
            </div>
            <div className={aboutWrapper}>
                <div className={aboutSection}>
                    <AboutMe />
                    <Works />
                </div>
            </div>
        </Container>
    )
}

export default About
