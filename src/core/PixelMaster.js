class PixelMaster{
    constructor(pixels){
        this.pixels = pixels;
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
        this.pixels.forEach(pixel=>{
            return pixel.toGrayScale()
        })
    }
}

module.exports = PixelMaster;