let math = require("../utils/math");

class Pixel{
    constructor({redIndex,greenIndex,blueIndex,alphaIndex}){
        this.redIndex = redIndex;
        this.greenIndex = greenIndex;
        this.blueIndex = blueIndex;
        this.alphaIndex = alphaIndex;
    }

    getRedIndex(){
        return this.redIndex;
    }

    getGreenIndex(){
        return this.greenIndex;
    }

    getBlueIndex(){
        return this.blueIndex;
    }

    getAlphaIndex(){
        return this.alphaIndex;
    }

    getIndexArray(){
        return [this.redIndex,this.greenIndex,this.blueIndex,this.alphaIndex]
    }

    getResult(){
        let result;
        if(this.redIndex > this.greenIndex && this.redIndex > this.blueIndex){
            result = ( (0.7 * this.redIndex) + (0.4 * this.greenIndex) + (0.3 * this.blueIndex) + (0.1 * this.alphaIndex) )
        }else if(this.greenIndex > this.redIndex && this.greenIndex > this.blueIndex){
            result = ( (0.3 * this.redIndex) + (0.59 * this.greenIndex) + (0.2 * this.blueIndex) + (0.1*this.alphaIndex) )
        }else if(this.blueIndex > this.redIndex && this.blueIndex > this.greenIndex){
            result = ( (0.3 * this.redIndex) + (0.2 * this.greenIndex) + (0.55 * this.blueIndex)+ (0.1*this.alphaIndex) )
        }else{
            result = ( (0.35 * this.redIndex) + (0.35 * this.greenIndex) + (0.35 * this.blueIndex)+ (0.1*this.alphaIndex) )
        }
        return result;
    }

    toGrayScale(){
        let result = this.getResult();
        this.redIndex = this.greenIndex = this.blueIndex = result;
        this.alphaIndex = 225;
    }

    threshold(threshold){
        let result = this.getResult();
        let value = result>threshold?225:0;
        this.redIndex = this.greenIndex = this.blueIndex = value;
        this.alphaIndex = 225;
    }

    brighten(adjustment){
        this.redIndex = this.redIndex + adjustment;
        this.greenIndex = this.greenIndex + adjustment;
        this.blueIndex = this.blueIndex + adjustment;
    }
}

module.exports = Pixel;