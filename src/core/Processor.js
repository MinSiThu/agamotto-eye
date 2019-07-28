let Pixel = require("./Pixel");
let PixelMaster = require("./PixelMaster");

class Processor{
    constructor(image){
        this.canvas = document.createElement("canvas");
        this.image = image;
        this.canvas.width = this.WIDTH = image.width;
        this.canvas.height = this.HEIGHT = image.height;
        this.pixelMaster;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(image,0,0)
      }

      renderImage(pixelMaster){
        this.pixelMaster = pixelMaster;
        let pixels = pixelMaster.getPixels();        
        let imageData = new ImageData(pixels,this.WIDTH,this.HEIGHT);
        this.ctx.putImageData(imageData,0,0)
      }

      setDimensions(width,height){
        this.canvas.width = this.WIDTH = width;
        this.canvas.height = this.HEIGHT = height;
        this.ctx.drawImage(this.image,0,0,width,height)
      }
  
      getDataURL(){
          return this.canvas.toDataURL();
      }

      clearCanvas(){
          this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT)
      }

      getRedDataURL(){
          let {redChannel} = this.pixelMaster.extractRGBchannels();
          let imageData = new ImageData(new Uint8ClampedArray(redChannel),this.WIDTH/4);
          this.clearCanvas();
          this.ctx.putImageData(imageData,0,0);
          return this.getDataURL()
      }

      getGreenDataURL(){
        let {greenChannel} = this.pixelMaster.extractRGBchannels();
        let imageData = new ImageData(new Uint8ClampedArray(greenChannel),this.WIDTH/4);
        this.clearCanvas();
        this.ctx.putImageData(imageData,0,0);
        return this.getDataURL()
    }

    getBlueDataURL(){
        let {blueChannel} = this.pixelMaster.extractRGBchannels();
        let imageData = new ImageData(new Uint8ClampedArray(blueChannel),this.WIDTH/4);
        this.clearCanvas();
        this.ctx.putImageData(imageData,0,0);
        return this.getDataURL()
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