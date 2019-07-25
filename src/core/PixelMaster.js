let Pixel = require("./Pixel");

class PixelMaster{
    constructor({data,width,height}){
        this.pixels = data;
        this.originalWidth = width;
        this.originalHeight = height;
    }

    fromPixelsTo8Clamp(){
        let pixels = [];
        for (let index = 0; index < this.pixels.length; index++) {
            const pixel = this.pixels[index];
            pixels.push(pixel.redIndex);
            pixels.push(pixel.greenIndex);
            pixels.push(pixel.blueIndex);
            pixels.push(pixel.alphaIndex);
        }
        return new Uint8ClampedArray(pixels)
    }

    getPixels(){
        return this.pixels;
    }

    toGrayScale(){
        let outputPixels = [];
        for (let index = 0; index < this.pixels.length; index+=4) {
            let pixel = new Pixel({
                            redIndex:this.pixels[index],
                            greenIndex:this.pixels[index+1],
                            blueIndex:this.pixels[index+2],
                            alphaIndex:this.pixels[index+3]
                        })
            pixel.toGrayScale()
            outputPixels.push(pixel.getRedIndex());
            outputPixels.push(pixel.getGreenIndex());
            outputPixels.push(pixel.getBlueIndex());
            outputPixels.push(pixel.getAlphaIndex());
        }
        this.pixels = new Uint8ClampedArray(outputPixels);
    }

    brighten(adjustment=80){
        let outputPixels = [];
        for (let index = 0; index < this.pixels.length; index+=4) {
            let pixel = new Pixel({
                            redIndex:this.pixels[index],
                            greenIndex:this.pixels[index+1],
                            blueIndex:this.pixels[index+2],
                            alphaIndex:this.pixels[index+3]
                        })
            pixel.brighten(adjustment)
            outputPixels.push(pixel.getRedIndex());
            outputPixels.push(pixel.getGreenIndex());
            outputPixels.push(pixel.getBlueIndex());
            outputPixels.push(pixel.getAlphaIndex());
        }
        this.pixels = new Uint8ClampedArray(outputPixels);
    }

    threshold(threshold=100){
        let outputPixels = [];
        for (let index = 0; index < this.pixels.length; index+=4) {
            let pixel = new Pixel({
                            redIndex:this.pixels[index],
                            greenIndex:this.pixels[index+1],
                            blueIndex:this.pixels[index+2],
                            alphaIndex:this.pixels[index+3]
                        })
            pixel.threshold(threshold)
            outputPixels.push(pixel.getRedIndex());
            outputPixels.push(pixel.getGreenIndex());
            outputPixels.push(pixel.getBlueIndex());
            outputPixels.push(pixel.getAlphaIndex());
        }
        this.pixels = new Uint8ClampedArray(outputPixels);
    }

    renderKernel(kernel){
        let side = Math.round(Math.sqrt(kernel.length));
        let halfSide = Math.floor(side/2);

        let originalPixels = this.pixels;
        let outputPixels = [];
        for (let y = 0; y < this.originalHeight; y++) {
            for (let x = 0; x < this.originalWidth; x++) {
                console.log("reached here");
                let currentX = x;
                let currentY = y;
                let destPixel = (y*this.originalWidth+x)*4;

                let R=0,G=0,B=0,A=0;
                for (let matrixY = 0; matrixY < side; matrixY++) {
                    for (let matrixX = 0; matrixX < side; matrixX++) {
                        let currentPixelSideY = currentY + matrixY - halfSide;
                        let currentPixelSideX = currentX + matrixX - halfSide;
                        if(currentPixelSideX > 0 && currentPixelSideX < this.originalWidth && currentPixelSideY > 0 && currentPixelSideY < this.originalHeight){
                            let srcPixel = (currentPixelSideY*this.originalWidth+currentPixelSideX)*4;
                            let kernelValue = (matrixY*side+matrixX);
                            R += originalPixels[srcPixel] * kernelValue;
                            G += originalPixels[srcPixel+1] * kernelValue;
                            B += originalPixels[srcPixel+2] * kernelValue;
                            A += originalPixels[srcPixel+3] * kernelValue;
                        }
                    }
                }
                
                
                outputPixels[destPixel] = R;
                outputPixels[destPixel+1] = G;
                outputPixels[destPixel+2] = B;
                outputPixels[destPixel+3] = A;
            }
        }
        //console.log(outputPixels);
        
        this.pixels = outputPixels;
        console.log(this.pixels);
        
    }
}

module.exports = PixelMaster;