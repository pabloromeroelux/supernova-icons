import * as React from "react";
import * as ReactDOM from "react-dom";

declare function require(path: string): any;

function App() {
  const [preparingDiffData, setPreparingDiffData] = React.useState(false);
  React.useEffect(() => {
    onmessage = (event) => {
      setPreparingDiffData(false);
    };
  }, []);

  const onList = () => {
    parent.postMessage({ pluginMessage: { type: "list" } }, "*");
  };

  const onCompare = () => {
    parent.postMessage({ pluginMessage: { type: "compare" } }, "*");
    setPreparingDiffData(true);
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  return (
    <main>
      <button className="brand" onClick={onCompare}>
        Compare!
      </button>
      <button className="brand" onClick={onList}>
        List
      </button>
      {preparingDiffData ? "Processing data" : ""}
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
