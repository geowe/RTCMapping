const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    rtcmapping:'./src/main.js'//,
    //worker: './src/control/toolbar/worker/BufferWorker.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),    
    //publicPath: "/assets/", 
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {
              minimize: true,
              sourceMap: true
            }
          }
        ]
      },

      
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },

      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },

       {
        test: /\.worker\.js$/,
        use: [
          {
            loader: 'worker-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    },
    output: {
      comments: false
    }
  }),


    
    //new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({        
        template: 'index.template.ejs',
        inject: 'body'
      })
  ],
  
  devtool: 'inline-source-map',
  devServer: {
    //contentBase: path.join(__dirname, "dist"),
    //compress: true,
    inline: true,
    port: 9000
  }
};
