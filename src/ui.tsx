import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ui.css";

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

  const onSort = () => {
    parent.postMessage({ pluginMessage: { type: "sortList" } }, "*");
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
      <ul>
        <li>
          <label>
            1.- Go to the{" "}
            <a
              target="_blank"
              href="https://www.figma.com/file/n3HQNNj6GdUvRbDNFPEPis/SHAPE-Icons-library?node-id=935%3A665"
            >
              source file
            </a>{" "}
            , select and <b>copy</b> the Frames:{" "}
            <b>
              General, Taste, Foods, Fabric care, Dish care, Wellbeing and Home
            </b>
            .
          </label>
        </li>
        <li>
          <label>
            2.- Go to the{" "}
            <a
              target="_blank"
              href="https://www.figma.com/file/ZXHsSTxSXkflS5FPjjDQM5/SHAPE-Icons-library?node-id=108%3A56"
            >
              sync file
            </a>{" "}
            (Page: input), <b>paste</b> the frames there. Click this button to
            generate the sync list.
          </label>
          <button className="brand" onClick={onList} type="button">
            →
          </button>
        </li>
        <li>
          <label>
            3.- <b>Cut</b> the group generated and <b>paste</b> it on the page
            below (Icons components v.x). Then click the button to compare the
            list with the last version
          </label>
          <button className="brand" onClick={onCompare} type="button">
            →
          </button>
        </li>
        <li>
          <label>
            4.- Review changes and publish the library. Ensure that new icons
            are enabled to be exported.
          </label>
        </li>
        <li>
          {" "}
          <label>
            5.- It is recommended to sort the list to keep the icons under
            alphabetical order
          </label>
          <button className="brand" onClick={onSort} type="button">
            →
          </button>
        </li>
      </ul>
      {preparingDiffData ? "Processing data" : ""}
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById("react-page"));
