var drawModule = (function () { 

   
    var bodySnake = function(x, y) {
        console.log(userColor);
        ctx.fillStyle = userColor;
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    }

    var drawOtherBodySnake = function(color, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }
  
    var pizza = function(x, y) {
          ctx.fillStyle = 'yellow';
          ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
          ctx.fillStyle = 'red';
          ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
    }
  
    var scoreText = function() {
      var score_text = "Score: " + score;
      ctx.fillStyle = 'blue';
      ctx.fillText(score_text, 145, h-5);
      $('#score').text("Score: " +score);

      database.ref('users').child(userKey).child('score').set(score );


    }
  
    var drawSnake = function() {
        var length = 4;
        snake = [];
        for (var i = length-1; i>=0; i--) {
            snake.push({x:i, y:0});
        }  
    }
      
    var paint = function(){
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, w, h);
  
        var btn = document.getElementById('start');
        btn.setAttribute('disabled', true);
  
        var snakeX = snake[0].x;
        var snakeY = snake[0].y;
  
        if (direction == 'right') { 
          snakeX++; }
        else if (direction == 'left') { 
          snakeX--; }
        else if (direction == 'up') { 
          snakeY--; 
        } else if(direction == 'down') { 
          snakeY++; }
  
        if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
            //restart game
            var btn = document.getElementById('start');
            btn.removeAttribute('disabled', true);
  
            ctx.clearRect(0,0,w,h);
            gameloop = clearInterval(gameloop);
            return;          
          }
          
          if(snakeX == food.x && snakeY == food.y) {
            var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
            score ++;
            
            createFood(); //Create new food
          } else {
            var tail = snake.pop(); //pops out the last cell
            tail.x = snakeX; 
            tail.y = snakeY;
          }
          //The snake can now eat the food.
          snake.unshift(tail); //puts back the tail as the first cell
  
          for(var i = 0; i < snake.length; i++) {
            bodySnake(snake[i].x, snake[i].y);
          } 
          
          savePosition(snake[0].x, snake[0].y);
          
          pizza(food.x, food.y); 
          scoreText();
          
    }
  
    var createFood = function() {
        food = {
          x: Math.floor((Math.random() * 30) + 1),
          y: Math.floor((Math.random() * 30) + 1)
        }
  
        for (var i=0; i>snake.length; i++) {
          var snakeX = snake[i].x;
          var snakeY = snake[i].y;
        
          if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
            food.x = Math.floor((Math.random() * 30) + 1);
            food.y = Math.floor((Math.random() * 30) + 1);
          }
        }
    }
  
    var checkCollision = function(x, y, array) {
        for(var i = 0; i < array.length; i++) {
          if(array[i].x === x && array[i].y === y)
          return true;
        } 
        return false;
    }
  
    var init = function(){
        direction = 'down';        
        drawSnake();
        drawOtherSnakes();
        createFood();

        firebase.auth().onAuthStateChanged(function(user){
            database.ref().child('users').orderByChild('name').equalTo(user.email).on("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    userKey = data.key;
                    userColor = data.val().color;
                })
            })
        });


        gameloop = setInterval(paint, 120);
    }

    var savePosition = function(x, y) {
       database.ref('users').child(userKey).child('position').set({ 'x' : x, 'y' : y } );
       
    }

    var drawOtherSnakes = function() {
        database.ref().child('users').on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var item = data.val();
                if (item.position !== undefined) {
                  drawOtherBodySnake(item.color, item.position.x, item.position.y)
                }
            });
        });
       
    }
  
  
      return {
        init : init
      };
  

      
  }());