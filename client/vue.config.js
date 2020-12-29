const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

let isdev = process.env.NODE_ENV !== 'production';

let rules = [{
	test: /\.less$/,
	use: [
		'less-loader'
	]
}];

let plugins = [];
if (!isdev) {
	plugins.push(new CompressionPlugin());
	rules.push({
		test: /\.js$/,
		loader: 'webpack-remove-debug'
	});
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
				core : {
					test: /[\\/]node_modules[\\/](@core.*|core.*|@babel.*)[\\/]/,
					name: 'transpilers',
					enforce: true,
					priority: 30,
					chunks: 'all'
				},
				// all other initial vendors
				dependencies: {
					name: 'dependencies',
					test: /[\\/]node_modules[\\/].*[\\/]/,
					// maxSize: 50000,
					// minSize : 10000,
					priority: 10,
					enforce: true,
					reuseExistingChunk: true,
					chunks: 'all' // doesn't get created without 'all' here
				},
				// UI Components
				components: {
					test: /src[\\/]components[\\/].*[\\/].*/,
					name: 'components',
					enforce: true,
					priority: 20,
					reuseExistingChunk : true,
					chunks: 'all'
				},
				// Chat Components
				chat: {
					test: /[\\/]pages[\\/](User|Chats)[\\/].*/,
					name: 'Chats',
					enforce: true,
					priority: 80,
					reuseExistingChunk: true,
					chunks: 'all'
				},
				socket : {
					test: /[\\/]node_modules[\\/](socket|engine).*[\\/]/,
					name: 'socket-io',
					enforce: true,
					priority: 80,
					chunks: 'all'
				}
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
			removeEmptyChunks : true
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
			rules
		}
	}
}