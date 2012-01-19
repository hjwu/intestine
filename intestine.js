var canvas = null;
var ctx = null; 
var canvasWidth = 640;  
var canvasHeight = 480;
var bodySize = 16;
var radius = bodySize/2;
var snakeInitLength = 3;
var snakeLength = snakeInitLength;
var snake = new Array(snakeLength);
var randomFoodIndex = 0;

function setBlock(x, y){ this.x = x; this.y = y;}
for (var i=0; i<snakeLength; i++) snake[i] = new setBlock(canvasWidth/2 + i*bodySize,canvasHeight/2);		

var foodLength = (canvasWidth/bodySize)*(canvasHeight/bodySize);				
var	food = new Array(foodLength);
var colorG = Math.ceil(255*Math.random());
var colorB = Math.ceil(255*Math.random());

var turnLeft = true; //default
var turnRight = false;
var turnUp = false;
var turnDown = false;
var ate = false;
var pause = true;
var dead = false;
var score = 0;
var timer = null;
var squirm = true;
var initial = true;
var fastSpeed = 30;
var normalSpeed = 50;
var slowSpeed = 100;
var speed = normalSpeed;

window.localStorage['SpeedLevel'] = "Speed : Normal";
window.localStorage['SpeedValue'] = 25;
function validFood(){
	for (var i=0; i<foodLength; i++) food[i] = new setBlock(bodySize * (i%(canvasWidth/bodySize)), bodySize * Math.floor(i/(canvasWidth/bodySize))); // reset food的位置

	for (var i=0; i<snakeLength; i++) // 移除不允許的位置
		for (var j=0; j<food.length; j++)
			if (snake[i].x == food[j].x && snake[i].y == food[j].y)
				food.splice(j,1);						
	randomFoodIndex = Math.floor(food.length*Math.random());
}

function changeSpeed(){ if (initial) window.localStorage['SpeedValue'] = document.getElementById('range').value; }


function drawSpeed(){
	canvas = document.getElementById("speed");
	ctx = canvas.getContext("2d");		
	ctx.fillStyle = 'purple';
	drawRCRectangle(ctx,0,0,200,50,10);

	if (initial){
		window.localStorage['SpeedValue'] = document.getElementById('range').value;
		if (window.localStorage['SpeedValue'] == 0) { speed = slowSpeed; window.localStorage['SpeedLevel'] = "Speed : Easy";}			
		else if (window.localStorage['SpeedValue'] == 25) { speed = normalSpeed;	window.localStorage['SpeedLevel'] = "Speed : Normal";}
		else if (window.localStorage['SpeedValue'] == 50) { speed = fastSpeed; window.localStorage['SpeedLevel'] = "Speed : Hard";}
	}
	
	ctx.fillStyle = 'gold';
    ctx.font = "25px Arial";
    ctx.fillText(window.localStorage['SpeedLevel'], 10, 35);
    
	clearInterval(timer);
	timer=setInterval(game,speed);	
}

function clear(){
	canvas = document.getElementById("SNAKE");
	ctx = canvas.getContext("2d");		
	ctx.fillStyle = 'silver';
	ctx.fillRect(0,0,canvasWidth,canvasHeight);

	ctx.fillStyle = 'black'; //清除因蠕動造成的殘影
	ctx.fillRect(0,canvasHeight,canvasWidth,canvasHeight+bodySize/4);						
}

function drawFood(){
	canvas = document.getElementById("SNAKE");
	ctx = canvas.getContext("2d");	

	if (dead || ate){ //renew or create new food
			validFood();					
			randomFoodIndex = Math.floor(food.length*Math.random());
			colorG = Math.ceil(255*Math.random());
			colorB = Math.ceil(255*Math.random());
	}

	ctx.save();
	ctx.fillStyle = "rgb(0,"+ colorG.toString() + "," + colorB.toString() + ")" ;
	ctx.beginPath();
	ctx.arc(food[randomFoodIndex].x+radius, food[randomFoodIndex].y+radius, radius, 0, 2*Math.PI, true);
	ctx.fill();
	ctx.restore();
}

function drawSnake(){					
	canvas = document.getElementById("SNAKE");
	ctx = canvas.getContext("2d");											
    if (dead){ //renew
    	snakeLength = snakeInitLength;
		for (var i=0; i<snakeLength; i++) snake[i] = new setBlock(canvasWidth/2 + i*bodySize,canvasHeight/2);
		turnLeft = true; 
		turnRight = false;
		turnUp = false;
		turnDown = false;				
		pause = true;								
		initial = true;
    }
    else{
	    initial = false;
		if (ate || !pause){ // snake grows up or moves			
			var tmp = null;
			if(turnRight) tmp = new setBlock(snake[0].x+bodySize, snake[0].y);
			else if(turnLeft) tmp = new setBlock(snake[0].x-bodySize, snake[0].y);
			else if(turnUp) tmp = new setBlock(snake[0].x, snake[0].y-bodySize);
			else if(turnDown) tmp = new setBlock(snake[0].x, snake[0].y+bodySize);
			snake.unshift(tmp);
			if (ate) snakeLength++;	
			else snake.pop();
		}
	}

	for (var i=0; i<snakeLength; i++){	
		if(snake[i].x>=canvasWidth) snake[i].x = 0;
		if(snake[i].x<0) snake[i].x = canvasWidth - bodySize;
		if(snake[i].y>=canvasHeight) snake[i].y = 0;
		if(snake[i].y<0) snake[i].y = canvasHeight - bodySize;
		
		
		//在原來腸子的中點加上會動的 block 造成視覺上有蠕動				
		if (i<snakeLength-1){
			if (snake[i].x == canvasWidth-bodySize && snake[i+1].x == 0 && snake[i].y == snake[i+1].y){}
			else if (snake[i+1].x == canvasWidth-bodySize && snake[i].x == 0 && snake[i].y == snake[i+1].y){}
			else if (snake[i].y == canvasHeight-bodySize && snake[i+1].y == 0 && snake[i].x == snake[i+1].x){}
			else if (snake[i+1].y == canvasHeight-bodySize && snake[i].y == 0 && snake[i].x == snake[i+1].x){}
			else{
		    	ctx.save();				
  				ctx.beginPath();
	       		if (squirm == true) ctx.translate(0,bodySize/4);
	       		else  ctx.translate(0, 0);
		   		ctx.fillStyle = "rgb(255,128,128)" ; 
		   		ctx.arc((snake[i].x+snake[i+1].x + bodySize)/2, (snake[i].y+snake[i+1].y+bodySize)/2, radius, 0, 2*Math.PI, true);				   						   		
				ctx.fill();
				ctx.restore();	
    		}
    	}
    	ctx.save();				
		ctx.beginPath();
	    if (i==0) {
			ctx.fillStyle = 'rgb(255,0,0)';	
			if(turnLeft) ctx.arc(snake[i].x+radius, snake[i].y+radius, radius, 3*Math.PI/4, 5*Math.PI/4, true);
			else if(turnRight) ctx.arc(snake[i].x+radius, snake[i].y+radius, radius, 7*Math.PI/4, Math.PI/4, true);
			else if(turnUp) ctx.arc(snake[i].x+radius, snake[i].y+radius, radius, 5*Math.PI/4, 7*Math.PI/4, true);
			else if(turnDown) ctx.arc(snake[i].x+radius, snake[i].y+radius, radius, Math.PI/4, 3*Math.PI/4, true);
			ctx.lineTo(snake[i].x+radius, snake[i].y+radius);
	    }			   
	    else { 		
	    	ctx.fillStyle = "rgb(255,128,128)";
	    	ctx.arc(snake[i].x+radius, snake[i].y+radius, radius, 0, 2*Math.PI, true);
	    }
		ctx.fill();
		ctx.restore();		       	
	}
	squirm = !squirm;
}

function ifAte(){
	if (snake[0].x == food[randomFoodIndex].x && snake[0].y == food[randomFoodIndex].y) ate = true;
	else ate = false;
}

function ifDead(){
	if (snakeLength > 3){		
		for (var i = 3; i<snakeLength; i++)	{
			if ((snake[i].x == snake[0].x && snake[i].y == snake[0].y)){
				dead = true;
				var level = null;
				if (speed == slowSpeed) level = "topEasy";
				else if (speed == normalSpeed) level = "topNormal";
				else if (speed == fastSpeed) level = "topHard";
				if (typeof window.localStorage[level] != 'undefined') window.localStorage[level] = Math.max(score, window.localStorage[level]);
				else window.localStorage[level] = score;				
				alert("GAME OVER");
				break;						
			}
		}
	}
	else dead = false;
}
					
function keydown(e) {		     
	 var temp = new Array(4);
	 temp[0] = turnRight;
	 temp[1] = turnLeft;
	 temp[2] = turnUp;
	 temp[3] = turnDown;
	 
	 turnRight = false;
     turnLeft = false;
	 turnUp = false;
     turnDown = false;
    
     if (e.keyCode == 37 && pause == false) turnLeft = true; 
	 else if (e.keyCode == 38 && pause == false) turnUp = true; 
	 else if (e.keyCode == 39 && pause == false) turnRight = true; 
     else if (e.keyCode == 40 && pause == false) turnDown = true; 
     else if ((e.keyCode == 13 || e.keyCode == 128)  && pause == false) { dead = true; 	init=true;}
     else {
        if (e.keyCode == 32) pause = !pause; 
		turnRight = temp[0];
		turnLeft = temp[1];
		turnUp = temp[2];
		turnDown = temp[3];
     }

		if (snake[0].x == snake[1].x){
			if (Math.abs(snake[0].y - snake[1].y) == bodySize) {//穿越造成的條件
				if ((snake[0].y > snake[1].y && turnUp) || (snake[1].y > snake[0].y && turnDown)){
					turnUp = !turnUp;
					turnDown = !turnDown;
				}
			}
			else { 
				if ((snake[0].y > snake[1].y && turnDown) || (snake[1].y > snake[0].y && turnUp)){
					turnUp = !turnUp;
					turnDown = !turnDown;
				}
			}
		}
		else if (snake[0].y == snake[1].y) {
			if (Math.abs(snake[0].x - snake[1].x) == bodySize){ //穿越造成的條件
				if ((snake[0].x > snake[1].x && turnLeft) || (snake[1].x > snake[0].x && turnRight)){
					turnLeft = !turnLeft;
					turnRight = !turnRight;
				}
			}
			else { 
				if ((snake[0].x > snake[1].x && turnRight) || (snake[1].x > snake[0].x && turnLeft)){
					turnLeft = !turnLeft;
					turnRight = !turnRight;
				}
			}
		}
}

function scoreRecord(){
	score = 10 * (snakeLength - snakeInitLength);
	canvas = document.getElementById("SCORE");
	ctx = canvas.getContext("2d");		
	ctx.fillStyle = 'orange';
	drawRCRectangle(ctx,0,0,200,50,15)
	ctx.fillStyle = 'blue';
	scoreText = "Score : "+ score.toString();	
    ctx.font = "30px Arial";
    ctx.fillText(scoreText, 8, 35);
	
	ctx.fillStyle = 'green';
	drawRCRectangle(ctx,0,70,200,250,15)
	ctx.fillStyle = 'pink';
	scoreText = "Best";	
    ctx.font = "50px Arial";
    ctx.fillText(scoreText, 50, 120);

	if (typeof window.localStorage['topEasy'] != 'undefined') scoreText = "Easy : " + window.localStorage['topEasy'].toString();
	else scoreText = "Easy : －－－－－";		    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(scoreText, 10, 160);
    
   	if (typeof window.localStorage['topNormal'] != 'undefined') scoreText = "Normal : " + window.localStorage['topNormal'].toString();
	else scoreText = "Normal : －－－－";	    
    ctx.fillStyle = "white";
    ctx.fillText(scoreText, 10, 220);
    
  	if (typeof window.localStorage['topHard'] != 'undefined') scoreText = "Hard : " + window.localStorage['topHard'].toString();
	else scoreText = "Hard : －－－－－";	    
    ctx.fillStyle = "white";
    ctx.fillText(scoreText, 10, 280);
}

function drawTitle(){	
	canvas = document.getElementById("title");
	ctx = canvas.getContext("2d");		
	ctx.fillStyle = 'red';
    ctx.font = "60px Arial";
    ctx.fillText("生きている腸", 300, 60);
}

var tmpCnt = 1;
function intro(){
	canvas = document.getElementById("SNAKE");
	ctx = canvas.getContext("2d");
	ctx.fillStyle="green";
	ctx.textBaseline = "top";
	if (initial){
		ctx.font = "40px Arial";
		ctx.fillText("[Arrow keys] : move", 120, 100);
		ctx.fillText("[Spacebar] : play/pause", 120, 200);
		ctx.fillText("[Return] : restart", 120, 300);
	}
	else if(pause){
		ctx.font = "50px Arial";
		ctx.fillText("PAUSE", 250, 200);
	}
}

function drawRCRectangle(ctx, x, y, width, height, radius){
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath()
	ctx.fill();
}
	      	      	      			            	     	
function game(){
		clear();
		if(pause) intro();
		else {
			drawFood();
			drawSnake();
			ifAte();
			ifDead();				
		}				
		drawSpeed();
		scoreRecord();
}    
      	      	
function init(){				
		document.addEventListener('keydown', keydown, false);	
		drawTitle();		
		validFood();	
		timer=setInterval(game,speed);
}
