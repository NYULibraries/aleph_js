var path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		application: './js/src/application.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].min.js',
	},
	devtool: isProduction || isStaging ? 'source-map' : 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		]
	},
	resolve: {
    alias: {
      'utils': path.resolve(__dirname, './js/src/lib/utils'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'utils': 'utils'
    })
  ]  
};