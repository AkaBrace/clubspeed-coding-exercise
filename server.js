var g_oExpress     = require('express');
var g_oApplication = g_oExpress();

g_oApplication.get('/', function (g_oRequest, g_oResponse)
    {
        g_oResponse.send('Hello World!')
    }
);

g_oApplication.listen(3000, function ()
    {
        console.log('Club Speed application listening on port 3000!')
    }
);
