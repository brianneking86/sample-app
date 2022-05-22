import './App.css';

import { sampleString, markdownParser } from "./markdownParser";

function App() {
  const htmlString = markdownParser(sampleString);

  return (
    <div className="App">
      <div dangerouslySetInnerHTML={{__html: htmlString}} />

      <div>Raw string: {htmlString}</div>
    </div>
  );
}

export default App;
