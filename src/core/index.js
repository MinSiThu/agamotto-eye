class AgamottoEye{
    constructor(image){
      this.canvas = document.createElement("canvas");
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      
      this.ctx = this.canvas.getContext("2d");
      this.ctx.drawImage(image,0,0)
    }

    getDataURL(){
        return this.canvas.toDataURL();
    }

    getImageData(){
        return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    }

    getPixels(){
        let imageData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
        let pixels = [];
        for (let index = 0; index < imageData.length; index+=4) {
            let redIndex = imageData[index];
            let greenIndex = imageData[index+1];
            let blueIndex = imageData[index+2];
            let alphaIndex = imageData[index+3];
            pixels.push({
                redIndex,greenIndex,blueIndex,alphaIndex
            })
        }
        return pixels;
    }

    static async fromImageURL(url){
        return new Promise((resolve,reject)=>{
            let image = document.createElement("img");
            image.src = url;
            image.onload = function(){
                let processor = new AgamottoEye(image)
                resolve(processor)
            }
        })
    }
}

if(window){
    window.AgamottoEye = AgamottoEye;
}

module.exports = AgamottoEye;