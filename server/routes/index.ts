export default eventHandler((event) => {
  const sum = useSum(1, 2)

  return `server index, sum: ${sum}`
})
