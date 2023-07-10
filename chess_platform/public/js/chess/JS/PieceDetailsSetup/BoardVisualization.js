class BoardVisualization{

    constructor(currentFenPosition){
        this.currentFenPosition = currentFenPosition;
    }

    setOrgChessBrd(){
        let tempOrgChessBrd = new Array(64);
        //revers the board position from fen position
        const reversedFenPos = this.currentFenPosition.split(" ")[0].split("").reverse().join("");

        let counter = 0;
        for(let i = 0; i < 64; i++){
    
            let charEle = reversedFenPos[counter];
    
            if(charEle == '/'){
                counter++;
                charEle = reversedFenPos[counter];
            }
    
            if(charEle > 0){
                //place empty spaces
                for(let j = 1; j <= parseInt(charEle); j++){
                    tempOrgChessBrd[i] = 0;
                    if(j != parseInt(charEle)){
                        i++;
                    }
                }
                counter++;
            }
            else{
                tempOrgChessBrd[i] = charEle;
                counter++;
            }
        }
        return tempOrgChessBrd;
    }

    setMoveChessBrd(orgChessBrd){

        let tempMoveChessBrd = new Array(120);

        for(let i = 0; i < tempMoveChessBrd.length; i++){
    
            tempMoveChessBrd[i] = 1;
        }
    
        for(let i = 0; i < 64; i++){
    
            let tempSqPos = this.arrayIndexToSqNum(i + 1) - 1;
            tempMoveChessBrd[tempSqPos] = orgChessBrd[i];
        }

        return tempMoveChessBrd;
    }
    arrayIndexToSqNum(num){

        let tempChar;
    
        if(num >= 1 && num <= 8){
            tempChar = 0;
        }
        else if(num >= 9 && num <= 16){
            tempChar = 2;
        }
        else if(num >= 17 && num <= 24){
            tempChar = 4;
        }
        else if(num >= 25 && num <= 32){
            tempChar = 6;
        }
        else if(num >= 33 && num <= 40){
            tempChar = 8;
        }
        else if(num >= 41 && num <= 48){
            tempChar = 10;
        }
        else if(num >= 49 && num <= 56){
            tempChar = 12;
        }
        else if(num >= 57 && num <= 64){
            tempChar = 14;
        }
    
        return (21 + num + tempChar);
    }
}