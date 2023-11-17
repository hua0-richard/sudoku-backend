function emptySudoku() {
    let sudoku = [];
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            row.push(0);
        }
        sudoku.push(row);
    }
    return sudoku; 
}



