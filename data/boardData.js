const boardTiles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  name: `Tile ${i}`,
  type: i === 0 ? 'GO' : i === 30 ? 'Go to Jail' : 'Property',
}));

export default boardTiles;
