let pushPixelToArray = (indexs,array)=>{
    indexs.forEach(index=>{
        array.push(index)
    })
}

let applyKernelToChannel = (channel,filter)=>{
    let width = 28,height = 28;
    let filterSide = Math.sqrt(filter.length);
    let filterHalfSide = Math.floor(filterSide/2)
    
    let outputChannel = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let destPosition = (y*width)+x;

            let newValue= 0;
            for (let matrixY= 0; matrixY < filterSide; matrixY++) {
                for (let matrixX = 0; matrixX < filterSide; matrixX++) {
                    let matrixPosition = (matrixY*filterSide+matrixX);
                    
                    let filterAreaX = x + matrixX - filterHalfSide;
                    let filterAreaY = y + matrixY - filterHalfSide;
                    if(filterAreaX > 0 && filterAreaX < width && filterAreaY > 0 && filterAreaY < height){
                        let weight = filter[matrixPosition];
                        let channelPosition = (filterAreaY*y+filterAreaX);
                        newValue += channel[channelPosition]*weight; 
                    }
                }
            }
            outputChannel.push(newValue);
        }
    }
    return new Uint8ClampedArray(outputChannel)
}

module.exports = {
    pushPixelToArray,
    applyKernelToChannel,
}