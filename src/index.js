import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import requireAll from 'require-all';
import {Rest} from './handlers/rest';
import {middleware} from './handlers/rest';
import {routers} from './handlers/rest';

class Restful {
    configure(app,options:{dirname:String}){
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        requireAll({
            dirname     :  options.dirname,
            filter      :  /(.*)\.js$/,
            excludeDirs :  /^\.(git|svn)$/,
            recursive   : true
        });
        routers.forEach(router=>{app.use(router)});
    }
}

export {Rest};
export {middleware};
export default new Restful();