export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export function list() {
    let list = [];
    for (let i = 0; i < 81; i++) {
        let row = Math.floor(i / 9);
        let column = i % 9; 
        list.push({
            row: row,
            column: column
        });
    }
    return list; 
}

function random(a, b) {
    return 0;
}