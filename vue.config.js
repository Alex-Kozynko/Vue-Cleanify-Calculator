module.exports = {
	"css": {
		"loaderOptions": {
			css: {
				"sourceMap": true
			},
            scss: {
				"sourceMap": true,
				prependData: '@import "~@/scss/pxTOvw";@import "~@/scss/variables";'
			}
		}
	}
}
