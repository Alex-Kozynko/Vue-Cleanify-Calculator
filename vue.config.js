module.exports = {
	"css": {
		"loaderOptions": {
			css: {
				"sourceMap": true
			},
            scss: {
				"sourceMap": true,
				prependData: '@import "~@/scss/variables";'
			}
		}
	},
	publicPath: '/'
}
