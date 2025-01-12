const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const tailwindcss = require('tailwindcss');

module.exports = (env, argv) => {
  const mode = env.NODE_ENV;
  const isProd = argv.mode === 'production';

  return {
    mode,
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProd ? 'js/[name].[contenthash].js' : 'js/[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.css', '.scss', '.svg'],
      alias: {
        '@svg': path.resolve(__dirname, 'src', 'img', 'svg'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
        {
          test: /\.(c|sa|sc)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-preset-env', tailwindcss],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext]',
          },
        },
        {
          test: /\.ico$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                {
                  tag: 'img',
                  attribute: 'data-src',
                  type: 'src',
                },
              ],
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
        new TerserPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.sharpMinify,
            options: {
              encodeOptions: {},
            },
          },
        }),
      ],
    },
    devServer: {
      port: 5001,
      open: true,
      hot: true,
      compress: true,
      static: {
        directory: path.join(__dirname, 'src'),
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        favicon: './assets/favicon.ico',
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? 'css/[name].[contenthash].css' : 'css/[name].css',
      }),
    ],
  };
};
