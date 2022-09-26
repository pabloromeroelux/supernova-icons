figma.showUI(__html__, { themeColors: true, height: 300 });

const generateList = () => {
  let i = 0;
  let x = 0;
  let y = 0;
  let increment = 50;
  const sortedGroups = figma.currentPage.children
    .map((c) => c)
    .sort((a, b) => a.name.localeCompare(b.name));

  const group: ComponentNode[] = [];

  sortedGroups.forEach((comp) => {
    const compSetCaitegory = comp.name;
    const rootNode = comp as GroupNode;
    const components = rootNode
      .findAllWithCriteria({
        types: ["COMPONENT_SET"],
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    components.forEach((compSet) => {
      compSet.children.forEach((c) => {
        const newComponent = (c as ComponentNode).clone();
        group.push(newComponent);

        // e.g: Size=24, Stroke=1.5, Style=Outline => Size 24 Stroke 1.5 Outline
        const path = c.name
          .replace(/=/g, "_")
          .replace(/\s/g, "")
          .replace(/Style_/g, "")
          .replace(/_/g, " ")
          .split(",")
          .join(" ");

        newComponent.name = `${compSetCaitegory}/${c.parent?.name} - ${path}`;

        newComponent.x = x;
        newComponent.y = y;
        i++;
        x = i % 10 === 0 ? 0 : x + increment;
        y = i % 10 === 0 ? y + increment : y;
      });
    });
    const iconsGroup = figma.group(group, figma.currentPage);
    iconsGroup.name = "update";
    figma.currentPage.selection = [iconsGroup];
    comp.remove();
  });
};

const getListData = (list: GroupNode) => {
  const map = new Map();
  list.children.forEach((item) => {
    const iconComponent = item as ComponentNode;
    const iconVector = iconComponent.findOne(
      (n) => n.type === "VECTOR"
    ) as VectorNode;
    map.set(iconComponent.name, iconVector);
  });
  return map;
};

const grabDiffData = () => {
  const update = getListData(figma.currentPage.children[1] as GroupNode);
  const current = getListData(figma.currentPage.children[0] as GroupNode);
  const currentValues = new Map();
  current.forEach((value, key) => {
    currentValues.set(JSON.stringify(value.vectorNetwork), value);
  });
  figma.ui.postMessage({ pluginMessage: { type: "hola" } });
  compare(update, current, currentValues);
};

const compare = (
  update: Map<string, VectorNode>,
  current: Map<string, VectorNode>,
  currentValues: Map<string, VectorNode>
) => {
  update.forEach((value, key) => {
    const matchByName = current.get(key);
    // content update
    if (matchByName) {
      if (
        JSON.stringify(value.vectorNetwork) !==
        JSON.stringify(matchByName.vectorNetwork)
      ) {
        matchByName.vectorNetwork = value.vectorNetwork;
      }
    }

    const updateValueString = JSON.stringify(value.vectorNetwork);
    const valueMatch = currentValues.get(updateValueString);
    if (!matchByName && valueMatch) {
      valueMatch.parent.name = value.parent.name;
    }
    if (!matchByName && !valueMatch) {
      const currentIconsGroup = figma.currentPage.children[0] as GroupNode;
      const newIcon: SceneNode = value.parent as SceneNode;
      currentIconsGroup.appendChild(newIcon);
    }
  });
  // remove input list
  figma.currentPage.children[1].remove();
};

const sortList = () => {
  const currentIconsGroup = figma.currentPage.children[0] as GroupNode;
  let x = 0;
  let y = 0;
  let increment = 50;

  const copy = [...currentIconsGroup.children].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  copy.forEach((item, i) => {
    currentIconsGroup.appendChild(item);
    x = i % 10 === 0 ? 0 : x + increment;
    y = i % 10 === 0 ? y + increment : y;
    item.x = x;
    item.y = y;
  });
};

const optimize = () => {
  // TODO: action to optimize svg
};

figma.ui.onmessage = async (msg) => {
  if (msg.type === "optimize") {
    optimize();
  }
  if (msg.type === "list") {
    generateList();
  }
  if (msg.type === "sortList") {
    sortList();
  }
  if (msg.type === "compare") {
    grabDiffData();
  }
  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
