"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PartyPopper } from "lucide-react"

const Square = ({ value, onClick, isWinning }: { value: string | null; onClick: () => void; isWinning: boolean }) => (
  <div className="aspect-square relative">
    <button
      className={`w-full h-full text-9xl font-bold bg-gray-800 border-4 ${
        isWinning ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "border-gray-600"
      } hover:bg-gray-700 transition-colors flex items-center justify-center`}
      onClick={onClick}
    >
      <span
        className={
          value === "X"
            ? "text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            : value === "O"
              ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]"
              : ""
        }
      >
        {value}
      </span>
    </button>
  </div>
)

const Board = ({
  squares,
  onClick,
  winningLine,
}: { squares: (string | null)[]; onClick: (i: number) => void; winningLine: number[] | null }) => (
  <div className="grid grid-cols-3 gap-4 w-full h-full max-w-[90vmin] max-h-[90vmin] aspect-square">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} isWinning={winningLine?.includes(i) || false} />
    ))}
  </div>
)

const WinnerModal = ({
  winner,
  onPlayAgain,
  isOpen,
}: {
  winner: string
  onPlayAgain: () => void
  isOpen: boolean
}) => (
  <Dialog open={isOpen}>
    <DialogContent className="sm:max-w-md bg-yellow-300 border-0">
      <div className="flex flex-col items-center gap-6 py-8">
        <PartyPopper className="h-16 w-16 text-red-500" />
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2JrY2lvNXBzOWR4Ymdvd3g2aWR6Ymdham93NTVvNXcxeGJpbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif"
          alt="Celebrating cat"
          className="rounded-lg max-w-[200px]"
        />
        <h2 className="text-4xl font-bold text-center text-gray-900">
          {winner === "Draw" ? "¡Es un empate!" : `¡${winner} es el ganador!`}
        </h2>
        <Button onClick={onPlayAgain} className="bg-blue-600 hover:bg-blue-700 text-xl px-8 py-6">
          Jugar de nuevo
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

const calculateWinner = (squares: (string | null)[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }
    }
  }
  return null
}

export default function TicTacToe() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winInfo, setWinInfo] = useState<{ winner: string; line: number[] } | null>(null)

  useEffect(() => {
    const result = calculateWinner(squares)
    if (result) {
      setWinInfo(result)
    } else if (squares.every((square) => square !== null)) {
      setWinInfo({ winner: "Draw", line: [] })
    }
  }, [squares])

  const handleClick = (i: number) => {
    if (winInfo || squares[i]) return
    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? "X" : "O"
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setWinInfo(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Board squares={squares} onClick={handleClick} winningLine={winInfo?.line || null} />
      <WinnerModal winner={winInfo?.winner || ""} onPlayAgain={resetGame} isOpen={!!winInfo} />
    </div>
  )
}

