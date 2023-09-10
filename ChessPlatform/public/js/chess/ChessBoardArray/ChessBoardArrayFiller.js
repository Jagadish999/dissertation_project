/*
This class returns two array:
1. chessBoardArray: Shows board accourding to fenPosition starting form 1st rank and 1st file 
2. pieceMoveDetectionArray: A board of 120 space represented for movement detection
*/
class ChessBoardArrayFiller{

    constructor(fenPosition){
        this.fenPosition = fenPosition;
    }

    //Returns board in array from 1st rank and 1st file reversing the fenPosition
    fillChessBoardArray(){
        let tempChessBoardArray = new Array(64);
        
        //Take all the pieces postions in each rank and reverse them
        let piecePositions = this.fenPosition.split(" ")[0];
        let reversedPiecePosition = piecePositions.split("/").reverse().join("/");

        //Place chess board pieces in tempChessBoardArray Accordig to fenPosition
        let counter = 0;
        for(let i = 0; i < 64; i++){
    
            let charEle = reversedPiecePosition[counter];
    
            if(charEle == '/'){
                counter++;
                charEle = reversedPiecePosition[counter];
            }
    
            if(charEle > 0){
                //place empty spaces
                for(let j = 1; j <= parseInt(charEle); j++){
                    tempChessBoardArray[i] = 0;
                    if(j != parseInt(charEle)){
                        i++;
                    }
                }
                counter++;
            }
            else{
                tempChessBoardArray[i] = charEle;
                counter++;
            }
        }
        return tempChessBoardArray;
    }

    fillPiecesMoveDetectionArray(chessBoardArray){

        let tempPiecesMoveDetection = new Array(120);

        for(let i = 0; i < tempPiecesMoveDetection.length; i++){
            tempPiecesMoveDetection[i] = 1;
        }
        for(let i = 0; i < chessBoardArray.length; i++){

            let tempSqPos = this.arrayIndexToSqNum(i + 1) - 1;
            tempPiecesMoveDetection[tempSqPos] = chessBoardArray[i];
        }

        return tempPiecesMoveDetection;
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