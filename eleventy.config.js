import ejsPlugin from "@11ty/eleventy-plugin-ejs";

export default function (eleventyConfig) {
    // Add the EJS plugin
	eleventyConfig.addPlugin(ejsPlugin);

    // Copy static assests (optional)
    eleventyConfig.addPassthroughCopy("src/assets");

    // Uncomment the next code to allow changes to reserved data property names
    // (was using 'content' unsuccessfully to try and automatically inject the partial as content)
    // eleventyConfig.setFreezeReservedData(false);

    // Configure input/output directories
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            date: "_data",
        },
        templateFormats: ["ejs"]
    };
};