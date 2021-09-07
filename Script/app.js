const playerFactory = (name, marker) => {
    let score = 0;
    const getScore = () => score;
    const addScore = () => ++score;
    const resetScore = () => { score = 0 };
    return { name, marker, getScore, addScore, resetScore }
}

const player = playerFactory('TestPlayer', 'X');
const computer = playerFactory('TestComputer', 'O');