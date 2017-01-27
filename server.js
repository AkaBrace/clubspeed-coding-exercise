var g_oApplication;
var g_oExpress;
var g_oBodyParser;
var g_oMethodOverride;
var g_oMongoose;
var g_oMongooseRestify;
var g_oRouter;

g_oBodyParser      = require('body-parser');
g_oExpress         = require('express');
g_oMongooseRestify = require('express-restify-mongoose');
g_oMethodOverride  = require('method-override');
g_oMongoose        = require('mongoose');

// Init middleware at application level
require('dotenv').config();

// Init the framework
g_oApplication = g_oExpress();

// Init a Router instance
g_oRouter = g_oExpress.Router();

g_oApplication.use(g_oBodyParser.json());
g_oApplication.use(g_oMethodOverride());

// Make DB connection to Mongo using env var
g_oMongoose.connect(process.env.APP_CONFIG_MONGO_HOST);

g_oMongooseRestify.serve(g_oRouter,
    g_oMongoose.model('event',
        new g_oMongoose.Schema(
            {
                name: {type: String, required: true},

                time: {type: Number, required: true}
            }
        )
    )
);

g_oApplication.use(g_oRouter);

g_oApplication.listen(3000, function ()
    {
        console.log('Club Speed application listening on port 3000!')
    }
);
