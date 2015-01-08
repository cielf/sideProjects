

Object.prototype.rotate = function (d) {
 
    var s = "rotate(" + d + "deg)";
    if (this.style) { // regular DOM Object
        this.style.MozTransform = s;
        this.style.WebkitTransform = s;
        this.style.OTransform = s;
        this.style.transform = s;
        this.style.transform
        this.style['webkitTransformOrigin'] = 0 + '% ' + 0 + '%';
        
        
    } else if (this.css) { // JQuery Object
        this.css("-moz-transform", s);
        this.css("-webkit-transform", s);
        this.css("-o-transform", s);
        this.css("transform", s);
    }
    this.setAttribute("rotation", d);
    this.setAttribute("display","inline-block");
};

 var getRGB = function(irrationalStrings){
  //TODO:  Argument checking
  index1 = Math.floor(Math.random(0, irrationalStrings.length));
  stringToUse = irrationalStrings[index1];
  red = Number(stringToUse.substr(2,4));
  green = Number(stringToUse.substr(5,7));
  blue = Number(stringToUse.substr(8,10));
  return [red,green,blue];
};

var getNextNonZeroIrrationalDigitPosition = function(irrationalStrings,currentIndices){
  console.log("gnnz: ");	
  var holder = 0;
  var newIndex1 = currentIndices[0];
  var newIndex2 = currentIndices[1];
  while(holder ===0){
    newIndex2=(newIndex2+1)%irrationalStrings[newIndex1].length;
    if(newIndex2===0){
      newIndex1 = (newIndex1+1)%irrationalStrings.length;
    }
    holder = irrationalStrings[newIndex1].charAt(newIndex2);
  }
  return [newIndex1, newIndex2];
};

function getAngle(numSectors, angleIncrement){

  return (Math.floor(Math.random()*numSectors)*angleIncrement);  
}

//Stanza -- high-level division of a snark.

function snarkStanza(firstDiv, givenText, irrationalStrings, doc, angleIncrement, leastX, leastY, maxX, maxY)
{
//TODO:  argument checking
  var rawText = givenText;
  var firstX=250;firstY=250;
  var nextX=firstX, nextY=firstY;


//Get a random irrational number string to start with  
//Divide the text into chunks, using the irrational number string set as a guide.

  irrationalIndex=  Math.floor(Math.random(0, irrationalStrings.length),0);
  var rgb = getRGB(irrationalStrings);
 /* var element = document.createTextNode(rawText);
  firstDiv.appendChild(element);*/
  var words = rawText.split(" ");
  console.log(words);
  allChunks = [];                                          
  var irrationalIndices = [irrationalIndex, 3];
  
  
  while(words.length > 0){
  	  console.log(words.length);
    //get the desired number of words for the next chunk
    
      irrationalIndices = getNextNonZeroIrrationalDigitPosition(irrationalStrings, irrationalIndices);
      numWords = irrationalStrings[irrationalIndices[0]].charAt(irrationalIndices[1]);
      var thisChunk = "";
           
      for(count = 0; count < numWords && words.length > 0; count++){
        thisChunk = thisChunk + " " + words.shift();
      }
      allChunks.push(thisChunk);
 
  }
   console.log(allChunks);
  //Determine initial position and angle
    
  
  
  
  var width = doc.width;
  var height = doc.height;
  var pos = [width/2, height/2];
  var numSectors = Math.floor(360/angleIncrement,0);
  var target = firstDiv;
 
  //add each chunk

  var chunkCount = 0;
  var chunkIntervalHandle = setInterval( function(){    
    angle = getAngle(numSectors, angleIncrement);
    console.log(angle);
    console.log(nextX+" "+nextY);		  
    var element = document.createElement("div");
    element.value="mydiv"+chunkCount;
    var t = document.createTextNode (allChunks[chunkCount]);
    element.appendChild(t);
    console.log(element);
    target.appendChild (element);
    console.log("rgb: ", rgb);
    element.style.position="absolute";
    element.style.left="0px";
    element.style.top="0px";
    element.style.fontSize="8px";
    element.style.color= 'red'; //(rgb[0], rgb[1], rgb[2]);
   // element.style.fontFamily = fontFamily;
    element.style.align="left";
    console.log(angle);

    var angleInRadians = angle * (Math.PI / 180);
    
    var unrotatedWidth = element.offsetWidth;
    var unrotatedHeight = element.offsetHeight;
    console.log("unrotated:  "+unrotatedWidth+" "+unrotatedHeight);
    element.style.left=nextX+"px";
    element.style.top=nextY+"px";
    for(;;)
    {
    	    element.rotate(angle);
    	    console.log(element);
    	    
    	    console.log("rotated:  "+rotatedWidth+" "+rotatedHeight);
    	    
    	    //get "bottom end" corner
    	    
    	    
    	    var rotatedWidth = element.offsetWidth;
    	    var rotatedHeight = element.offsetHeight;
    	    
    	    if(angle<90)
    	    {	nextX += rotatedWidth;
    	    	    nextY += rotatedHeight;    
    	    }
    	    else if(angle<180)
    	    {
    	    	    nextX -= rotatedWidth;
    	    	    nextY += rotatedHeight;  
    	    }
    	    else if (angle < 270)
    	    {
    	   	    nextX -= rotatedWidth;
    	    	    nextY -= rotatedHeight;  
    	    }
    	    else{
    	   	    nextX -= rotatedWidth;
    	    	    nextY += rotatedHeight;  
    	    }
    	    
    	 if(nextX >= leastX && nextX <= maxX && nextY>=leastY && nextY<=maxY)
    	 	 break;
    	 angle =  (angle + angleIncrement)%360;  //rotate clockwise
    }
    
    
    //next chunk will start at the "lower right corner" -- relative to text direction.   I'm not sure how to get that.
    //Obviously, this is not right.... just a step .. the plus 10 is for the font size

    /*
    var deltaX = Math.round(unrotatedWidth * Math.cos(angleInRadians));
    
    if(deltaX < 0){
    deltaX-=fontSize;
    }
    else{
    deltaX+=fontSize;
    }
    
    var deltaY = Math.round(unrotatedHeight * Math.sin(angleInRadians));
    if(deltaY < 0){
    deltaY-=fontSize;
    }
    else{
    deltaY+=fontSize;
    }
    
    nextX+= deltaX
    nextY+= deltaY;
    
    console.log(angle + angleInRadians+" "+deltaX+" "+deltaY);
    */
  
  
  console.log(nextX+" "+nextY);
  
  chunkCount++;
  if(chunkCount >= allChunks.length){
  	  clearInterval(chunkIntervalHandle);
  }
}, 1000);
}



//snark basic object -- only need one
function Snark(){
 
  var firstDiv =document.getElementById('firstDiv');
  

//the fractional part of some algebraic irrational numbers, used to govern colour, size of text chunks.

  var irrationalStrings = [
    "433012701892219323381861585376",
    "618033988749894848204586834366",
    "866025403784438646763723170753",
    "059463094359295264561825294946",
    "060660171779821286601266543157",
    "259921049894873164767210607278",
    "303577269034296391257099112153",
    "324717957244746025960908854478",
    "414213562373095048801688724210",
    "538841768587626701285145288018",
    "561552812808830274910704927987",
    "618033988749894848204586834366",
    "720477400588966922759011977389",
    "732050807568877293527446341506",
    "839286755214161132551852564653",
    "236067977499789696409173668731",
    "414213562373095048801688724210",
    "449489742783178098197284074706",
    "598076113533159402911695122588",
    "645751311064590590501615753639",
    "828427124746190097603377448419",
    "162277660168379331998893544433",
    "316624790355399849114932736671",
    "464101615137754587054892683012"];
 

   
    var textForSnark = [];

  textForSnark.push("'Twas brillig, and the slithy toves Did gyre and gimble in the wabe; All mimsy were the borogoves, And the mome raths outgrabe.");
  textForSnark.push("\"Beware the Jabberwock, my son! The jaws that bite, the claws that catch! Beware the Jubjub bird, and shun The frumious Bandersnatch!\"");
  textForSnark.push("He took his vorpal sword in hand: Long time the manxome foe he sought— So rested he by the Tumtum tree, And stood awhile in thought.");

  /*
  var textElement =document.createTextNode("Hi");
  currElement = firstDiv.appendChild(textElement);
  textElement =document.createTextNode(textForSnark[0]);
  currElement = firstDiv.appendChild(textElement);   
*/
  
 for(var count = 0; count< textForSnark.length; count++){
     var stanza = snarkStanza(firstDiv, textForSnark[count], irrationalStrings, document, 60, 10, 10, 750, 750);
  }
}
/*
requestAnimationFrame(Snark());
*/
  var snarky = new Snark();


  