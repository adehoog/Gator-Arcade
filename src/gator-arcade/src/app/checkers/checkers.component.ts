import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.scss']
})
export class CheckersComponent implements OnInit {
  board: any[] = [];

  selectedPiece: { row: number, col: number } | null = null;

  currentPlayer: 'red' | 'black' = 'red';

  clickedRow: number = -1;
  clickedCol: number = -1;

  constructor() { }

  ngOnInit(): void {
    for (let row = 0; row < 8; row++) {
      const currentRow: any[] = [];
      for (let col = 0; col < 8; col++) {
        currentRow.push({
          row,
          col,
          isDark: row % 2 === col % 2,
          piece: this.getPieceColor(row, col) ? { color: this.getPieceColor(row, col) } : null
        });
      }
      this.board.push(currentRow);
    }
  }

  getPieceColor(row: number, col: number): string | null {
    if (row < 3 && (row + col) % 2 === 1) {
      return 'black';
    }
    if (row > 4 && (row + col) % 2 === 1) {
      return 'red';
    }
    return null;
  }

  selectedSquare: { row: number, col: number } | null = null;

  onSquareClick(row: number, col: number) {
    console.log(`clicked on square: (${row}, ${col})`);
    this.clickedCol = col;
    this.clickedRow = row;
    const { selectedPiece, currentPlayer } = this;
    const pieceColor = selectedPiece ? this.getPieceColor(selectedPiece.row, selectedPiece.col) : null;
  
    // If no piece is currently selected, check if the clicked square has a piece of the current player's color
    if (!selectedPiece) {
      const piece = this.board[row][col].piece;
      console.log(`no piece currently selected`);
      if (piece && this.getPieceColor(row, col) === currentPlayer) {
        console.log(`selecting piece on (${row}, ${col})`);
        this.selectedPiece = { row, col };
      }
    }
    // If a piece is currently selected, check if the clicked square is a valid move target
    else {
      console.log(`piece already selected on (${selectedPiece.row}, ${selectedPiece.col})`);
      const isValidMove = this.isValidMove({ row, col });
      console.log(`valid move: ${isValidMove}`);
      if (isValidMove) {
        this.movePiece();
      } else if (this.getPieceColor(row, col) === currentPlayer) {
        console.log(`selecting piece on (${row}, ${col})`);
        this.selectedPiece = { row, col };
      }
    }
  }
  
    
  onPieceClick(row: number, col: number): void {
    const piece = this.board[row][col].piece;
    const pieceColor = this.getPieceColor(row, col);
  
    // Make sure the clicked piece is the current player's piece
    if (piece && pieceColor === this.currentPlayer) {
      this.selectedPiece = { row, col };
      this.selectedSquare = null;
    }
  }

// Returns true if the given move is valid, false otherwise
isValidMove(targetSquare: { row: number, col: number }): boolean {
  const { selectedPiece } = this;
  if (!selectedPiece) {
    return false;
  }

  const { row: sourceRow, col: sourceCol } = selectedPiece;
  const { row: targetRow, col: targetCol } = targetSquare;

  // Make sure the target square is a valid square on the board
  if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) {
    return false;
  }

  // Check if the target square is already occupied by another piece
  if (this.board[targetRow][targetCol].piece) {
    return false;
  }

  // Check if the move is a capture move
  const targetPiece = this.board[targetRow][targetCol].piece;
  if (Math.abs(targetRow - sourceRow) === 2 && Math.abs(targetCol - sourceCol) === 2) {
    const capturedPieceRow = (targetRow + sourceRow) / 2;
    const capturedPieceCol = (targetCol + sourceCol) / 2;
    const capturedPieceColor = this.getPieceColor(capturedPieceRow, capturedPieceCol);
    if (capturedPieceColor !== this.currentPlayer) {
      return false;
    }
    // If it's a valid capture move, return true
    return true;
  }

  // Check if the move is a valid non-capture move
  if (Math.abs(targetRow - sourceRow) === 1 && Math.abs(targetCol - sourceCol) === 1) {
    // Make sure the piece is moving forward if it's not a king
    const pieceColor = this.getPieceColor(sourceRow, sourceCol);
    if (pieceColor === 'red' && targetRow >= sourceRow) {
      return false;
    }
    if (pieceColor === 'black' && targetRow <= sourceRow) {
      return false;
    }
    // If it's a valid non-capture move, return true
    return true;
  }

  // Check if the move is a valid non-capture move for a king
  if (Math.abs(targetRow - sourceRow) === 1 && Math.abs(targetCol - sourceCol) === 1) {
    const piece = this.board[sourceRow][sourceCol].piece;
    if (piece && piece.isKing) {
      // If it's a valid non-capture move for a king, return true
      return true;
    }
  }

  // If none of the above conditions are met, the move is invalid
  return false;
}


isKing(row: number, col: number): boolean {
  const piece = this.board[row][col].piece;
  if (piece && piece.isKing) {
    return true;
  }
  return false;
}


getPieces(color: string): any[] {
  const pieces: any[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = this.board[row][col].piece;
      if (piece && piece.color === color) {
        pieces.push({ row, col });
      }
    }
  }
  return pieces;
}

hasCaptureMove(selectedPiece: { row: number, col: number }): boolean {
  const { row: sourceRow, col: sourceCol } = selectedPiece;
  const pieceColor = this.getPieceColor(sourceRow, sourceCol);
  const opponentColor = pieceColor === 'red' ? 'black' : 'red';
  const opponentPieces = this.getPieces(opponentColor);
  for (let i = 0; i < opponentPieces.length; i++) {
    const { row: opponentRow, col: opponentCol } = opponentPieces[i];
    if (Math.abs(opponentRow - sourceRow) === 2 && Math.abs(opponentCol - sourceCol) === 2) {
      const capturedPieceRow = (opponentRow + sourceRow) / 2;
      const capturedPieceCol = (opponentCol + sourceCol) / 2;
      if (!this.board[capturedPieceRow][capturedPieceCol].piece) {
        return true;
      }
    }
  }
  return false;
}

gameOver(winner: string): void {
  this.gameOver(this.currentPlayer);
  alert(`Game over! ${winner} wins!`);
}
  

// Moves the selected piece to the clicked square if it's a valid move
movePiece(): void {
  if (!this.selectedPiece) {
    return;
  }

  const { row: sourceRow, col: sourceCol } = this.selectedPiece;

  // Determine the target row and column based on the clicked square
  const targetRow = this.clickedRow;
  const targetCol = this.clickedCol;

  // Make sure the clicked square is a valid square on the board
  if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) {
    return;
  }

  // Make sure the move is valid
  if (!this.isValidMove({ row: targetRow, col: targetCol })) {
    return;
  }

  // Update the board with the new piece positions
  this.board[targetRow][targetCol].piece = this.board[sourceRow][sourceCol].piece;
  this.board[sourceRow][sourceCol].piece = null;

  // Check for a capture move
  if (Math.abs(targetRow - sourceRow) === 2 && Math.abs(targetCol - sourceCol) === 2) {
    const capturedPieceRow = (targetRow + sourceRow) / 2;
    const capturedPieceCol = (targetCol + sourceCol) / 2;
    this.board[capturedPieceRow][capturedPieceCol].piece = null;

    // Check if the current player has won the game
    const opponentColor = this.currentPlayer === 'red' ? 'black' : 'red';
    const opponentPieces = this.getPieces(opponentColor);
    if (opponentPieces.length === 0) {
      this.gameOver(this.currentPlayer);
      return;
    }

    // Check if the current player can make another capture move
    if (this.hasCaptureMove({ row: targetRow, col: targetCol })) {
      this.selectedPiece = { row: targetRow, col: targetCol };
      return;
    }
  }

  // Deselect the piece and switch to the other player's turn
  this.selectedPiece = null;
  this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
}

resetGame(): void {
  // Reset the board to its initial state
  this.board = [];
  for (let row = 0; row < 8; row++) {
    const currentRow: any[] = [];
    for (let col = 0; col < 8; col++) {
      currentRow.push({
        row,
        col,
        isDark: row % 2 === col % 2,
        piece: this.getPieceColor(row, col) ? { color: this.getPieceColor(row, col) } : null
      });
    }
    this.board.push(currentRow);
  }

  // Reset the game state variables
  this.selectedPiece = null;
  this.currentPlayer = 'red';
  this.clickedRow = -1;
  this.clickedCol = -1;
  this.selectedSquare = null;
}



}
