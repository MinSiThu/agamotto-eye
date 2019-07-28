let Pixel = require("./Pixel");
let Helper = require("../utils/pixel-helper");
let Kernels = require("../kernels");
let {ReLu} = require("../utils/math");

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
            Helper.pushPixelToArray(pixel.getIndexArray(),outputPixels)
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
            Helper.pushPixelToArray(pixel.getIndexArray(),outputPixels)
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
            Helper.pushPixelToArray(pixel.getIndexArray(),outputPixels)
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
                            let kernelWeight = kernel[matrixY*side+matrixX];
                            R += originalPixels[srcPixel] * kernelWeight;
                            G += originalPixels[srcPixel+1] * kernelWeight;
                            B += originalPixels[srcPixel+2] * kernelWeight;
                            A += originalPixels[srcPixel+3] * kernelWeight;
                        }
                    }
                }
                
                outputPixels[destPixel] = R;
                outputPixels[destPixel+1] = G;
                outputPixels[destPixel+2] = B;
                outputPixels[destPixel+3] = A +(255-A) ;
            }
        }
        this.pixels = new Uint8ClampedArray(outputPixels);
    }

    renderKernels(...kernels){
        kernels.forEach(kernel=>{
            this.renderKernel(kernel)
        })
    }

    extractRGBchannels(){
        let redChannel = [], greenChannel = [], blueChannel = [];
        for (let index = 0; index < this.pixels.length; index+=4) {
            redChannel.push(this.pixels[index]);
            greenChannel.push(this.pixels[index+1])
            blueChannel.push(this.pixels[index+2])
        }
        return {
            redChannel,greenChannel,blueChannel
        }
    }

    extractFeatures({filter=Kernels.edgeDetectorKernel,activationFunction=ReLu}){
        let channels = this.extractRGBchannels();
        
        //convolute
        let redChannel = Helper.applyKernelToChannel(channels.redChannel,filter);
        let greenChannel = Helper.applyKernelToChannel(channels.greenChannel,filter);
        let blueChannel = Helper.applyKernelToChannel(channels.blueChannel,filter);

        //relu
        redChannel = Helper.applyFunctionToChannel(redChannel,activationFunction);
        greenChannel = Helper.applyFunctionToChannel(greenChannel,activationFunction);
        blueChannel = Helper.applyFunctionToChannel(blueChannel,activationFunction);

        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);

        //second times
        redChannel = Helper.applyKernelToChannel(redChannel,filter);
        greenChannel = Helper.applyKernelToChannel(greenChannel,filter);
        blueChannel = Helper.applyKernelToChannel(blueChannel,filter);

        redChannel = Helper.applyFunctionToChannel(redChannel,activationFunction);
        greenChannel = Helper.applyFunctionToChannel(greenChannel,activationFunction);
        blueChannel = Helper.applyFunctionToChannel(blueChannel,activationFunction);

        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);
        
        //second time max pool
        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);

        //third time
        redChannel = Helper.applyKernelToChannel(redChannel,filter);
        greenChannel = Helper.applyKernelToChannel(greenChannel,filter);
        blueChannel = Helper.applyKernelToChannel(blueChannel,filter);

        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);

        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);

        redChannel = Helper.maxPool(redChannel);
        greenChannel = Helper.maxPool(greenChannel);
        blueChannel = Helper.maxPool(blueChannel);
        
        console.log(redChannel,greenChannel,blueChannel);
        
        
        return {redChannel,greenChannel,blueChannel}
    }
}

module.exports = PixelMaster;