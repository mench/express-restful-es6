import express from 'express';
import methodOverride from 'method-override';
import logger from 'morgan';

import restful from '../index';

var server = express();
server.use(logger('dev'));
server.use(methodOverride());
restful.configure(server,{
    dirname:__dirname+'/resources'
});


server.listen(8080);
