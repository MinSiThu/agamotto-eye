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

    renderKernel2(kernel){
            var side = Math.round(Math.sqrt(kernel.length));
            var halfSide = Math.floor(side/2);
            var src = this.pixels;
            var sw = this.originalWidth;
            var sh = pixels.originalHeight;
            // pad output by the convolution matrix
            var w = sw;
            var h = sh;
            var output = []
            var dst = output.data;
            // go through the destination image pixels
            var alphaFac = opaque ? 1 : 0;
            for (var y=0; y<h; y++) {
                for (var x=0; x<w; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y*w+x)*4;
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                var r=0, g=0, b=0, a=0;
                for (var cy=0; cy<side; cy++) {
                    for (var cx=0; cx<side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy*sw+scx)*4;
                        var wt = kernel[cy*side+cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff+1] * wt;
                        b += src[srcOff+2] * wt;
                        a += src[srcOff+3] * wt;
                    }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff+1] = g;
                dst[dstOff+2] = b;
                dst[dstOff+3] = a + alphaFac*(255-a);
                }
            }
            return output;
    }
}

module.exports = PixelMaster;