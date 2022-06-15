const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  // Динамическое название файлов (+хеш для продакшн версии)
  const filename = (ext) =>
    isProd ? `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`

  // Плагины, вынесенные в функцию
  const plugins = () => {
    const base = [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css')
      })
    ]

    return base
  }

  return {
    target: 'web', // чтобы параметр hot в DevServer работал
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: ['./index.js'] // относительный путь (папка src)
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // папка
      clean: true, // очищение папки dist перед сохранением
      filename: filename('js')// текущим названием будет main
    },
    resolve: {
      // '../path/file.js'
      // '../path/file'
      extensions: ['.js'],
      // '../../path/file'
      // '@/path/file'
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', 'core')
      }
    },
    devServer: {
      port: 3000,
      open: true,
      hot: true
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    // Описание лоадеров (loaders)
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Выносит css отдельно от html файла
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        },
      ],
    },
  }
}