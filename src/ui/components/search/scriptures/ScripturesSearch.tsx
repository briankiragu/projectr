import { type Component } from "solid-js";

// Import the interfaces.
import type { IQueueItem } from "@interfaces/queue";

// Import the components...
import ScripturesSearchForm from "@components/search/scriptures/ScripturesSearchForm";

const ScripturesSearch: Component<{
  enqueueHandler: (item: IQueueItem) => void;
}> = (props) => <ScripturesSearchForm enqueueHandler={props.enqueueHandler} />;

export default ScripturesSearch;
