let Processor = require("./Processor");

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

if(window){
    window.AgamottoEye = AgamottoEye;
}

module.exports = AgamottoEye;