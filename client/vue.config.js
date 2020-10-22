const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

let isdev = process.env.NODE_ENV !== 'production';
let plugins = [];
if (!isdev) {
	plugins.push(new CompressionPlugin());
}
module.exports = {
    outputDir : '../server/public',
	lintOnSave : false,
    devServer : {
        proxy : {
            '/api' : {
                target : 'http://localhost:5000/'
            }
        }
	},

	chainWebpack : config => {
		config.optimization.delete('splitChunks');
		config.optimization.set('splitChunks', {
			cacheGroups: {
				// Vue modules
				vue: {
					test: /[\\/]node_modules[\\/](@vue.*|vue.*)[\\/]/,
					name: 'vue',
					enforce: true,
					priority: 20,
					chunks: 'initial'
				},
				// all other vendors
				// vendors: {
				// 	name: 'chunk-vendors',
				// 	test(module, chunks) {
				// 		// `module.resource` contains the absolute path of the file on disk.
				// 		// Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
				// 		return module.resource &&
				// 			!module.resource.includes(`${path.sep}node_modules${path.sep}@vue`) &&
				// 			!module.resource.includes(`${path.sep}node_modules${path.sep}vue`) &&
				// 			!module.resource.includes(`${path.sep}src${path.sep}`)
				// 	},
				// 	maxSize: 150000,
				// 	minSize : 100000,
				// 	priority: 10,
				// 	enforce: true,
				// 	reuseExistingChunk: true,
				// 	chunks: 'all' // doesn't get created without 'all' here
				// },
				// // default common chunk settings from Vue
				// common: {
				// 	name: 'chunk-common',
				// 	minChunks: 5,
				// 	priority: 5,
				// 	chunks: 'initial',
				// 	reuseExistingChunk: true
				// }
			}
		})
	},

    configureWebpack: {
		optimization: {
			minimizer: [new TerserPlugin({
				terserOptions: {
					output: {
						comments: false
					}
				}
			})],
			// splitChunks : isdev ? {} : {
			// 	cacheGroups : {
			// 		default : {
			// 			reuseExistingChunk: true
			// 		}
			// 	}
			// }
		},
		output: {
			filename: isdev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
			chunkFilename: isdev ? 'js/[name].js' : 'js/[name].[chunkhash].js'
		},
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.js'
			},
			extensions: ['*', '.js', '.vue', '.json']
		},
		plugins,
		module: {
			rules: [{
				test: /\.less$/,
				use: [
					'less-loader'
				]
			}]
		}
	}
}