export default eventHandler((event) => {
  const sum = useSum(3, 5)

  return `server index, sum: ${sum}`
})
