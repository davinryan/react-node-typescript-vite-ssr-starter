import {useState} from 'react'

const Root = ({data}) => {
  const [count, setCount] = useState(0)

  return (
    <main>
      <h1>App</h1>
      <p data-testid={"myed-root-title-description"}>Lorem Ipsum</p>
      <div>
        <div>{count}</div>
        <button onClick={() => setCount(count + 1)}>Count</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  )
}

export {
  Root
};