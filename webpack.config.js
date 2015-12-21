var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        //'admin-index': ['./src/js/admin/index.js'],
        //'goodsType': ['./src/js/goodsType/goodsType.js'],
        //'admin-login': ['./src/js/admin/login.js'],
        ////'seller-goods-list':['./src/js/seller/goods.js'],
 	    ////'seller-order-list': ['./src/js/order/seller-order-list.js'],
 	  	//'phone-goods': ['./src/js/phone/goods.js'],
 	  	//'phone-order-comfirm': ['./src/js/phone/order-comfirm.js'],
        //'user-address-list':['./src/js/user/user.address.js'],
        //'user-addaddress':['./src/js/user/user.addaddress.js'],
        //'phone-index': ['./src/js/phone/index.js'],
        //'phone-shoppingcart': ['./src/js/phone/shoppingCart.js'],
        //'phone-order-list': ['./src/js/phone/order-list.js'],
        //'admin-goodstype': ['./src/js/admin/goodstype.js'],
        //'admin-orders':['./src/js/admin/orders.js'],
        //'admin-fare':['./src/js/admin/fare.js'],
        //'user-register': ['./src/js/user/register.js'],
        //'seller-list': ['./src/js/admin/seller.js'],
        //'user-list': ['./src/js/admin/user.js'],
        //'admin-form' : ['./src/js/admin/admin.js'],
        //'admin-account':['./src/js/admin/account.js'],
        //'admin-area':['./src/js/admin/Area.js'],
        //'admin-gooddetail':['./src/js/goods/detail.js'],
        //'phone-evaluation':['./src/js/phone/evaluation.js'],
        //'admin-evaluations':['./src/js/admin/evaluations.js'],
        //'admin-order-list':['./src/js/order/list.js'],
        //'admin-user-assign':['./src/js/admin/user-assign.js'],
        //'admin-goods-list':['./src/js/goods/list.js'],
        //'admin-goods-save': ['./src/js/goods/save.js'],
        'user-center': ['./src/js/user/user.js'],
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: '[name].js',
        publicPath: '/dist/',
        sourceMapFileName: '[file].map'
    },
    resolve: {
        root: [path.join(__dirname, "/src/bower_components")]
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            { test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z=0-9\.]+)?$/, loader : 'url-loader?limit=8192'},
            { test : /\.(png|gif|svg|jpg)$/, loader : 'url-loader?limit=8192'}
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ],
    devtool: 'source-map'
};