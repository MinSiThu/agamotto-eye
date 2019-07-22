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
        let pixels = pixelMaster.fromPixelsTo8Clamp();
        let imageData = new ImageData(pixels,this.WIDTH);
        this.ctx.putImageData(imageData,0,0)
      }
  
      getDataURL(){
          return this.canvas.toDataURL();
      }

      getPixelMaster(){
        return new PixelMaster(this.getPixels());
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
              pixels.push(
                  new Pixel({redIndex,greenIndex,blueIndex,alphaIndex})
              )
          }
          return pixels;
      }
}

module.exports = Processor;