import store from "../store";

let crypto = require("crypto");
const Common = {
    crypt: function(plane='', crypt_type){

        var planeText = plane;
        var passowrd = process.env.CRYPT_KEY;
        var algorithm = process.env.CRYPT_ALGORITHM;

        var encrypt = (text) => {
            var cipher = crypto.createCipher(algorithm,passowrd)
            var crypted = cipher.update(text,'utf8','base64')
            crypted += cipher.final('base64');
            return crypted;
        }

        var decrypt = (text) => {
            var decipher = crypto.createDecipher(algorithm,passowrd)
            var dec = decipher.update(text,'base64','utf8')
            dec += decipher.final('utf8');
            return dec;
        }

        if(crypt_type == 1){
            return encrypt(planeText)
        }
        if(crypt_type == 2){
            return decrypt(planeText)
        }
        return encrypt(planeText)
    },
    isEmpty: function(val){

    if ( !val ) {//null or undefined or ''(空文字) or 0 or false

        if ( val !== 0 && val !== false ) {
            return true;
        }

    }else if( typeof val == "object"){//array or object

        return Object.keys(val).length === 0;

    }

    return false;//値は空ではない
    }
}

export default Common
