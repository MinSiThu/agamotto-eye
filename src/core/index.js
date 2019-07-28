let Processor = require("./Processor");
let Kernels = require("../kernels");
let {ReLu} = require("../utils/math");

class AgamottoEye{

    static async fromImageURL(url){
        return new Promise((resolve,reject)=>{
            let image = document.createElement("img");
            image.src = url;
            image.onload = function(){
                let processor = new Processor(image)
                resolve(processor)
            }
        })
    }
}

AgamottoEye.kernels = Kernels;
AgamottoEye.ReLu = ReLu;

if(window){
    window.AgamottoEye = AgamottoEye;
}

module.exports = AgamottoEye;