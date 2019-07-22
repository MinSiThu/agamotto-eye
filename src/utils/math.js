let largestNumber = (arr)=>{
    let biggestNumber = 0;
    arr.forEach(element => {
        if(biggestNumber < element){
            biggestNumber = element
        }
    });
    return biggestNumber;
}

module.exports = {
    largestNumber,
}