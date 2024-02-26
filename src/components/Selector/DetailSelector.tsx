import { useEffect } from "react";
import { generatePath, getElementValueFromPath } from "~Helpers/ElementActions";
import { useViewStore } from "~components/MainFrameContainer";
import { useTemplateStore } from "~components/Template/Template";
import { Views, type PathStep, IdType, type PageElementType } from "~types";
import { useHoverElementStore } from "./HoverSelector";
import { create } from "zustand";

interface PageElementState {
	currentPageElement: PageElementType;
	setCurrentPageElement: (element: PageElementType) => void;
}

export const usePageElementStore = create<PageElementState>()((set) => ({
	currentPageElement: {} as PageElementType,
	setCurrentPageElement: (element) => {
		set({ currentPageElement: element });
	},
}));

function DetailSelector() {
	const { currentPageElement, setCurrentPageElement } = usePageElementStore();
	const { changeView } = useViewStore();
	const { currentTemplate, setCurrentTemplate } = useTemplateStore();
	const { hoveredElement, setHoveredElement } = useHoverElementStore();

	const selectElement = async () => {
		if (!currentPageElement.element) return;
		const generatedPath = generatePath(currentPageElement.element);
		const valueFromPath = getElementValueFromPath(generatedPath, document);

		const newPageElement: PageElementType = {
			path: generatedPath,
			value: valueFromPath,
		};

		const { pageElements, ...rest } = { ...currentTemplate };
		if (pageElements) {
			pageElements.push(newPageElement);
			setCurrentTemplate({ pageElements, ...rest });
		} else setCurrentTemplate({ pageElements: [newPageElement], ...rest });

		changeView(Views.Template.View);
	};

	useEffect(() => {
		console.log("element", currentPageElement.element);
	}, [currentPageElement]);

	return (
		<div>
			<div>{currentPageElement.key}</div>
			<div>
				{currentPageElement.path?.map((path, i) => {
					return <div key={i}>{path.type}</div>;
				})}
			</div>
			<button onClick={selectElement}>Select</button>
			<button onClick={() => changeView(Views.Selection.Hover)}>
				back
			</button>
		</div>
	);
}

export default DetailSelector;
