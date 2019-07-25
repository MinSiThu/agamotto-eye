let Pixel = require("./Pixel");
let PixelMaster = require("./PixelMaster");

class Processor{
    constructor(image){
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.WIDTH = image.width;
        this.canvas.height = this.HEIGHT = image.height;
        
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(image,0,0)
      }

      renderImage(pixelMaster){
        let pixels = pixelMaster.getPixels();        
        let imageData = new ImageData(pixels,this.WIDTH,this.HEIGHT);
        this.ctx.putImageData(imageData,0,0)
      }
  
      getDataURL(){
          return this.canvas.toDataURL();
      }

      getPixelMaster(){
        return new PixelMaster(this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height));
      }
  
      getImageData(){
          return this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
      }
  
      getPixels(){
          let {data,width} = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
          let pixels = [];
          for (let index = 0; index < data.length; index+=4) {
              let redIndex = data[index];
              let greenIndex = data[index+1];
              let blueIndex = data[index+2];
              let alphaIndex = data[index+3];
              pixels.push(
                  new Pixel({redIndex,greenIndex,blueIndex,alphaIndex})
              )
          }
          return {pixels,width};
      }
}

module.exports = Processor;