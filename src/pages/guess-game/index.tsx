import React, { useEffect, useState } from "react";
import { generateRandomNumber } from "@/services/game";

const GuessGame: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setRandomNumber(generateRandomNumber());
    setGuess("");
    setMessage("");
    setAttemptsLeft(10);
    setGameOver(false);
  };

  const checkGuess = () => {
    const numGuess = Number(guess);

    if (!numGuess || numGuess < 1 || numGuess > 100) {
      setMessage("⚠️ Vui lòng nhập số từ 1 đến 100!");
      return;
    }

    if (gameOver) return;

    const remaining = attemptsLeft - 1;
    setAttemptsLeft(remaining);

    if (numGuess < randomNumber) {
      setMessage("⬆️ Bạn đoán quá thấp!");
    } else if (numGuess > randomNumber) {
      setMessage("⬇️ Bạn đoán quá cao!");
    } else {
      setMessage("🎉 Chúc mừng! Bạn đã đoán đúng!");
      setGameOver(true);
      return;
    }

    if (remaining === 0) {
      setMessage(`❌ Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      setGameOver(true);
    }

    setGuess("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Game Đoán Số (1–100)</h1>
      <p>Bạn có 10 lượt đoán</p>

      <input
        type="number"
        value={guess}
        disabled={gameOver}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Nhập số..."
        style={{ padding: 8, fontSize: 16 }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={checkGuess} disabled={gameOver}>
          Đoán
        </button>
        <button onClick={startNewGame} style={{ marginLeft: 10 }}>
          Chơi lại
        </button>
      </div>

      <div style={{ marginTop: 20, fontWeight: "bold" }}>{message}</div>
      <div>Lượt còn lại: {attemptsLeft}</div>
    </div>
  );
};

export default GuessGame;
