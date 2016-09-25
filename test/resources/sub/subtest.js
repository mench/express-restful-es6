import {Rest,middleware} from '../../../index';

@Rest('/sub/test')
class HomeResource {

    get(){
        return this.send("hello");
    }
}