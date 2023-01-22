module.exports = {
    flags: {
        THE_FLAG: false
    },
    siteMetadata: {
        title: `Lingene Yang`,
        author: {
            name: `Lingene Yang`,
        },
        description: `Portfolio website of Lingene Yang. Software engineer and artist based in San Francisco, CA.`,
        keywords: [`Lingene`],
        siteUrl: `https://www.lingeneyang.com`,
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/collections`,
                name: `collections`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/assets`,
                name: `assets`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/images`,
                name: `images`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/galleries`,
                name: `galleries`,
            },
        },
        {
            resolve: `gatsby-transformer-yaml`,
            options: {
                typeName: `Yaml`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                    `gatsby-remark-smartypants`,
                ],
            },
        },
        `gatsby-plugin-image`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                useMozJpeg: false,
                stripMetadata: false,
                defaultQuality: 100,
                defaults: {
                    formats: [`auto`, `webp`],
                    placeholder: `none`,
                    quality: 100,
                },
            },
        },
        {
            // generates favicon for browser tabs
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Lingene Yang`,
                short_name: `Lingene`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#053854`,
                display: `minimal-ui`,
                icon: `content/assets/favicon.png`,
            },
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-sass`,
            options: {
                // Override the file regex for CSS modules
                sassRuleModulesTest: /style\.s(a|c)ss$/,
            },
        },
        {
            resolve: "gatsby-plugin-react-svg",
            options: {
                rule: {
                    include: /assets/,
                },
            },
        },
    ],
}
