// Color Blast!
// License MIT
// © 2014 Nate Wiley

(function(window){

    var Game = {
    
        init: function(){
            this.c = document.getElementById("game");
            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(20,20,20,.7)";
            this.bullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.particles = [];
            this.bulletIndex = 0;
            this.enemyBulletIndex = 0;
            this.enemyIndex = 0;
            this.particleIndex = 0;
            this.maxParticles = 10;
            this.maxEnemies = 6;
            this.enemiesAlive = 0;
            this.currentFrame = 0;
            this.maxLives = 3;
            this.life = 0;
            this.binding();
            this.player = new Player();
            this.score = 0;
            this.paused = false;
            this.shooting = false;
            this.oneShot = false;
            this.lastShotFrame = -100;
            this.isGameOver = false;

            this.fps = 50;
            this.fpsInterval = 1000 / this.fps;
            this.then = Date.now();
         this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            for(var i = 0; i<this.maxEnemies; i++){
                new Enemy();
                this.enemiesAlive++;
            }
            this.invincibleMode(2000);

            setTimeout(function(){
                Game.pause();
                Game.gameOver();
            }, 120*1000);
    
            this.loop();
        },
    
        binding: function(){
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
            window.addEventListener("keypress", this.keyPressed);
            this.c.addEventListener("click", this.clicked);
        },
    
        clicked: function(){
            if(!Game.paused) {
                Game.pause();
            } else {
                if(Game.isGameOver){
                } else {
                    Game.unPause();
                    Game.loop();
                }
            }
        },
    
        buttonUp: function(e){
            if(e.keyCode === 32){
                Game.shooting = false;              
            e.preventDefault();
            }
            if(e.keyCode === 37 || e.keyCode === 65){
                Game.player.movingLeft = false;
            }
            if(e.keyCode === 39 || e.keyCode === 68){
                Game.player.movingRight = false;
            }
        },
    
        buttonDown: function(e){
            if(e.keyCode === 32){
                Game.shooting = true;
                Game.oneShot = true;
            }
            if(e.keyCode === 37 || e.keyCode === 65){
                Game.player.movingLeft = true;
            }
            if(e.keyCode === 39 || e.keyCode === 68){
                Game.player.movingRight = true;
            }
        },
    
        random: function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
      },
    
      invincibleMode: function(s){
          this.player.invincible = true;
          setTimeout(function(){
              Game.player.invincible = false;
          }, s);
      },
    
        collision: function(a, b){
            return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
            )
        },
        collisionr: function(a, b){//funkcja sprawdzajaca czy moze nastapic kolizja z prawej strony klocka gracza
            return (
            
            
             ((a.x) <= (b.x+b.width+20)) || ((b.y+b.height)>=((a.y+a.height ) >= (b.y-20)) || (b.x)>=(a.x) >= (b.x+b.width+20) ))
             
            
        },
        
        collisionl: function(a, b){//funkcja sprawdzajaca czy moze nastapic kolizja z lewej strony klocka gracza
            return (
            
            ((a.x) >= (b.x-b.width-20))) || ((b.y+b.height)>=((a.y+a.height ) >= (b.y-20)) || (b.x)<=(a.x) <= (b.x-b.width-20) )
              
        },
        
        collision2: function(a, b){ //funkcja sprawdzajaca czy moze klocek wrog znajdzie sie nad klockiem gracza 
            return (((a.x+a.width+10)<b.x)||((a.x+a.width+10)>(b.x)))
        },
        
        closest:function(a,b,i){ // funkcja zwracajaca indeks najblizszego pocisku
            c=b.y;
            d=Math.sqrt((b.y-a.y)**2+(b.x-a.x)**2);
            if(d<c){
                c=d;
                min=i;
            }
            return min
        },
        
      clear: function(){
          this.ctx.fillStyle = Game.color;
          this.ctx.fillRect(0, 0, this.c.width, this.c.height);
      },
       
      pause: function(){
            this.paused = true;
      },
    
      unPause: function(){
            this.paused = false;
      },
    
    
      gameOver: function(){
          this.isGameOver = true;
          this.clear();
          var message = "Game Over";
          var message2 = "Score: " + Game.score;
          var message3 = "Click or press Spacebar to Play Again";
          this.pause();
          this.ctx.fillStyle = "white";
          this.ctx.font = "bold 30px Lato, sans-serif";
          this.ctx.fillText(message, this.c.width/2 - this.ctx.measureText(message).width/2, this.c.height/2 - 50);
          this.ctx.fillText(message2, this.c.width/2 - this.ctx.measureText(message2).width/2, this.c.height/2 - 5);
          this.ctx.font = "bold 16px Lato, sans-serif";
          this.ctx.fillText(message3, this.c.width/2 - this.ctx.measureText(message3).width/2, this.c.height/2 + 30);
      },
    
      updateScore: function(){
          this.ctx.fillStyle = "white";
          this.ctx.font = "16px Lato, sans-serif";
          this.ctx.fillText("Score: " + this.score, 8, 20);
          this.ctx.fillText("Lives: " + (this.maxLives - this.life), 8, 40);
      },
      
        loop: function(){

            Game.requestAnimationFrame.call(window, Game.loop);

            now = Date.now();
            elapsed = now - Game.then;

            if (elapsed > Game.fpsInterval) {
                Game.then = now - (elapsed % Game.fpsInterval);

                Game.currentFrame += 1;

                if(!Game.paused){
                    Game.clear();
                    for(var i in Game.enemies){
                        var currentEnemy = Game.enemies[i];
                        currentEnemy.draw();
                        currentEnemy.update();
                        if(Game.currentFrame % currentEnemy.shootingSpeed === 0){
                            currentEnemy.shoot();
                        }
                    }
                    for(var x in Game.enemyBullets){
                        Game.enemyBullets[x].draw();
                        Game.enemyBullets[x].update();
                    }
                    for(var z in Game.bullets){
                        Game.bullets[z].draw();
                        Game.bullets[z].update();
                    }
                   
                    Game.player.draw();
        
                for(var i in Game.particles){
                  Game.particles[i].draw();
                }
                    Game.player.update();
                    Game.updateScore();                    
                }
            }
            
        }
    
    };
    
    
    
    
    
    
    var Player = function(){
        this.width = 60;
        this.height = 20;
        this.x = Game.c.width/2 - this.width/2;
        this.y = Game.c.height - this.height;
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 8;
        this.invincible = false;
        this.color = "white";
    };
    
    
    Player.prototype.die = function(){
        if(Game.life < Game.maxLives){
            Game.invincibleMode(2000);  
             Game.life++;
        } else {
            Game.pause();
            Game.gameOver();
        }
    };
    
    
    Player.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;

        if(Game.player.invincible && Game.currentFrame % 20 !== 0){
            Game.ctx.fillStyle = "red";
        }
        
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    
    Player.prototype.update = function(){
        if(true){
            this.movingRight=true;
            Game.shooting=true;
            if(this.movingLeft && this.x > 0 ){
                this.movingRight=false;
                this.x -= this.speed;
            }else{
                this.movingRight=true;
            }
            if(this.movingRight && this.x + this.width < Game.c.width){
                this.x += this.speed;
                this.movingLeft=false;
            }else{
                this.movingLeft=true;
            }
            if(( Game.currentFrame % 50 === 0) || (Game.currentFrame - Game.lastShotFrame > 50 &&  Game.oneShot)){
                this.shoot();
                Game.oneShot = false;
                Game.lastShotFrame = Game.currentFrame;
            }
        }
        for(var i in Game.enemies){
            if(Game.collision2(Game.enemies, this) && !Game.player.invincible){ //jesli jest nad klockiem to stzelaj
                Game.oneShot = true;
            }
        }
        for(var i in Game.enemyBullets){
            var currentBullet = Game.enemyBullets[i];
            var min=Game.closest(currentBullet,this,i);
            if(Game.collision(currentBullet, this) && !Game.player.invincible){
                this.die();
                delete Game.enemyBullets[i];
            }
            if(Game.collisionr(Game.enemyBullets[min], this) && !Game.player.invincible  && this.movingRight){ //jesli mozliwa kolizja z prawej to zacznij poruszac sie w lewo
                this.movingRight = false;
                this.movingLeft = true;
            }
            if(Game.collisionl(Game.enemyBullets[min], this) && !Game.player.invincible  && this.movingLeft){//jesli mozliwa kolizja z lewej to zacznij poruszac sie w prawo
                this.movingRight = right;
                this.movingLeft = false;
            }
        }
        
        
    };
    
    
    Player.prototype.shoot = function(){
        Game.bullets[Game.bulletIndex] = new Bullet(this.x + this.width/2);
        Game.bulletIndex++;
    };
    
    
    
    
    
    
    var Bullet = function(x){  
        this.width = 8;
        this.height = 20;
        this.x = x;
        this.y = Game.c.height - 10;
        this.vy = 8;
        this.index = Game.bulletIndex;
        this.active = true;
        this.color = "white";
        
    };
    
    
    Bullet.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    
    Bullet.prototype.update = function(){
        this.y -= this.vy;
        if(this.y < 0){
            delete Game.bullets[this.index];
        }
    };
    
    
    
    
    
    
    var Enemy = function(){
        this.width = 60;
        this.height = 20;
        this.x = Game.random(0, (Game.c.width - this.width));
        this.y = Game.random(10, 40);
        this.vy = Game.random(1, 3) * .1;
        this.index = Game.enemyIndex;
        Game.enemies[Game.enemyIndex] = this;
        Game.enemyIndex++;
        this.speed = Game.random(2, 3);
        this.shootingSpeed = Game.random(30, 80);
        this.movingLeft = Math.random() < 0.5 ? true : false;
        this.color = "hsl("+ Game.random(0, 360) +", 60%, 50%)";
        
    };
    
    
    Enemy.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    
    Enemy.prototype.update = function(){
        if(this.movingLeft){
            if(this.x > 0){
                this.x -= this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = false;
            }
        } else {
            if(this.x + this.width < Game.c.width){
                this.x += this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = true;
            }
        }
        
        for(var i in Game.bullets){
            var currentBullet = Game.bullets[i];
            if(Game.collision(currentBullet, this)){
                this.die();
                delete Game.bullets[i];
            }
        } 
    };
    
    Enemy.prototype.die = function(){
      this.explode();
      delete Game.enemies[this.index];
      Game.score += 15;
      Game.enemiesAlive = Game.enemiesAlive > 1 ? Game.enemiesAlive - 1 : 0;
      if(Game.enemiesAlive < Game.maxEnemies){
          Game.enemiesAlive++;
          setTimeout(function(){
              new Enemy();
          }, 2000);
        }
      
    };
    
    Enemy.prototype.explode = function(){
        for(var i=0; i<Game.maxParticles; i++){
        new Particle(this.x + this.width/2, this.y, this.color);
      }
    };
    
    Enemy.prototype.shoot = function(){
        new EnemyBullet(this.x + this.width/2, this.y, this.color);
    };
    
    var EnemyBullet = function(x, y, color){
        this.width = 8;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.vy = 6;
        this.color = color;
        this.index = Game.enemyBulletIndex;
        Game.enemyBullets[Game.enemyBulletIndex] = this;
        Game.enemyBulletIndex++;
    };
    
    EnemyBullet.prototype.draw = function(){
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    EnemyBullet.prototype.update = function(){
        this.y += this.vy;
        if(this.y > Game.c.height){
            delete Game.enemyBullets[this.index];
        }
    };
    
    
    
    
    var Particle = function(x, y, color){
        this.x = x;
        this.y = y;
        this.vx = Game.random(-5, 5);
        this.vy = Game.random(-5, 5);
        this.color = color || "orange";
        Game.particles[Game.particleIndex] = this;
        this.id = Game.particleIndex;
        Game.particleIndex++;
        this.life = 0;
        this.gravity = .05;
        this.size = 40;
        this.maxlife = 100;
      }
    
      Particle.prototype.draw = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.size *= .89;
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.life++;
        if(this.life >= this.maxlife){
          delete Game.particles[this.id];
        }
      };
    
    Game.init();
    
    
    }(window));