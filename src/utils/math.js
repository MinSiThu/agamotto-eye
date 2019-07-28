let largestNumber = (arr)=>{
    let biggestNumber = 0;
    arr.forEach(element => {
        if(biggestNumber < element){
            biggestNumber = element
        }
    });
    return biggestNumber;
}

let ReLu = (value)=>{
    if(value > 0){
        return value
    }
    return 0;
}

module.exports = {
    largestNumber,
    ReLu,
}