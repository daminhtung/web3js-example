export const loadContract = async (name) => {
  const res = await fetch(`/contracts/${name}.json`)
  const artifact = await res.json()

  return {
      contract: artifact
  }
}
