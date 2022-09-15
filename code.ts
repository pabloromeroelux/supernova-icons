// What does the plugin do?
// clones the page components into a flat display of components with no variants.
// rename the new components to match the desired directories in Supernova.

let i = 0;
let x = 0;
let y = 0;
let increment = 50;

const sortedGroups = figma.currentPage.children
  .map((c) => c)
  .sort((a, b) => a.name.localeCompare(b.name));

sortedGroups.forEach((comp) => {
  console.log(comp.name, "!!!!!!!");
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
      const path = c.name
        .replace(/=/g, "_")
        .replace(/\s/g, "")
        .replace(/Style_/g, "")
        .replace(/_/g, " ")
        .split(",")
        .join(" ");

      newComponent.name = `${compSetCaitegory}/${c.parent?.name}/${path}`;

      newComponent.x = x;
      newComponent.y = y;
      i++;
      x = i % 10 === 0 ? 0 : x + increment;
      y = i % 10 === 0 ? y + increment : y;
    });
  });
});

figma.closePlugin();
