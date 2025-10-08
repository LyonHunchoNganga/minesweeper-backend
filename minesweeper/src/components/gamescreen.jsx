import { useEffect, useState } from "react";
import Game from "./gamescreen/game"


function GameScreen(){
      const [secondsElapsed, setSecondsElapsed] = useState(0);
      const [isGameActive, setIsGameActive] = useState(false); 

  
      useEffect(() => {
        let timer;
        if (isGameActive) {
          timer = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
          }, 1000);
        }

   
        return () => clearInterval(timer);
      }, [isGameActive]);

 
      const startGame = () => {
        setSecondsElapsed(0);    
        setIsGameActive(true);    
    
      };

 
      const endGame = () => {
        setIsGameActive(false); 
      };


      return(
        <div className="game-box-container">
            <div className="game-box">
                <p>⏱️ Time: {secondsElapsed}s</p>
                <Game secondsElapsed={secondsElapsed} startGame={startGame} endGame={endGame}/>
            </div>
        </div>
    );
};

export default GameScreen;